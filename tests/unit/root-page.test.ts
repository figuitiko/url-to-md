import { describe, expect, it, vi } from "vitest";

const redirect = vi.fn();

vi.mock("next/navigation", () => ({
  redirect,
}));

describe("app/page", () => {
  it("redirects the root route to the default English locale", async () => {
    const pageModule = await import("@/app/page");

    await pageModule.default();

    expect(redirect).toHaveBeenCalledWith("/en");
  });
});
