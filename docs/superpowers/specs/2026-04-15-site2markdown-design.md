# Site2Markdown Design Spec

**Date:** 2026-04-15  
**Project:** Site2Markdown  
**Status:** Approved in conversation, written for review

## 1. Goal

Build a production-grade Next.js web app where a user pastes a single website URL and receives a clean markdown document optimized for LLM consumption.

The MVP intentionally processes **one page only** in the same request/response flow and does **not** include persistence, auth, crawling, background jobs, queue workers, or browser automation.

## 2. Product Scope

### In scope

- Single URL submission
- Server-side page fetch
- Readable content extraction
- HTML-to-markdown conversion
- Metadata-prefixed markdown output
- Inline same-page result rendering
- Copy-to-clipboard action
- Download `.md` action
- Friendly validation and operational error states

### Out of scope

- Database persistence
- Saved history
- User accounts or auth
- Multi-page crawling
- Batch processing
- Background jobs or queues
- Playwright/browser-rendered fallbacks
- LLM summarization or chunking modes

## 3. UX Direction

### Visual direction

The app should look like a **developer tool**, not a marketing landing page.

Characteristics:
- dark, polished, technical aesthetic
- strong content hierarchy
- restrained accent color usage
- result-first layout
- professional utility feel

### Layout decision

The homepage uses a **workbench interface**:
- concise intro area at the top
- URL input and submit action above the fold
- large result panel below
- inline same-page rendering after submission

### Result presentation

The result area includes:
- **Markdown** tab as the default
- **Preview** tab as a secondary validation view
- copy button
- download button

Reasoning:
- raw markdown is the final artifact for the user
- rendered preview helps validate extraction quality quickly

## 4. Architecture

### Core principles

- Next.js App Router
- React Server Components by default
- `"use client"` only where browser APIs or interactive state are required
- Server Action for the conversion flow
- server-only extraction pipeline
- no persistence for MVP

### Runtime choice

The extraction pipeline uses the **Node runtime**, since it depends on server-side HTML fetching, JSDOM parsing, and Readability.

### Request flow

1. User submits a URL from the homepage.
2. Server Action validates and normalizes the URL.
3. Server fetches the page HTML with timeout and response guards.
4. HTML is parsed with JSDOM.
5. `@mozilla/readability` extracts the readable content.
6. Extracted HTML is converted to markdown via Turndown + GFM plugin.
7. Markdown is cleaned and normalized.
8. Metadata header is prepended.
9. Typed result is returned and rendered inline on the same page.

## 5. Route and File Structure

Planned structure:

```txt
app/
  layout.tsx
  globals.css
  page.tsx
  loading.tsx
  error.tsx

components/
  app-shell.tsx
  url-submit-form.tsx
  markdown-result.tsx
  markdown-preview.tsx
  copy-markdown-button.tsx
  download-markdown-button.tsx
  submit-button.tsx
  error-message.tsx
  empty-result-state.tsx
  ui/...

actions/
  convert-url.ts

lib/
  validations.ts
  extractor.ts
  markdown.ts
  metadata.ts
  utils.ts
```

### Responsibility boundaries

#### `app/page.tsx`
Server Component that composes the homepage and wires together the form and result area.

#### `actions/convert-url.ts`
Server Action that orchestrates validation, fetching, extraction, markdown conversion, and typed response handling.

#### `lib/validations.ts`
Zod schemas plus URL safety rules.

#### `lib/extractor.ts`
Server-only fetch, timeout handling, content-type checks, response-size guard, JSDOM parsing, and Readability extraction.

#### `lib/markdown.ts`
Turndown configuration, GFM support, markdown cleanup, and final document formatting.

#### `lib/metadata.ts`
Helpers for metadata shaping and download-safe filename generation.

#### Client components
Only the smallest interaction islands should be client components:
- form state hooks if needed
- copy to clipboard
- Blob-based markdown download
- tabs interaction if implemented client-side

## 6. Validation and Safety Rules

Input validation uses **Zod**.

### Accepted input

- absolute `http://` URLs
- absolute `https://` URLs

### Rejected input

- malformed URLs
- unsupported protocols
- empty values
- `localhost`
- loopback addresses
- private/internal IP ranges where detectable

