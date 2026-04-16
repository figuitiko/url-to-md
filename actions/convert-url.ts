"use server";

import { isSite2MarkdownError, type Site2MarkdownErrorCode } from "@/lib/errors";
import { extractReadablePage } from "@/lib/extractor";
import { formatExtractedPageMarkdown } from "@/lib/markdown";
import { buildDownloadFilename } from "@/lib/metadata";
import { normalizePublicUrl } from "@/lib/validations";

export interface ConvertIdleState {
  status: "idle";
  message: string;
}

export interface ConvertErrorState {
  status: "error";
  error: string;
}

export interface ConvertSuccessState {
  status: "success";
  data: {
    sourceUrl: string;
    title: string | null;
    siteName: string | null;
    markdown: string;
    filename: string;
  };
}

export type ConvertState = ConvertIdleState | ConvertErrorState | ConvertSuccessState;

const INITIAL_MESSAGE = "Paste a public URL to extract markdown.";
const FALLBACK_ERROR_MESSAGE = "We couldn’t convert that URL. Please try another public page.";
const FRIENDLY_ERROR_MESSAGES = {
  EMPTY_URL: "Enter a URL.",
  INVALID_URL: "Enter an absolute URL.",
  UNSUPPORTED_PROTOCOL: "Enter a public HTTP(S) URL.",
  PRIVATE_NETWORK: "That URL points to a private or blocked network location.",
  HOST_RESOLUTION_FAILED: "We couldn’t resolve that host. Check the URL and try again.",
  REDIRECT_MISSING_LOCATION: "That page returned an invalid redirect.",
  TOO_MANY_REDIRECTS: "That page redirected too many times to process safely.",
  REQUEST_TIMEOUT: "The request timed out before the page could be fetched.",
  NON_HTML_CONTENT: "That URL did not return HTML content.",
  PAGE_TOO_LARGE: "That page is too large to process safely.",
  NO_READABLE_CONTENT: "We couldn’t find meaningful article content on that page.",
  UNKNOWN: FALLBACK_ERROR_MESSAGE,
} satisfies Record<Exclude<Site2MarkdownErrorCode, "HTTP_STATUS">, string>;

export const initialConvertState: ConvertState = {
  status: "idle",
  message: INITIAL_MESSAGE,
};

function getUrlFromFormData(formData: FormData) {
  const value = formData.get("url");
  return typeof value === "string" ? value : "";
}

function getFriendlyErrorMessage(error: unknown) {
  if (!isSite2MarkdownError(error)) {
    return FALLBACK_ERROR_MESSAGE;
  }

  if (error.code === "HTTP_STATUS") {
    if (error.status === 403) return "That page is blocking automated access right now.";
    if (error.status === 404) return "That page could not be found.";
    if (error.status && error.status >= 500) return "That page is having a server error right now.";
    return error.status ? `That page returned an HTTP ${error.status} response.` : FALLBACK_ERROR_MESSAGE;
  }

  return FRIENDLY_ERROR_MESSAGES[error.code] ?? FALLBACK_ERROR_MESSAGE;
}

export async function convertUrl(_: ConvertState, formData: FormData): Promise<ConvertState> {
  try {
    const sourceUrl = normalizePublicUrl(getUrlFromFormData(formData));
    const extracted = await extractReadablePage(sourceUrl);

    const markdown = formatExtractedPageMarkdown({
      sourceUrl,
      title: extracted.title,
      siteName: extracted.siteName,
      retrievedAt: new Date().toISOString(),
      contentHtml: extracted.contentHtml,
    });

    return {
      status: "success",
      data: {
        sourceUrl,
        title: extracted.title,
        siteName: extracted.siteName,
        markdown,
        filename: buildDownloadFilename(extracted.title),
      },
    };
  } catch (error) {
    return {
      status: "error",
      error: getFriendlyErrorMessage(error),
    };
  }
}
