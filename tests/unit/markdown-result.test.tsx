import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarkdownResult } from "@/components/markdown-result";
import { getDictionary } from "@/lib/i18n/get-dictionary";

describe("MarkdownResult", () => {
  it("renders localized result shell copy for Spanish", async () => {
    const dictionary = await getDictionary("es");

    render(
      <MarkdownResult
        data={{
          source: {
            kind: "url",
            url: "https://example.com/articulo",
          },
          title: "Artículo",
          siteName: "Ejemplo",
          markdown: "# Hola",
          filename: "articulo.md",
        }}
        pending={false}
        copy={dictionary.result}
        buttonCopy={dictionary.buttons}
      />, 
    );

    expect(screen.getByText(/extracción lista/i)).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /vista previa/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copiar markdown/i })).toBeInTheDocument();
  });

  it("shows page count metadata for PDF sources", async () => {
    const dictionary = await getDictionary("en");

    render(
      <MarkdownResult
        data={{
          source: {
            kind: "pdf",
            fileName: "paper.pdf",
            pageCount: 3,
          },
          title: "Paper",
          siteName: null,
          markdown: "# Extracted PDF",
          filename: "paper.md",
        }}
        pending={false}
        copy={dictionary.result}
        buttonCopy={dictionary.buttons}
      />,
    );

    expect(screen.getByText("paper.pdf")).toBeInTheDocument();
    expect(screen.getByText("Pages")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