### Safety goals

This validation layer exists to reduce the chance of unsafe server-side fetch behavior and to keep the MVP constrained to normal public web pages.

## 7. Fetch Rules

The fetch pipeline should enforce the following:

### Timeout
Abort slow requests and return a friendly timeout error.

### Response status handling
Handle 4xx/5xx responses with clear error messaging.

### Content-type validation
Process only HTML/XHTML-like responses.
Reject non-HTML payloads such as JSON, PDFs, images, or binaries.

### Response-size guard
Apply a practical maximum response size for MVP to avoid excessive payloads.

### No client-side fetching
All page retrieval happens server-side only.

## 8. Extraction Rules

### Primary extraction strategy

- parse document with `jsdom`
- extract readable body with `@mozilla/readability`
- collect metadata where available:
  - title
  - site name
  - byline
  - excerpt if useful

### Failure policy

If extraction does not produce meaningful content, return a clear failure result.

The app should **not** silently fall back to dumping noisy raw page HTML into markdown. A false success is worse than an honest failure.

## 9. Markdown Conversion Rules

Use:
- `turndown`
- `turndown-plugin-gfm`

### Preserve where meaningful

- headings
- paragraphs
- bullet lists
- numbered lists
- links
- code blocks
- tables where feasible

### Reduce or remove where possible

- nav menus
- cookie notices
- social/share junk
- CTA blocks
- sidebar noise
- repeated footer content
- scripts and styles
- empty wrappers

### Cleanup rules

- normalize whitespace
- collapse repeated blank lines
- keep code fences intact
- keep links readable
- avoid over-processing structure into something less useful for LLM input

## 10. Markdown Output Format

The final markdown should follow this structure:

```md
# Extracted Page

- Source: {{url}}
- Title: {{title}}
- Site: {{siteName}}
- Retrieved At: {{timestamp}}

---

{{markdown content}}
```

This format gives the user a self-describing artifact that is easy to paste into an LLM system.

## 11. Error Handling Model

### Expected operational failures
These return typed action results and render friendly inline messages:
- invalid URL
- unsupported URL
- timeout
- non-HTML response
- 403 / 404 / blocked page
- extraction failure
- no meaningful content found
- markdown conversion failure

### Unexpected app-level failures
These are handled with route-level files:
- `app/error.tsx`
- `app/loading.tsx`

This separates product-level failures from framework/runtime failures.

## 12. Download Strategy

Preferred MVP approach:
- generate a Blob on the client from the returned markdown string
- trigger file download in the browser
- derive a safe filename from the page title when possible

This avoids introducing an export route handler before it is necessary.

## 13. Component Strategy

Use shadcn/ui primitives where appropriate:
- Card
- Input
- Button
- Label
- Tabs
- Alert
- ScrollArea
- Skeleton
- Separator
- Textarea or equivalent markdown display container
- toast feedback if useful

Accessibility expectations:
- labeled URL field
- semantic headings
- keyboard-accessible controls
- visible focus states
- readable contrast
- accessible error text

## 14. Acceptance Criteria

The MVP is complete when:

- a user can paste a valid URL and submit it
- the app validates input safely
- the page is fetched on the server
- readable content is extracted successfully
- markdown is generated and cleaned
- metadata header is included
- the result is rendered inline on the same page
- the user can copy the markdown
- the user can download it as `.md`
- invalid/failing cases produce clear friendly errors
- the app remains server-first with minimal client code
- no database, auth, crawler, queue, or persistence is introduced

## 15. Planned Tech Stack

- Next.js (latest App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zod
- `@mozilla/readability`
- `jsdom`
- `turndown`
- `turndown-plugin-gfm`

## 16. Future Extensions (not in MVP)

Possible future additions once the MVP is validated:
- saved history
- persistence layer
- auth
- batch processing
- internal crawl modes
- JS-rendered fallback via browser automation
- export variants for summarization or RAG chunking

## 17. Summary

Site2Markdown should ship first as a **single-page, inline-result, server-first extraction tool** focused on generating clean markdown from one pasted URL.

The architecture should stay intentionally small, safe, and extensible, with strong server/client boundaries and a UI that emphasizes trust in the generated artifact.
