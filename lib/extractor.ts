import "server-only";

import { lookup as dnsLookup } from "node:dns/promises";
import { isIP } from "node:net";

import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

import { Site2MarkdownError } from "./errors";
import { isPrivateHostname } from "./utils";
import { normalizePublicUrl } from "./validations";

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
const DEFAULT_MAX_REDIRECTS = 5;
const HTML_CONTENT_TYPE_PATTERN = /^(text\/html|application\/xhtml\+xml)(?:\s*;|$)/iu;
const REQUEST_HEADERS = {
  accept: "text/html,application/xhtml+xml",
  "user-agent": "Site2Markdown/0.1 (+https://site2markdown.local)",
};

export interface ExtractedReadablePage {
  sourceUrl: string;
  finalUrl: string;
  title: string | null;
  siteName: string | null;
  byline: string | null;
  excerpt: string | null;
  contentHtml: string;
}

interface LookupAddress {
  address: string;
  family: number;
}

export interface ExtractReadablePageOptions {
  fetchImpl?: typeof fetch;
  lookup?: (hostname: string) => Promise<LookupAddress[]>;
  timeoutMs?: number;
  maxResponseBytes?: number;
  maxRedirects?: number;
}

function trimToNull(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

async function defaultLookup(hostname: string): Promise<LookupAddress[]> {
  return dnsLookup(hostname, {
    all: true,
    verbatim: true,
  });
}

/**
 * Best-effort SSRF preflight.
 *
 * This validates the hostname syntax and the currently resolved addresses before
 * handing the URL to fetch(). With the standard Fetch API in Node/Next we do not
 * get a way to pin the validated address to the eventual socket connection, so
 * this is an honest preflight/redirect screen rather than strong transport-bound
 * SSRF enforcement.
 */
async function assertPublicNetworkTarget(url: URL, lookup: NonNullable<ExtractReadablePageOptions["lookup"]>) {
  const hostname = url.hostname;

  if (isPrivateHostname(hostname)) {
    throw new Site2MarkdownError("PRIVATE_NETWORK", "The requested URL resolves to a private network address.");
  }

  const resolvedAddresses =
    isIP(hostname) === 0
      ? await lookup(hostname)
      : [
          {
            address: hostname,
            family: isIP(hostname),
          },
        ];

  if (resolvedAddresses.length === 0) {
    throw new Site2MarkdownError("HOST_RESOLUTION_FAILED", "Could not resolve the requested host.");
  }

  for (const entry of resolvedAddresses) {
    if (isPrivateHostname(entry.address)) {
      throw new Site2MarkdownError("PRIVATE_NETWORK", "The requested URL resolves to a private network address.");
    }
  }
}

function isRedirectStatus(status: number) {
  return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}

async function fetchWithRedirectProtection(
  sourceUrl: string,
  options: Required<Pick<ExtractReadablePageOptions, "fetchImpl" | "lookup" | "maxRedirects">> & {
    signal: AbortSignal;
  },
) {
  let currentUrl = sourceUrl;

  for (let redirectCount = 0; redirectCount <= options.maxRedirects; redirectCount += 1) {
    const currentTarget = new URL(currentUrl);
    await assertPublicNetworkTarget(currentTarget, options.lookup);

    const response = await options.fetchImpl(currentUrl, {
      headers: REQUEST_HEADERS,
      redirect: "manual",
      signal: options.signal,
    });

    if (!isRedirectStatus(response.status)) {
      return {
        response,
        finalUrl: currentUrl,
      };
    }

    const location = response.headers.get("location");

    if (!location) {
      throw new Site2MarkdownError("REDIRECT_MISSING_LOCATION", "The remote server returned a redirect without a location.");
    }

    if (redirectCount === options.maxRedirects) {
      throw new Site2MarkdownError("TOO_MANY_REDIRECTS", "The requested URL redirected too many times.");
    }

    currentUrl = normalizePublicUrl(new URL(location, currentUrl).toString());
  }

  throw new Site2MarkdownError("TOO_MANY_REDIRECTS", "The requested URL redirected too many times.");
}

async function readResponseText(response: Response, maxResponseBytes: number) {
  const declaredLength = response.headers.get("content-length");

  if (declaredLength) {
    const parsedLength = Number.parseInt(declaredLength, 10);

        if (Number.isFinite(parsedLength) && parsedLength > maxResponseBytes) {
      throw new Site2MarkdownError("PAGE_TOO_LARGE", "The requested page is too large to process safely.");
    }
  }

  if (!response.body) {
    const text = await response.text();

    if (Buffer.byteLength(text) > maxResponseBytes) {
      throw new Site2MarkdownError("PAGE_TOO_LARGE", "The requested page is too large to process safely.");
    }

    return text;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let totalBytes = 0;
  let html = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;
      if (!value) continue;

      totalBytes += value.byteLength;

      if (totalBytes > maxResponseBytes) {
        await reader.cancel("Response exceeded maximum allowed size.").catch(() => undefined);
        throw new Site2MarkdownError("PAGE_TOO_LARGE", "The requested page is too large to process safely.");
      }

      html += decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }

  html += decoder.decode();
  return html;
}

function extractArticleFromHtml(html: string, finalUrl: string) {
  const dom = new JSDOM(html, {
    url: finalUrl,
  });

  const article = new Readability(dom.window.document).parse();
  const contentHtml = article?.content?.trim();

  if (!contentHtml) {
    throw new Site2MarkdownError("NO_READABLE_CONTENT", "No meaningful readable content was found on the requested page.");
  }

  const contentText = new JSDOM(contentHtml).window.document.body.textContent?.trim();

  if (!contentText) {
    throw new Site2MarkdownError("NO_READABLE_CONTENT", "No meaningful readable content was found on the requested page.");
  }

  return {
    title: trimToNull(article.title) ?? trimToNull(dom.window.document.title),
    siteName: trimToNull(article.siteName),
    byline: trimToNull(article.byline),
    excerpt: trimToNull(article.excerpt),
    contentHtml,
  };
}

export async function extractReadablePage(
  inputUrl: string,
  options: ExtractReadablePageOptions = {},
): Promise<ExtractedReadablePage> {
  const sourceUrl = normalizePublicUrl(inputUrl);
  const fetchImpl = options.fetchImpl ?? fetch;
  const lookup = options.lookup ?? defaultLookup;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxResponseBytes = options.maxResponseBytes ?? DEFAULT_MAX_RESPONSE_BYTES;
  const maxRedirects = options.maxRedirects ?? DEFAULT_MAX_REDIRECTS;
  const controller = new AbortController();
  let didTimeout = false;
  const timeout = setTimeout(() => {
    didTimeout = true;
    controller.abort();
  }, timeoutMs);

  try {
    const { response, finalUrl } = await fetchWithRedirectProtection(sourceUrl, {
      fetchImpl,
      lookup,
      maxRedirects,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Site2MarkdownError("HTTP_STATUS", `Request failed with status ${response.status}.`, {
        status: response.status,
      });
    }

    const contentType = response.headers.get("content-type")?.trim() ?? "";

    if (!HTML_CONTENT_TYPE_PATTERN.test(contentType)) {
      throw new Site2MarkdownError("NON_HTML_CONTENT", "The requested URL did not return HTML content.");
    }

    const html = await readResponseText(response, maxResponseBytes);
    const article = extractArticleFromHtml(html, finalUrl);

    return {
      sourceUrl,
      finalUrl,
      ...article,
    };
  } catch (error) {
    if (didTimeout && (controller.signal.aborted || (error instanceof DOMException && error.name === "AbortError"))) {
      throw new Site2MarkdownError("REQUEST_TIMEOUT", "The request timed out before the page could be fetched.", {
        cause: error,
      });
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
