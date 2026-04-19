import { beforeEach, describe, expect, it, vi } from "vitest";

import { convertUrl } from "@/actions/convert-url";
import { initialConvertState } from "@/lib/convert-state";

vi.mock("@/lib/validations", () => ({
  normalizePublicUrl: vi.fn((value: string) => value.trim()),
}));

vi.mock("@/lib/extractor", () => ({
  extractReadablePage: vi.fn(),
}));

vi.mock("@/lib/pdf", () => ({
  extractPdf: vi.fn(),
}));

vi.mock("@/lib/markdown", () => ({
  formatExtractedPageMarkdown: vi.fn(() => "url-markdown"),
  formatExtractedPdfMarkdown: vi.fn(() => "pdf-markdown"),
}));

vi.mock("@/lib/metadata", () => ({
  buildDownloadFilename: vi.fn(() => "output.md"),
}));

import { extractReadablePage } from "@/lib/extractor";
import { extractPdf } from "@/lib/pdf";

const mockedExtractReadablePage = vi.mocked(extractReadablePage);
const mockedExtractPdf = vi.mocked(extractPdf);

describe("convertUrl", () => {
  beforeEach(() => {
    mockedExtractReadablePage.mockReset();
    mockedExtractPdf.mockReset();
  });

  it("converts URL mode by default", async () => {
    mockedExtractReadablePage.mockResolvedValue({
      sourceUrl: "https://example.com",
      finalUrl: "https://example.com",
      title: "Example",
      siteName: "Example Site",
      byline: null,
      excerpt: null,
      contentHtml: "<p>Hello</p>",
    });

    const formData = new FormData();
    formData.set("url", "https://example.com");

    const result = await convertUrl(initialConvertState, formData);

    expect(result).toEqual({
      status: "success",
      data: {
        source: {
          kind: "url",
          url: "https://example.com",
        },
        title: "Example",
        siteName: "Example Site",
        markdown: "url-markdown",
        filename: "output.md",
      },
    });
  });

  it("converts PDF mode when selected", async () => {
    mockedExtractPdf.mockResolvedValue({
      fileName: "sample.pdf",
      title: "Sample",
      pageCount: 3,
      pages: ["one", "two", "three"],
    });

    const formData = new FormData();
    formData.set("sourceMode", "pdf");
    formData.set("pdf", new File(["%PDF"], "sample.pdf", { type: "application/pdf" }));

    const result = await convertUrl(initialConvertState, formData);

    expect(result).toEqual({
      status: "success",
      data: {
        source: {
          kind: "pdf",
          fileName: "sample.pdf",
          pageCount: 3,
        },
        title: "Sample",
        siteName: null,
        markdown: "pdf-markdown",
        filename: "output.md",
      },
    });
  });

  it("maps unexpected errors to UNKNOWN", async () => {
    mockedExtractReadablePage.mockImplementation(async () => {
      throw new Error("boom");
    });

    const formData = new FormData();
    formData.set("url", "https://example.com");

    const result = await convertUrl(initialConvertState, formData);

    expect(result).toEqual({
      status: "error",
      errorCode: "UNKNOWN",
    });
  });
});
