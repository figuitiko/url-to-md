import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { setTheme, useTheme } = vi.hoisted(() => ({
  setTheme: vi.fn(),
  useTheme: vi.fn(),
}));

vi.mock("next-themes", () => ({
  useTheme,
}));

import { ThemeToggle } from "@/components/theme-toggle";
import { en } from "@/lib/i18n/en";

describe("ThemeToggle", () => {
  afterEach(() => {
    setTheme.mockReset();
    useTheme.mockReset();
  });

  it("shows the dark theme state and switches to light", async () => {
    useTheme.mockReturnValue({
      resolvedTheme: "dark",
      setTheme,
    });

    render(<ThemeToggle labels={en.shell.themeToggle} />);

    const button = await screen.findByRole("button", {
      name: /switch to light theme/i,
    });

    expect(button).toHaveTextContent("Dark");

    fireEvent.click(button);

    expect(setTheme).toHaveBeenCalledWith("light");
  });

  it("shows the light theme state and switches to dark", async () => {
    useTheme.mockReturnValue({
      resolvedTheme: "light",
      setTheme,
    });

    render(<ThemeToggle labels={en.shell.themeToggle} />);

    const button = await screen.findByRole("button", {
      name: /switch to dark theme/i,
    });

    expect(button).toHaveTextContent("Light");

    fireEvent.click(button);

    expect(setTheme).toHaveBeenCalledWith("dark");
  });
});
