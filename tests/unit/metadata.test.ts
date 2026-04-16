import { describe, expect, it } from "vitest";

import { buildDownloadFilename } from "@/lib/metadata";

describe("buildDownloadFilename", () => {
  it("slugifies the title into a markdown filename", () => {
    expect(buildDownloadFilename("Hello World / Intro")).toBe("hello-world-intro.md");
  });

  it("normalizes accents and strips unsafe punctuation", () => {
    expect(buildDownloadFilename("Résumé: Getting Started (v2)!")).toBe("resume-getting-started-v2.md");
  });

  it("falls back to a safe default when the title is empty", () => {
    expect(buildDownloadFilename("   ")).toBe("site2markdown-output.md");
    expect(buildDownloadFilename(null)).toBe("site2markdown-output.md");
  });

  it("caps filename length to keep downloads safe", () => {
    const longTitle = "a".repeat(300);
    const filename = buildDownloadFilename(longTitle);
    expect(filename).toMatch(/\.md$/);
    expect(filename.length).toBeLessThanOrEqual(84);
  });

  it("avoids reserved Windows device names", () => {
    expect(buildDownloadFilename("con")).toBe("con-file.md");
    expect(buildDownloadFilename("PRN")).toBe("prn-file.md");
    expect(buildDownloadFilename("com1")).toBe("com1-file.md");
    expect(buildDownloadFilename("LPT9")).toBe("lpt9-file.md");
  });
});
