# Site2Markdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-grade Next.js App Router application that converts one pasted website URL into clean markdown optimized for LLM workflows, rendered inline on the same page.

**Architecture:** Use a server-first App Router design with React Server Components by default and a Server Action to orchestrate validation, safe HTML fetching, Readability extraction, Turndown conversion, markdown cleanup, and typed UI responses. Keep client code minimal and limited to browser-only concerns such as clipboard copy, Blob download, and local interaction state.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Zod, jsdom, @mozilla/readability, turndown, turndown-plugin-gfm, Vitest, Testing Library

---

## Planned File Structure

### Create
- `/Users/frank/Workspace/next-js/web-to-md/package.json`
- `/Users/frank/Workspace/next-js/web-to-md/tsconfig.json`
- `/Users/frank/Workspace/next-js/web-to-md/next.config.ts`
- `/Users/frank/Workspace/next-js/web-to-md/postcss.config.mjs`
- `/Users/frank/Workspace/next-js/web-to-md/eslint.config.mjs`
- `/Users/frank/Workspace/next-js/web-to-md/components.json`
- `/Users/frank/Workspace/next-js/web-to-md/vitest.config.ts`
- `/Users/frank/Workspace/next-js/web-to-md/vitest.setup.ts`
- `/Users/frank/Workspace/next-js/web-to-md/.gitignore`
- `/Users/frank/Workspace/next-js/web-to-md/README.md`
- `/Users/frank/Workspace/next-js/web-to-md/app/layout.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/app/page.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/app/loading.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/app/error.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/app/globals.css`
- `/Users/frank/Workspace/next-js/web-to-md/actions/convert-url.ts`
- `/Users/frank/Workspace/next-js/web-to-md/lib/validations.ts`
- `/Users/frank/Workspace/next-js/web-to-md/lib/extractor.ts`
- `/Users/frank/Workspace/next-js/web-to-md/lib/markdown.ts`
- `/Users/frank/Workspace/next-js/web-to-md/lib/metadata.ts`
- `/Users/frank/Workspace/next-js/web-to-md/lib/utils.ts`
- `/Users/frank/Workspace/next-js/web-to-md/components/app-shell.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/components/url-submit-form.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/components/markdown-result.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/components/markdown-preview.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/components/copy-markdown-button.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/components/download-markdown-button.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/components/submit-button.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/components/error-message.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/components/empty-result-state.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/components/ui/*`
- `/Users/frank/Workspace/next-js/web-to-md/tests/unit/validations.test.ts`
- `/Users/frank/Workspace/next-js/web-to-md/tests/unit/markdown.test.ts`
- `/Users/frank/Workspace/next-js/web-to-md/tests/unit/extractor.test.ts`
- `/Users/frank/Workspace/next-js/web-to-md/tests/unit/metadata.test.ts`

### File responsibilities
- `app/page.tsx` — server-composed home route with form and inline result shell
- `actions/convert-url.ts` — typed Server Action result contract and orchestration
- `lib/validations.ts` — Zod schemas and SSRF-conscious URL validation helpers
- `lib/extractor.ts` — safe fetch, timeout, response-type guards, JSDOM + Readability
- `lib/markdown.ts` — Turndown configuration, GFM support, markdown cleanup, final output formatting
- `lib/metadata.ts` — page metadata shaping and safe filename generation
- `components/url-submit-form.tsx` — client form shell using Server Action state
- `components/markdown-result.tsx` — tabs, markdown panel, preview panel, action buttons
- `components/copy-markdown-button.tsx` — clipboard behavior only
- `components/download-markdown-button.tsx` — client Blob download only
- `tests/unit/*` — focused unit coverage for business logic before implementation

### Commands to use during execution
- Install deps: `npm install`
- Run unit tests: `npm run test`
- Run a single test file: `npm run test -- tests/unit/validations.test.ts`
- Run lint: `npm run lint`
- Run typecheck: `npm run typecheck`

---

### Task 1: Scaffold the Next.js App Router workspace

**Files:**
- Create: `/Users/frank/Workspace/next-js/web-to-md/package.json`
- Create: `/Users/frank/Workspace/next-js/web-to-md/tsconfig.json`
- Create: `/Users/frank/Workspace/next-js/web-to-md/next.config.ts`
- Create: `/Users/frank/Workspace/next-js/web-to-md/postcss.config.mjs`
- Create: `/Users/frank/Workspace/next-js/web-to-md/eslint.config.mjs`
- Create: `/Users/frank/Workspace/next-js/web-to-md/components.json`
- Create: `/Users/frank/Workspace/next-js/web-to-md/vitest.config.ts`
- Create: `/Users/frank/Workspace/next-js/web-to-md/vitest.setup.ts`
- Create: `/Users/frank/Workspace/next-js/web-to-md/.gitignore`

