import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

export interface ExtractedPageMarkdownInput {
  sourceUrl: string;
  title: string | null;
  siteName: string | null;
  retrievedAt: string;
  contentHtml: string;
}

const FALLBACK_TEXT = "Unknown";

function createTurndownService() {
  const service = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  });

  service.use(gfm);
  service.remove(["script", "style", "noscript", "iframe", "canvas", "svg"]);

  return service;
}

const turndownService = createTurndownService();

function parseFenceStartLine(line: string) {
  const match = line.match(/^[ \t]{0,3}(`{3,}|~{3,})(.*)$/u);

  if (!match) return null;

  return {
    marker: match[1][0],
    length: match[1].length,
  };
}

function buildFenceEndPattern(marker: "`" | "~", length: number) {
  const escapedMarker = marker === "`" ? "`" : "~";
  return new RegExp(`^[ \\t]{0,3}${escapedMarker}{${Math.max(3, length)},}[ \\t]*$`, "u");
}

function normalizeBlockSpacing(markdown: string) {
  const lines = markdown.replace(/\r\n?/gu, "\n").split("\n");
  const normalizedLines: string[] = [];
  let blankRun = 0;
  let fenceEndPattern: RegExp | null = null;

  for (const line of lines) {
    if (fenceEndPattern) {
      normalizedLines.push(line);

      if (fenceEndPattern.test(line)) {
        fenceEndPattern = null;
      }

      continue;
    }

    const fenceStart = parseFenceStartLine(line);

    if (fenceStart) {
      if (blankRun > 0 && normalizedLines.length > 0) {
        normalizedLines.push("");
      }

      blankRun = 0;
      fenceEndPattern = buildFenceEndPattern(fenceStart.marker, fenceStart.length);
      normalizedLines.push(line);
      continue;
    }

    if (line.trim().length === 0) {
      blankRun += 1;
      continue;
    }

    if (blankRun > 0 && normalizedLines.length > 0) {
      normalizedLines.push("");
    }

    blankRun = 0;
    normalizedLines.push(line);
  }

  while (normalizedLines.length > 0 && normalizedLines[0] === "") {
    normalizedLines.shift();
  }

  while (normalizedLines.length > 0 && normalizedLines[normalizedLines.length - 1] === "") {
    normalizedLines.pop();
  }

  return normalizedLines.join("\n");
}

function convertHtmlToMarkdown(contentHtml: string) {
  return normalizeBlockSpacing(turndownService.turndown(contentHtml));
}

function buildMetadataHeader(input: Pick<ExtractedPageMarkdownInput, "sourceUrl" | "title" | "siteName" | "retrievedAt">) {
  return [
    "# Extracted Page",
    "",
    `- Source: ${input.sourceUrl}`,
    `- Title: ${input.title ?? FALLBACK_TEXT}`,
    `- Site: ${input.siteName ?? FALLBACK_TEXT}`,
    `- Retrieved At: ${input.retrievedAt}`,
    "",
    "---",
  ].join("\n");
}

export function formatExtractedPageMarkdown(input: ExtractedPageMarkdownInput) {
  const body = convertHtmlToMarkdown(input.contentHtml);
  const header = buildMetadataHeader(input);

  return body ? `${header}\n\n${body}` : header;
}
