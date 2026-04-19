import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ErrorBoundary from "@/app/[locale]/error";

vi.mock("next/navigation", () => ({
  useParams: () => ({ locale: "en" }),
  usePathname: () => "/en",
}));

describe("localized route error", () => {
  it("shows recovery actions without leaking the raw runtime message", () => {
    render(
      <ErrorBoundary
        error={new Error("low-level stack explosion")}
        reset={vi.fn()}
      />, 
    );

    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
    expect(screen.getByText(/back to the workbench/i)).toBeInTheDocument();
    expect(screen.queryByText(/low-level stack explosion/i)).not.toBeInTheDocument();
  });
});