- [ ] **Step 1: Write the workspace config files**

```json
{
  "name": "site2markdown",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "lint": "eslint .",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  }
}
```

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

- [ ] **Step 2: Install the required dependencies**

Run: `npm install next react react-dom typescript @types/node @types/react @types/react-dom tailwindcss @tailwindcss/postcss eslint eslint-config-next zod jsdom @mozilla/readability turndown turndown-plugin-gfm clsx tailwind-merge lucide-react next-themes sonner class-variance-authority vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom @testing-library/user-event`

Expected: install completes without missing peer dependency errors

- [ ] **Step 3: Verify the toolchain is wired correctly**

Run: `npm run typecheck`
Expected: success or only errors pointing to files not yet created; no config parser failures

- [ ] **Step 4: Commit the scaffold**

```bash
git add /Users/frank/Workspace/next-js/web-to-md/package.json \
  /Users/frank/Workspace/next-js/web-to-md/tsconfig.json \
  /Users/frank/Workspace/next-js/web-to-md/next.config.ts \
  /Users/frank/Workspace/next-js/web-to-md/postcss.config.mjs \
  /Users/frank/Workspace/next-js/web-to-md/eslint.config.mjs \
  /Users/frank/Workspace/next-js/web-to-md/components.json \
  /Users/frank/Workspace/next-js/web-to-md/vitest.config.ts \
  /Users/frank/Workspace/next-js/web-to-md/vitest.setup.ts \
  /Users/frank/Workspace/next-js/web-to-md/.gitignore

git commit -m "chore: scaffold site2markdown workspace"
```

---

### Task 2: Implement and test URL validation + metadata helpers

**Files:**
- Create: `/Users/frank/Workspace/next-js/web-to-md/tests/unit/validations.test.ts`
- Create: `/Users/frank/Workspace/next-js/web-to-md/tests/unit/metadata.test.ts`
- Create: `/Users/frank/Workspace/next-js/web-to-md/lib/validations.ts`
- Create: `/Users/frank/Workspace/next-js/web-to-md/lib/metadata.ts`
- Create: `/Users/frank/Workspace/next-js/web-to-md/lib/utils.ts`

- [ ] **Step 1: Write the failing validation tests**

```ts
import { describe, expect, it } from "vitest";
import { normalizePublicUrl } from "@/lib/validations";

describe("normalizePublicUrl", () => {
  it("accepts a public https URL", () => {
    expect(normalizePublicUrl("https://example.com/docs")).toBe("https://example.com/docs");
  });

  it("rejects localhost URLs", () => {
    expect(() => normalizePublicUrl("http://localhost:3000")).toThrow(/public http/i);
  });

  it("rejects private IP addresses", () => {
    expect(() => normalizePublicUrl("http://192.168.1.10/article")).toThrow(/public http/i);
  });
});
```

```ts
import { describe, expect, it } from "vitest";
import { buildDownloadFilename } from "@/lib/metadata";

describe("buildDownloadFilename", () => {
  it("slugifies the title into a markdown filename", () => {
    expect(buildDownloadFilename("Hello World / Intro")).toBe("hello-world-intro.md");
  });
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `npm run test -- tests/unit/validations.test.ts tests/unit/metadata.test.ts`
Expected: FAIL because `normalizePublicUrl` and `buildDownloadFilename` do not exist yet

- [ ] **Step 3: Write the minimal implementation**

```ts
import { z } from "zod";

const urlSchema = z.string().trim().min(1, "Enter a URL.");

