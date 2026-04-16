import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { usePathname } = vi.hoisted(() => ({
  usePathname: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname,
}));

import { LocaleSwitcher } from "@/components/locale-switcher";

describe("LocaleSwitcher", () => {
  it("links to the alternate locale while preserving the current path", () => {
    usePathname.mockReturnValue("/es/docs/article");

    render(<LocaleSwitcher locale="es" />);

    const link = screen.getByRole("link", { name: /switch to english/i });
    expect(link).toHaveAttribute("href", "/en/docs/article");
    expect(link).toHaveTextContent("EN");
  });

  it("falls back to the locale root when the current path is missing", () => {
    usePathname.mockReturnValue(null);

    render(<LocaleSwitcher locale="en" />);

    const link = screen.getByRole("link", { name: /cambiar a español/i });
    expect(link).toHaveAttribute("href", "/es");
    expect(link).toHaveTextContent("ES");
  });
});
