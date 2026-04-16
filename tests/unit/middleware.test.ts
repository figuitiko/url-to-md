import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import { middleware } from "@/middleware";

describe("middleware", () => {
  it("sets the locale header from the pathname", () => {
    const request = new NextRequest("https://site2markdown.test/es");
    const response = middleware(request);

    expect(response.headers.get("x-middleware-request-x-site-locale")).toBe("es");
  });

  it("falls back to the default locale for the root path", () => {
    const request = new NextRequest("https://site2markdown.test/");
    const response = middleware(request);

    expect(response.headers.get("x-middleware-request-x-site-locale")).toBe("en");
  });
});
