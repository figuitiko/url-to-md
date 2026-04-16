import { describe, expect, it } from "vitest";

import { normalizePublicUrl } from "@/lib/validations";

describe("normalizePublicUrl", () => {
  it("accepts a public https URL", () => {
    expect(normalizePublicUrl("https://example.com/docs")).toBe("https://example.com/docs");
  });

  it("trims surrounding whitespace before validating", () => {
    expect(normalizePublicUrl("  https://example.com/docs?q=1  ")).toBe("https://example.com/docs?q=1");
  });

  it("rejects localhost URLs", () => {
    expect(() => normalizePublicUrl("http://localhost:3000")).toThrow(/public http/i);
    expect(() => normalizePublicUrl("http://app.localhost")).toThrow(/public http/i);
  });

  it("rejects embedded credentials in the URL", () => {
    expect(() => normalizePublicUrl("https://user@example.com")).toThrow(/public http/i);
    expect(() => normalizePublicUrl("https://user:secret@example.com")).toThrow(/public http/i);
  });

  it("rejects internal hostnames without a public suffix", () => {
    expect(() => normalizePublicUrl("http://intranet")).toThrow(/public http/i);
    expect(() => normalizePublicUrl("http://printer.lan")).toThrow(/public http/i);
  });

  it("rejects private and loopback IP addresses", () => {
    expect(() => normalizePublicUrl("http://127.0.0.1/article")).toThrow(/public http/i);
    expect(() => normalizePublicUrl("http://192.168.1.10/article")).toThrow(/public http/i);
    expect(() => normalizePublicUrl("http://100.64.1.20/article")).toThrow(/public http/i);
    expect(() => normalizePublicUrl("http://[::1]/article")).toThrow(/public http/i);
  });

  it("rejects unsupported protocols and relative input", () => {
    expect(() => normalizePublicUrl("ftp://example.com")).toThrow(/public http/i);
    expect(() => normalizePublicUrl("/docs")).toThrow(/absolute url/i);
  });
});
