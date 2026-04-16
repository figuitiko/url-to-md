import { render, screen } from "@testing-library/react";

import { MarkdownPreview } from "@/components/markdown-preview";

describe("MarkdownPreview", () => {
  it("drops unsafe link protocols from the preview surface", () => {
    render(<MarkdownPreview markdown="[Click me](javascript:alert(1))" />);

    expect(screen.getByText("Click me")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Click me" })).not.toBeInTheDocument();
  });
});
