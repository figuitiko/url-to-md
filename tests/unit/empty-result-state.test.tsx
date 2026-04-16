import React from "react";
import { render, screen } from "@testing-library/react";

import { EmptyResultState } from "@/components/empty-result-state";
import { en } from "@/lib/i18n/en";

describe("EmptyResultState", () => {
  it("shows the default empty-state guidance", () => {
    render(<EmptyResultState copy={en.emptyState} />);

    expect(screen.getByRole("heading", { name: /result workbench/i })).toBeInTheDocument();
    expect(screen.getByText(/paste a public url to generate a markdown artifact/i)).toBeInTheDocument();
  });
});
