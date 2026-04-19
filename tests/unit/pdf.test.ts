import { beforeEach, describe, expect, it, vi } from "vitest";

import { extractPdf, MAX_PDF_BYTES } from "@/lib/pdf";

vi.mock("pdfjs-dist/legacy/build/pdf.mjs", () => ({
  getDocument: vi.fn(),
  GlobalWorkerOptions: {},
}));

const { workerMessageHandler } = vi.hoisted(() => ({
  workerMessageHandler: { setup: vi.fn() },
}));

vi.mock("pdfjs-dist/legacy/build/pdf.worker.mjs", () => ({
  WorkerMessageHandler: workerMessageHandler,
}));

import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const mockedGetDocument = vi.mocked(getDocument);

function createPdfFile(name = "sample.pdf", size = 10) {
  const bytes = new Uint8Array(size).fill(65);
  return new File([bytes], name, { type: "application/pdf" });
}

describe("extractPdf", () => {
  beforeEach(() => {
    mockedGetDocument.mockReset();
    workerMessageHandler.setup.mockReset();
    delete (globalThis as typeof globalThis & { pdfjsWorker?: unknown }).pdfjsWorker;
  });

  it("registers the bundled pdfjs worker handler before loading a document", async () => {
    const mockPdf = {
      numPages: 1,
      getPage: vi.fn().mockResolvedValue({
        getTextContent: vi.fn().mockResolvedValue({
          items: [{ str: "Hello", hasEOL: false }],
        }),
      }),
      getMetadata: vi.fn().mockResolvedValue({
        info: {},
      }),
      destroy: vi.fn().mockResolvedValue(undefined),
    };

    mockedGetDocument.mockReturnValue({
      promise: Promise.resolve(mockPdf),
    } as never);

    await extractPdf(createPdfFile());

    expect(
      (globalThis as typeof globalThis & { pdfjsWorker?: { WorkerMessageHandler?: unknown } })
        .pdfjsWorker?.WorkerMessageHandler,
    ).toBe(workerMessageHandler);
  });

  it("requires a PDF file", async () => {
    await expect(extractPdf(null)).rejects.toMatchObject({
      code: "PDF_FILE_REQUIRED",
    });
  });

  it("rejects unsupported file types", async () => {
    const file = new File(["hello"], "notes.txt", { type: "text/plain" });

    await expect(extractPdf(file)).rejects.toMatchObject({
      code: "PDF_INVALID_TYPE",
    });
  });

  it("rejects files larger than 10MB", async () => {
    const bytes = new Uint8Array(MAX_PDF_BYTES + 1).fill(1);
    const file = new File([bytes], "large.pdf", { type: "application/pdf" });

    await expect(extractPdf(file)).rejects.toMatchObject({
      code: "PDF_TOO_LARGE",
    });
  });

  it("extracts page text and metadata from a PDF", async () => {
    const mockPdf = {
      numPages: 2,
      getPage: vi
        .fn()
        .mockResolvedValueOnce({
          getTextContent: vi.fn().mockResolvedValue({
            items: [
              { str: "Hello", hasEOL: false },
              { str: "world", hasEOL: true },
            ],
          }),
        })
        .mockResolvedValueOnce({
          getTextContent: vi.fn().mockResolvedValue({
            items: [{ str: "Page two", hasEOL: false }],
          }),
        }),
      getMetadata: vi.fn().mockResolvedValue({
        info: {
          Title: "Sample Doc",
        },
      }),
      destroy: vi.fn().mockResolvedValue(undefined),
    };

    mockedGetDocument.mockReturnValue({
      promise: Promise.resolve(mockPdf),
    } as never);

    const result = await extractPdf(createPdfFile());

    expect(result).toEqual({
      fileName: "sample.pdf",
      title: "Sample Doc",
      pageCount: 2,
      pages: ["Hello world", "Page two"],
    });
    expect(mockPdf.destroy).toHaveBeenCalledTimes(1);
  });

  it("fails when the PDF exceeds the page limit", async () => {
    const mockPdf = {
      numPages: 201,
      destroy: vi.fn().mockResolvedValue(undefined),
    };

    mockedGetDocument.mockReturnValue({
      promise: Promise.resolve(mockPdf),
    } as never);

    await expect(extractPdf(createPdfFile())).rejects.toMatchObject({
      code: "PDF_TOO_MANY_PAGES",
    });
  });

  it("fails when no text can be extracted", async () => {
    const mockPdf = {
      numPages: 1,
      getPage: vi.fn().mockResolvedValue({
        getTextContent: vi.fn().mockResolvedValue({
          items: [{ str: "   ", hasEOL: false }],
        }),
      }),
      getMetadata: vi.fn().mockResolvedValue({
        info: {},
      }),
      destroy: vi.fn().mockResolvedValue(undefined),
    };

    mockedGetDocument.mockReturnValue({
      promise: Promise.resolve(mockPdf),
    } as never);

    await expect(extractPdf(createPdfFile())).rejects.toMatchObject({
      code: "PDF_NO_TEXT_CONTENT",
    });
  });

  it("maps parser errors to PDF_PARSE_FAILED", async () => {
    mockedGetDocument.mockImplementation(() => {
      throw new Error("boom");
    });

    await expect(extractPdf(createPdfFile())).rejects.toMatchObject({
      code: "PDF_PARSE_FAILED",
    });
  });
});
