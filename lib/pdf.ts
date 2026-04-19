import "server-only";

import path from "node:path";
import { createRequire } from "node:module";

import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { WorkerMessageHandler } from "pdfjs-dist/legacy/build/pdf.worker.mjs";

import { Site2MarkdownError } from "@/lib/errors";

export const MAX_PDF_BYTES = 10 * 1024 * 1024;
export const MAX_PDF_PAGES = 200;

interface PdfTextItem {
  str?: string;
  hasEOL?: boolean;
}

interface PdfPage {
  getTextContent: () => Promise<{
    items: unknown[];
  }>;
}

interface PdfDocument {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfPage>;
  getMetadata: () => Promise<unknown>;
  destroy: () => Promise<void> | void;
}

export interface ExtractedPdf {
  fileName: string;
  title: string | null;
  pageCount: number;
  pages: string[];
}

const require = createRequire(import.meta.url);
const pdfjsDistRoot = path.dirname(require.resolve("pdfjs-dist/package.json"));
const standardFontDataUrl = path.join(pdfjsDistRoot, "standard_fonts") + path.sep;
const cMapUrl = path.join(pdfjsDistRoot, "cmaps") + path.sep;

function ensurePdfJsWorker() {
  const globalWithPdfJsWorker = globalThis as typeof globalThis & {
    pdfjsWorker?: {
      WorkerMessageHandler?: typeof WorkerMessageHandler;
    };
  };

  globalWithPdfJsWorker.pdfjsWorker = {
    ...globalWithPdfJsWorker.pdfjsWorker,
    WorkerMessageHandler,
  };
}

function normalizeText(value: string | undefined) {
  const normalized = value?.replace(/\s+/gu, " ").trim();
  return normalized ? normalized : "";
}

function normalizePageText(value: string) {
  const lines = value
    .replace(/\r\n?/gu, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.join("\n");
}

function getValidatedPdfFile(fileInput: FormDataEntryValue | null): File {
  const file = fileInput instanceof File ? fileInput : null;

  if (!file) {
    throw new Site2MarkdownError("PDF_FILE_REQUIRED", "Upload a PDF file.");
  }

  const hasPdfMime = file.type === "application/pdf";
  const hasPdfExtension = /\.pdf$/iu.test(file.name);

  if (!hasPdfMime && !hasPdfExtension) {
    throw new Site2MarkdownError("PDF_INVALID_TYPE", "Upload a valid PDF file.");
  }

  if (file.size > MAX_PDF_BYTES) {
    throw new Site2MarkdownError("PDF_TOO_LARGE", "The uploaded PDF exceeds the size limit.");
  }

  if (file.size === 0) {
    throw new Site2MarkdownError("PDF_PARSE_FAILED", "The uploaded PDF file is empty.");
  }

  return file;
}

async function extractPageText(pdf: PdfDocument, pageNumber: number) {
  const page = await pdf.getPage(pageNumber);
  const textContent = await page.getTextContent();
  const chunks: string[] = [];

  for (const rawItem of textContent.items) {
    const item = rawItem as PdfTextItem;

    if (typeof item.str !== "string") {
      continue;
    }

    const text = normalizeText(item.str);

    if (!text) {
      continue;
    }

    chunks.push(text);

    if (item.hasEOL) {
      chunks.push("\n");
    }
  }

  const rawText = chunks.join(" ").replace(/\s*\n\s*/gu, "\n");
  return normalizePageText(rawText);
}

function readPdfMetadataTitle(metadata: unknown) {
  if (typeof metadata !== "object" || metadata === null || !("info" in metadata)) {
    return null;
  }

  const info = (metadata as { info?: unknown }).info;

  if (typeof info !== "object" || info === null || !("Title" in info)) {
    return null;
  }

  const title = (info as { Title?: unknown }).Title;
  return typeof title === "string" ? normalizeText(title) || null : null;
}

export async function extractPdf(fileInput: FormDataEntryValue | null): Promise<ExtractedPdf> {
  const file = getValidatedPdfFile(fileInput);

  try {
    const buffer =
      typeof file.arrayBuffer === "function"
        ? await file.arrayBuffer()
        : await new Response(file).arrayBuffer();

    ensurePdfJsWorker();

    const task = getDocument({
      data: new Uint8Array(buffer),
      cMapUrl,
      cMapPacked: true,
      standardFontDataUrl,
      isEvalSupported: false,
    });

    const pdf = (await task.promise) as PdfDocument;

    if (pdf.numPages > MAX_PDF_PAGES) {
      throw new Site2MarkdownError("PDF_TOO_MANY_PAGES", "The uploaded PDF has too many pages.");
    }

    const pages = await Promise.all(
      Array.from({ length: pdf.numPages }, (_, index) => extractPageText(pdf, index + 1)),
    );

    const hasExtractedText = pages.some((pageText) => pageText.length > 0);

    if (!hasExtractedText) {
      throw new Site2MarkdownError("PDF_NO_TEXT_CONTENT", "The uploaded PDF does not contain extractable text.");
    }

    const metadata = await pdf.getMetadata().catch(() => null);
    const title = readPdfMetadataTitle(metadata);

    await pdf.destroy();

    return {
      fileName: file.name,
      title,
      pageCount: pdf.numPages,
      pages,
    };
  } catch (error) {
    if (error instanceof Site2MarkdownError) {
      throw error;
    }

    throw new Site2MarkdownError("PDF_PARSE_FAILED", "The uploaded PDF could not be parsed.", {
      cause: error,
    });
  }
}