export function normalizePublicUrl(input: string) {
  const parsed = new URL(urlSchema.parse(input));
  if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Enter a public HTTP(S) URL.");
  if (["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(parsed.hostname)) throw new Error("Enter a public HTTP(S) URL.");
  if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(parsed.hostname)) throw new Error("Enter a public HTTP(S) URL.");
  return parsed.toString();
}
```

```ts
export function buildDownloadFilename(title: string | null | undefined) {
  const base = (title ?? "site2markdown-output")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "site2markdown-output";

  return `${base}.md`;
}
```

- [ ] **Step 4: Run the tests and verify GREEN**

Run: `npm run test -- tests/unit/validations.test.ts tests/unit/metadata.test.ts`
Expected: PASS

- [ ] **Step 5: Commit the helpers**

```bash
git add /Users/frank/Workspace/next-js/web-to-md/tests/unit/validations.test.ts \
  /Users/frank/Workspace/next-js/web-to-md/tests/unit/metadata.test.ts \
  /Users/frank/Workspace/next-js/web-to-md/lib/validations.ts \
  /Users/frank/Workspace/next-js/web-to-md/lib/metadata.ts \
  /Users/frank/Workspace/next-js/web-to-md/lib/utils.ts

git commit -m "feat: add url validation and metadata helpers"
```

---

### Task 3: Implement and test markdown formatting pipeline

**Files:**
- Create: `/Users/frank/Workspace/next-js/web-to-md/tests/unit/markdown.test.ts`
- Create: `/Users/frank/Workspace/next-js/web-to-md/lib/markdown.ts`

- [ ] **Step 1: Write the failing markdown tests**

```ts
import { describe, expect, it } from "vitest";
import { formatExtractedPageMarkdown } from "@/lib/markdown";

describe("formatExtractedPageMarkdown", () => {
  it("prepends metadata and normalizes markdown spacing", () => {
    const result = formatExtractedPageMarkdown({
      sourceUrl: "https://example.com/article",
      title: "Example Article",
      siteName: "Example",
      retrievedAt: "2026-04-15T00:00:00.000Z",
      contentHtml: "<h2>Heading</h2><p>Hello</p><p></p><p>World</p>",
    });

    expect(result).toContain("# Extracted Page");
    expect(result).toContain("- Source: https://example.com/article");
    expect(result).toContain("## Heading");
    expect(result).toContain("Hello");
    expect(result).not.toMatch(/\n{4,}/);
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm run test -- tests/unit/markdown.test.ts`
Expected: FAIL because `formatExtractedPageMarkdown` does not exist yet

- [ ] **Step 3: Write the minimal implementation**

```ts
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const service = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
service.use(gfm);

export function formatExtractedPageMarkdown(input: {
  sourceUrl: string;
  title: string | null;
  siteName: string | null;
  retrievedAt: string;
  contentHtml: string;
}) {
  const body = service.turndown(input.contentHtml)
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return [
    "# Extracted Page",
    "",
    `- Source: ${input.sourceUrl}`,
    `- Title: ${input.title ?? "Unknown"}`,
    `- Site: ${input.siteName ?? "Unknown"}`,
    `- Retrieved At: ${input.retrievedAt}`,
    "",
    "---",
    "",
    body,
  ].join("\n");
}
```

- [ ] **Step 4: Run the test and verify GREEN**

Run: `npm run test -- tests/unit/markdown.test.ts`
Expected: PASS

- [ ] **Step 5: Commit the markdown formatter**

```bash
git add /Users/frank/Workspace/next-js/web-to-md/tests/unit/markdown.test.ts \
  /Users/frank/Workspace/next-js/web-to-md/lib/markdown.ts

git commit -m "feat: add markdown formatting pipeline"
```

---

### Task 4: Implement and test server-side extraction pipeline

**Files:**
- Create: `/Users/frank/Workspace/next-js/web-to-md/tests/unit/extractor.test.ts`
- Create: `/Users/frank/Workspace/next-js/web-to-md/lib/extractor.ts`

- [ ] **Step 1: Write the failing extractor tests**

```ts
import { describe, expect, it, vi } from "vitest";
import { extractReadablePage } from "@/lib/extractor";

describe("extractReadablePage", () => {
  it("rejects non-html responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", {
      status: 200,
      headers: { "content-type": "application/json" },
    })));

    await expect(extractReadablePage("https://example.com")).rejects.toThrow(/html/i);
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm run test -- tests/unit/extractor.test.ts`
Expected: FAIL because `extractReadablePage` does not exist yet

- [ ] **Step 3: Write the minimal implementation**

```ts
import "server-only";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export async function extractReadablePage(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "Site2Markdown/0.1 (+https://site2markdown.local)",
        accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    if (!response.ok) throw new Error(`Request failed with status ${response.status}.`);

    const contentType = response.headers.get("content-type") ?? "";
    if (!/text\/html|application\/xhtml\+xml/i.test(contentType)) {
      throw new Error("The requested URL did not return HTML content.");
    }

    const html = await response.text();
    const dom = new JSDOM(html, { url });
    const article = new Readability(dom.window.document).parse();
    if (!article?.content?.trim()) throw new Error("No meaningful readable content was found.");

    return {
      sourceUrl: url,
      title: article.title ?? dom.window.document.title ?? null,
      siteName: article.siteName ?? null,
      byline: article.byline ?? null,
      excerpt: article.excerpt ?? null,
      contentHtml: article.content,
    };
  } finally {
    clearTimeout(timeout);
  }
}
```

- [ ] **Step 4: Run the test and verify GREEN**

Run: `npm run test -- tests/unit/extractor.test.ts`
Expected: PASS

- [ ] **Step 5: Commit the extractor**

```bash
git add /Users/frank/Workspace/next-js/web-to-md/tests/unit/extractor.test.ts \
  /Users/frank/Workspace/next-js/web-to-md/lib/extractor.ts

git commit -m "feat: add readable extraction pipeline"
```

---

### Task 5: Implement the Server Action contract

**Files:**
- Create: `/Users/frank/Workspace/next-js/web-to-md/actions/convert-url.ts`
- Modify: `/Users/frank/Workspace/next-js/web-to-md/lib/validations.ts`
- Modify: `/Users/frank/Workspace/next-js/web-to-md/lib/extractor.ts`
- Modify: `/Users/frank/Workspace/next-js/web-to-md/lib/markdown.ts`
- Modify: `/Users/frank/Workspace/next-js/web-to-md/lib/metadata.ts`

- [ ] **Step 1: Write a failing test for the action contract**

```ts
import { describe, expect, it, vi } from "vitest";
import { convertUrl, initialConvertState } from "@/actions/convert-url";

describe("convertUrl", () => {
  it("returns a friendly error for invalid input", async () => {
    const result = await convertUrl(initialConvertState, new FormData());
    expect(result.ok).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm run test -- tests/unit/action.test.ts`
Expected: FAIL because the action contract does not exist yet

- [ ] **Step 3: Implement the typed action result**

```ts
"use server";

import { formatExtractedPageMarkdown } from "@/lib/markdown";
import { buildDownloadFilename } from "@/lib/metadata";
import { extractReadablePage } from "@/lib/extractor";
import { normalizePublicUrl } from "@/lib/validations";

export type ConvertState =
  | { ok: true; data: { sourceUrl: string; title: string | null; siteName: string | null; markdown: string; filename: string } }
  | { ok: false; error: string };

export const initialConvertState: ConvertState = { ok: false, error: "Paste a URL to extract markdown." };

export async function convertUrl(_: ConvertState, formData: FormData): Promise<ConvertState> {
  try {
    const sourceUrl = normalizePublicUrl(String(formData.get("url") ?? ""));
    const extracted = await extractReadablePage(sourceUrl);
    const markdown = formatExtractedPageMarkdown({
      sourceUrl,
      title: extracted.title,
      siteName: extracted.siteName,
      retrievedAt: new Date().toISOString(),
      contentHtml: extracted.contentHtml,
    });

    return {
      ok: true,
      data: {
        sourceUrl,
        title: extracted.title,
        siteName: extracted.siteName,
        markdown,
        filename: buildDownloadFilename(extracted.title),
      },
    };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Conversion failed." };
  }
}
```

- [ ] **Step 4: Run the action test and verify GREEN**

Run: `npm run test -- tests/unit/action.test.ts`
Expected: PASS

- [ ] **Step 5: Commit the action contract**

```bash
git add /Users/frank/Workspace/next-js/web-to-md/actions/convert-url.ts \
  /Users/frank/Workspace/next-js/web-to-md/lib/validations.ts \
  /Users/frank/Workspace/next-js/web-to-md/lib/extractor.ts \
  /Users/frank/Workspace/next-js/web-to-md/lib/markdown.ts \
  /Users/frank/Workspace/next-js/web-to-md/lib/metadata.ts

git commit -m "feat: add conversion server action"
```

---

### Task 6: Build the homepage and result interface

**Files:**
- Create: `/Users/frank/Workspace/next-js/web-to-md/app/layout.tsx`
- Create: `/Users/frank/Workspace/next-js/web-to-md/app/page.tsx`
- Create: `/Users/frank/Workspace/next-js/web-to-md/app/loading.tsx`
- Create: `/Users/frank/Workspace/next-js/web-to-md/app/error.tsx`
- Create: `/Users/frank/Workspace/next-js/web-to-md/app/globals.css`
- Create: `/Users/frank/Workspace/next-js/web-to-md/components/app-shell.tsx`
- Create: `/Users/frank/Workspace/next-js/web-to-md/components/url-submit-form.tsx`
- Create: `/Users/frank/Workspace/next-js/web-to-md/components/markdown-result.tsx`
- Create: `/Users/frank/Workspace/next-js/web-to-md/components/markdown-preview.tsx`
- Create: `/Users/frank/Workspace/next-js/web-to-md/components/copy-markdown-button.tsx`
- Create: `/Users/frank/Workspace/next-js/web-to-md/components/download-markdown-button.tsx`
- Create: `/Users/frank/Workspace/next-js/web-to-md/components/submit-button.tsx`
- Create: `/Users/frank/Workspace/next-js/web-to-md/components/error-message.tsx`
- Create: `/Users/frank/Workspace/next-js/web-to-md/components/empty-result-state.tsx`
- Create: `/Users/frank/Workspace/next-js/web-to-md/components/ui/*`

- [ ] **Step 1: Write a failing component test for the empty state**

```ts
import { render, screen } from "@testing-library/react";
import { EmptyResultState } from "@/components/empty-result-state";

it("shows the default empty-state guidance", () => {
  render(<EmptyResultState />);
  expect(screen.getByText(/paste a public url/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm run test -- tests/unit/empty-result-state.test.tsx`
Expected: FAIL because the component does not exist yet

- [ ] **Step 3: Implement the UI shell and client islands**

```tsx
export default function Page() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <AppShell>
        <section>{/* title + intro */}</section>
        <UrlSubmitForm />
      </AppShell>
    </main>
  );
}
```

```tsx
"use client";

import { useActionState } from "react";
import { convertUrl, initialConvertState } from "@/actions/convert-url";

export function UrlSubmitForm() {
  const [state, action, pending] = useActionState(convertUrl, initialConvertState);
  return (
    <form action={action}>
      <input name="url" type="url" required />
      <SubmitButton pending={pending} />
      {state.ok ? <MarkdownResult data={state.data} /> : <ErrorMessage message={state.error} />}
    </form>
  );
}
```

- [ ] **Step 4: Run focused tests, lint, and typecheck**

Run: `npm run test`
Expected: PASS

Run: `npm run lint`
Expected: PASS

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 5: Commit the UI**

```bash
git add /Users/frank/Workspace/next-js/web-to-md/app \
  /Users/frank/Workspace/next-js/web-to-md/components

git commit -m "feat: build site2markdown interface"
```

---

### Task 7: Document the MVP and verify the whole flow

**Files:**
- Create: `/Users/frank/Workspace/next-js/web-to-md/README.md`
- Modify: `/Users/frank/Workspace/next-js/web-to-md/package.json`

- [ ] **Step 1: Write the README**

```md
# Site2Markdown

Site2Markdown is a Next.js App Router web app that fetches one public web page on the server, extracts the readable content, and converts it into markdown optimized for LLM workflows.

## MVP limitations
- one URL at a time
- no database
- no auth
- no crawling
- no background jobs
```

- [ ] **Step 2: Verify all checks**

Run: `npm run test && npm run lint && npm run typecheck`
Expected: all commands pass

- [ ] **Step 3: Commit the documentation and verification pass**

```bash
git add /Users/frank/Workspace/next-js/web-to-md/README.md \
  /Users/frank/Workspace/next-js/web-to-md/package.json

git commit -m "docs: add site2markdown readme"
```

---

## Self-Review

### Spec coverage
- Single-page URL flow: covered in Tasks 5 and 6
- Server-side extraction: covered in Task 4
- Markdown output with metadata: covered in Task 3 and Task 5
- Copy/download UX: covered in Task 6
- Friendly errors and loading states: covered in Tasks 5 and 6
- README and project setup: covered in Tasks 1 and 7

### Placeholder scan
- No TODO/TBD placeholders included
- Every task has concrete file paths, commands, and code snippets
- Commit steps use conventional commits only

### Type consistency
- `normalizePublicUrl`, `extractReadablePage`, `formatExtractedPageMarkdown`, and `convertUrl` are named consistently across tasks
- `ConvertState` is the single action-state contract used by the form UI

## Execution Handoff

Plan complete and saved to `/Users/frank/Workspace/next-js/web-to-md/docs/superpowers/plans/2026-04-15-site2markdown-implementation-plan.md`.

Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints
