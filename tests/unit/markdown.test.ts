import { describe, expect, it } from "vitest";

import { formatExtractedPageMarkdown } from "@/lib/markdown";

describe("formatExtractedPageMarkdown", () => {
  it("prepends the metadata header in the product shape", () => {
    const result = formatExtractedPageMarkdown({
      sourceUrl: "https://example.com/article",
      title: "Example Article",
      siteName: "Example",
      retrievedAt: "2026-04-15T00:00:00.000Z",
      contentHtml: "<p>Hello world</p>",
    });

    expect(result).toBe(
      [
        "# Extracted Page",
        "",
        "- Source: https://example.com/article",
        "- Title: Example Article",
        "- Site: Example",
        "- Retrieved At: 2026-04-15T00:00:00.000Z",
        "",
        "---",
        "",
        "Hello world",
      ].join("\n"),
    );
  });

  it("converts extracted HTML with GFM support and normalizes spacing without flattening structure", () => {
    const result = formatExtractedPageMarkdown({
      sourceUrl: "https://example.com/article",
      title: "Example Article",
      siteName: "Example",
      retrievedAt: "2026-04-15T00:00:00.000Z",
      contentHtml: [
        "<h2>Heading</h2>",
        "<p>Hello</p>",
        "<p>   </p>",
        "<ul><li>First</li><li>Second</li></ul>",
        "<table>",
        "<thead><tr><th>Feature</th><th>Status</th></tr></thead>",
        "<tbody><tr><td>Tables</td><td>Yes</td></tr></tbody>",
        "</table>",
        "<pre><code>const answer = 42;\n</code></pre>",
      ].join(""),
    });

    expect(result).toContain("## Heading");
    expect(result).toContain("Hello");
    expect(result).toContain("- First");
    expect(result).toContain("| Feature | Status |");
    expect(result).toContain("```");
    expect(result).toContain("const answer = 42;");
    expect(result).not.toMatch(/\n{4,}/);
    expect(result).not.toMatch(/[ \t]+\n/);
  });

  it("removes noisy spacing around block content while preserving code fences", () => {
    const result = formatExtractedPageMarkdown({
      sourceUrl: "https://example.com/article",
      title: "Example Article",
      siteName: "Example",
      retrievedAt: "2026-04-15T00:00:00.000Z",
      contentHtml: [
        "<p>First paragraph</p>",
        "<pre><code>line 1\n\nline 2</code></pre>",
        "<p>Last paragraph</p>",
      ].join(""),
    });

    expect(result).toContain("First paragraph\n\n```");
    expect(result).toContain("line 1\n\nline 2");
    expect(result).toContain("```\n\nLast paragraph");
  });

  it("preserves hard line breaks created by markdown output", () => {
    const result = formatExtractedPageMarkdown({
      sourceUrl: "https://example.com/article",
      title: "Example Article",
      siteName: "Example",
      retrievedAt: "2026-04-15T00:00:00.000Z",
      contentHtml: "<p>First<br>Second</p>",
    });

    expect(result).toContain("First  \nSecond");
  });

  it("does not toggle fenced blocks on fence-like lines inside the code body", () => {
    const result = formatExtractedPageMarkdown({
      sourceUrl: "https://example.com/article",
      title: "Example Article",
      siteName: "Example",
      retrievedAt: "2026-04-15T00:00:00.000Z",
      contentHtml: [
        "<pre><code>``` not a fence",
        "~~~ also not a fence",
        "final line</code></pre>",
        "<p>After</p>",
      ].join(""),
    });

    expect(result).toContain("``` not a fence");
    expect(result).toContain("~~~ also not a fence");
    expect(result).toContain("After");
    expect(result.match(/^```$/gmu)).toHaveLength(2);
  });

  it("preserves internal blank lines in language-tagged fenced code blocks", () => {
    const result = formatExtractedPageMarkdown({
      sourceUrl: "https://example.com/article",
      title: "Example Article",
      siteName: "Example",
      retrievedAt: "2026-04-15T00:00:00.000Z",
      contentHtml: [
        "<pre><code class=\"language-ts\">const first = 1;",
        "",
        "const second = 2;</code></pre>",
        "<p>After</p>",
      ].join(""),
    });

    expect(result).toContain("```ts");
    expect(result).toContain("const first = 1;\n\nconst second = 2;");
    expect(result).toContain("```\n\nAfter");
  });
});
