"use server";

import type { ConvertState } from "@/lib/convert-state";
import { isSite2MarkdownError } from "@/lib/errors";
import { extractReadablePage } from "@/lib/extractor";
import { formatExtractedPageMarkdown } from "@/lib/markdown";
import { buildDownloadFilename } from "@/lib/metadata";
import { normalizePublicUrl } from "@/lib/validations";

function getUrlFromFormData(formData: FormData) {
  const value = formData.get("url");
  return typeof value === "string" ? value : "";
}

function getErrorState(error: unknown): ConvertState {
  if (!isSite2MarkdownError(error)) {
    return {
      status: "error",
      errorCode: "UNKNOWN",
    };
  }

  return {
    status: "error",
    errorCode: error.code,
    errorStatus: error.status,
  };
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
    return getErrorState(error);
  }
}
