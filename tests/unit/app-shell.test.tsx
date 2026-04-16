import React from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { setTheme, usePathname, useTheme } = vi.hoisted(() => ({
  setTheme: vi.fn(),
  usePathname: vi.fn(),
  useTheme: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname,
}));

vi.mock("next-themes", () => ({
  useTheme,
}));

import { AppShell } from "@/components/app-shell";
import { en } from "@/lib/i18n/en";

describe("AppShell", () => {
  afterEach(() => {
    setTheme.mockReset();
    usePathname.mockReset();
    useTheme.mockReset();
  });

  it("renders both the theme toggle and locale switcher in the shared header", async () => {
    usePathname.mockReturnValue("/en/docs/article");
    useTheme.mockReturnValue({
      resolvedTheme: "dark",
      setTheme,
    });

    render(
      <AppShell locale="en" copy={en.shell}>
        <div>Workbench child</div>
      </AppShell>,
    );

    expect(
      await screen.findByRole("button", { name: /switch to light theme/i }),
    ).toHaveTextContent("Dark");
    expect(
      screen.getByRole("link", { name: /cambiar a español/i }),
    ).toHaveAttribute("href", "/es/docs/article");
    expect(screen.getByText("Workbench child")).toBeInTheDocument();
  });
});
