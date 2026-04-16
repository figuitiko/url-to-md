import { z } from "zod";

import { Site2MarkdownError } from "./errors";
import { isPrivateHostname } from "./utils";

const publicUrlSchema = z
  .string({ required_error: "Enter a URL." })
  .trim()
  .min(1, "Enter a URL.");

function parseUrl(input: string) {
  try {
    return new URL(input);
  } catch {
    throw new Site2MarkdownError("INVALID_URL", "Enter an absolute URL.");
  }
}

function ensurePublicHttpUrl(candidate: URL) {
  if (candidate.protocol !== "http:" && candidate.protocol !== "https:") {
    throw new Site2MarkdownError("UNSUPPORTED_PROTOCOL", "Enter a public HTTP(S) URL.");
  }

  if (!candidate.hostname) {
    throw new Site2MarkdownError("INVALID_URL", "Enter an absolute URL.");
  }

  if (candidate.username || candidate.password) {
    throw new Site2MarkdownError("UNSUPPORTED_PROTOCOL", "Enter a public HTTP(S) URL.");
  }

  if (isPrivateHostname(candidate.hostname)) {
    throw new Site2MarkdownError("PRIVATE_NETWORK", "Enter a public HTTP(S) URL.");
  }
}

export function normalizePublicUrl(input: string) {
  const parsedInput = publicUrlSchema.safeParse(input);

  if (!parsedInput.success) {
    throw new Site2MarkdownError("EMPTY_URL", "Enter a URL.");
  }

  const candidate = parseUrl(parsedInput.data);

  // Syntax-only screening: this validator intentionally avoids DNS resolution.
  // Later fetch-layer SSRF checks can add network-aware controls without
  // changing the semantics of this helper.
  ensurePublicHttpUrl(candidate);

  return candidate.toString();
}
