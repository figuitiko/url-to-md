import React from "react";
import { render, screen } from "@testing-library/react";

import { MarkdownPreview } from "@/components/markdown-preview";

describe("MarkdownPreview", () => {
  it("drops unsafe link protocols from the preview surface", () => {
    render(<MarkdownPreview markdown="[Click me](javascript:evil)" />);

    expect(screen.getByText(/click me/i)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Click me" })).not.toBeInTheDocument();
  });
});
