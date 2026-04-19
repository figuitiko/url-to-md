import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CopyMarkdownButton } from "@/components/copy-markdown-button";
import { en } from "@/lib/i18n/en";

const { toast } = vi.hoisted(() => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast,
}));

describe("CopyMarkdownButton", () => {
  beforeEach(() => {
    toast.success.mockReset();
    toast.error.mockReset();
  });

  it("shows a success toast after copying markdown", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(<CopyMarkdownButton markdown="# Hello" copy={en.buttons} />);

    await user.click(screen.getByRole("button", { name: /copy markdown/i }));

    expect(writeText).toHaveBeenCalledWith("# Hello");
    expect(toast.success).toHaveBeenCalled();
  });

  it("shows an error toast when copying fails", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(<CopyMarkdownButton markdown="# Hello" copy={en.buttons} />);

    await user.click(screen.getByRole("button", { name: /copy markdown/i }));

    expect(toast.error).toHaveBeenCalled();
  });
});
