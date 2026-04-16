import React from "react";
import { render, screen } from "@testing-library/react";

import { EmptyResultState } from "@/components/empty-result-state";

describe("EmptyResultState", () => {
  it("shows the default empty-state guidance", () => {
    render(<EmptyResultState />);

    expect(screen.getByRole("heading", { name: /paste a public url/i })).toBeInTheDocument();
  });
});
