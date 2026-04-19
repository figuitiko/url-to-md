import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DownloadMarkdownButton } from "@/components/download-markdown-button";
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

describe("DownloadMarkdownButton", () => {
  beforeEach(() => {
    toast.success.mockReset();
    toast.error.mockReset();
  });

  it("shows a success toast after downloading markdown", async () => {
    const user = userEvent.setup();
    const createObjectURL = vi.fn().mockReturnValue("blob:demo");
    const revokeObjectURL = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    const anchor = originalCreateElement("a");
    const click = vi.spyOn(anchor, "click").mockImplementation(() => {});
    const createElement = vi
      .spyOn(document, "createElement")
      .mockImplementation((tagName: string) => {
        if (tagName === "a") {
          return anchor;
        }

        return originalCreateElement(tagName);
      });

    vi.stubGlobal("URL", {
      createObjectURL,
      revokeObjectURL,
    });

    render(
      <DownloadMarkdownButton
        markdown="# Hello"
        filename="hello.md"
        copy={en.buttons}
      />,
    );

    await user.click(screen.getByRole("button", { name: /download \.md/i }));

    expect(click).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalled();

    createElement.mockRestore();
  });

  it("shows an error toast when download setup fails", async () => {
    const user = userEvent.setup();

    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => {
        throw new Error("blob failed");
      }),
      revokeObjectURL: vi.fn(),
    });

    render(
      <DownloadMarkdownButton
        markdown="# Hello"
        filename="hello.md"
        copy={en.buttons}
      />,
    );

    await user.click(screen.getByRole("button", { name: /download \.md/i }));

    expect(toast.error).toHaveBeenCalled();
  });
});
