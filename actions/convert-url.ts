"use server";

import type { ConvertState } from "@/lib/convert-state";
import { isSite2MarkdownError } from "@/lib/errors";
import { extractReadablePage } from "@/lib/extractor";
import { formatExtractedPageMarkdown, formatExtractedPdfMarkdown } from "@/lib/markdown";
import { buildDownloadFilename } from "@/lib/metadata";
import { extractPdf } from "@/lib/pdf";
import { normalizePublicUrl } from "@/lib/validations";

function getUrlFromFormData(formData: FormData) {
  const value = formData.get("url");
  return typeof value === "string" ? value : "";
}

function getMode(formData: FormData) {
  const value = formData.get("sourceMode");
  return value === "pdf" ? "pdf" : "url";
}

function stripPdfExtension(fileName: string) {
  return fileName.replace(/\.pdf$/iu, "");
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

async function convertFromUrl(formData: FormData): Promise<ConvertState> {
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
      source: {
        kind: "url",
        url: sourceUrl,
      },
      title: extracted.title,
      siteName: extracted.siteName,
      markdown,
      filename: buildDownloadFilename(extracted.title),
    },
  };
}

async function convertFromPdf(formData: FormData): Promise<ConvertState> {
  const extracted = await extractPdf(formData.get("pdf"));

  const markdown = formatExtractedPdfMarkdown({
    fileName: extracted.fileName,
    title: extracted.title,
    pageCount: extracted.pageCount,
    retrievedAt: new Date().toISOString(),
    pages: extracted.pages,
  });

  return {
    status: "success",
    data: {
      source: {
        kind: "pdf",
        fileName: extracted.fileName,
        pageCount: extracted.pageCount,
      },
      title: extracted.title,
      siteName: null,
      markdown,
      filename: buildDownloadFilename(extracted.title ?? stripPdfExtension(extracted.fileName)),
    },
  };
}

export async function convertUrl(_: ConvertState, formData: FormData): Promise<ConvertState> {
  try {
    return getMode(formData) === "pdf"
      ? await convertFromPdf(formData)
      : await convertFromUrl(formData);
  } catch (error) {
    return getErrorState(error);
  }
}
