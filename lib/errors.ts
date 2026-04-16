export const SITE2MARKDOWN_ERROR_CODES = [
  "EMPTY_URL",
  "INVALID_URL",
  "UNSUPPORTED_PROTOCOL",
  "PRIVATE_NETWORK",
  "HOST_RESOLUTION_FAILED",
  "REDIRECT_MISSING_LOCATION",
  "TOO_MANY_REDIRECTS",
  "REQUEST_TIMEOUT",
  "NON_HTML_CONTENT",
  "PAGE_TOO_LARGE",
  "NO_READABLE_CONTENT",
  "HTTP_STATUS",
  "UNKNOWN",
] as const;

export type Site2MarkdownErrorCode =
  (typeof SITE2MARKDOWN_ERROR_CODES)[number];

export class Site2MarkdownError extends Error {
  code: Site2MarkdownErrorCode;
  status?: number;

  constructor(code: Site2MarkdownErrorCode, message: string, options?: { status?: number; cause?: unknown }) {
    super(message);
    this.name = "Site2MarkdownError";
    this.code = code;
    this.status = options?.status;

    if (options && "cause" in options) {
      this.cause = options.cause;
    }
  }
}

export function isSite2MarkdownError(error: unknown): error is Site2MarkdownError {
  const codes = new Set<string>(SITE2MARKDOWN_ERROR_CODES);

  return (
    error instanceof Site2MarkdownError ||
    (typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof (error as { code?: unknown }).code === "string" &&
      codes.has((error as { code: string }).code) &&
      "message" in error &&
      typeof (error as { message?: unknown }).message === "string" &&
      (!("status" in error) ||
        (typeof (error as { status?: unknown }).status === "number" &&
          Number.isInteger((error as { status: number }).status))))
  );
}
