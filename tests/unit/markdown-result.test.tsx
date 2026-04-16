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
          sourceUrl: "https://example.com/articulo",
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
});
