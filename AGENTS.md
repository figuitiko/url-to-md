<claude-mem-context>
# Memory Context

# [web-to-md] recent context, 2026-04-19 10:32am CST

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 34 obs (9,883t read) | 220,014t work | 96% savings

### Apr 18, 2026
29 9:28p 🔵 web-to-md project stack mapped for PDF-to-markdown feature planning
30 9:29p 🔵 web-to-md full architecture mapped — patterns for PDF feature integration identified
32 " 🔵 PDF upload feature: zero existing code, UI components fully reusable, NON_HTML_CONTENT gate confirmed
35 9:41p 🟣 PDF-to-Markdown upload feature planned for web-to-md app
36 " ⚖️ PDF-to-Markdown v1 scope: text-only PDFs, no OCR
38 9:42p ⚖️ PDF upload UX: mode switch added to existing URL form
40 " ⚖️ PDF-to-Markdown output: single doc with page separators
42 9:49p ⚖️ web-to-md PDF v1 processing limits: 20 MB / 200 pages
43 " ⚖️ web-to-md PDF parsing: pure JS dependencies only
45 " ⚖️ web-to-md PDF fidelity target: readable text-first
47 " ⚖️ web-to-md PDF storage: ephemeral only, no persistence
48 " ⚖️ web-to-md PDF upload scope: single PDF per request in v1
51 9:50p 🔵 web-to-md existing test patterns: Vitest, describe/it, module mocking
54 10:00p ⚖️ web-to-md PDF parser strategy: pdf.js-based parser selected for v1
55 " ⚖️ web-to-md PDF v1: synchronous processing + simple file picker UI
58 10:04p ⚖️ web-to-md PDF upload: cap file size at 10 MB (stable over experimental)
60 10:06p 🔵 web-to-md current config state: minimal next.config.ts, dual-locale i18n (en/es)
61 10:07p ✅ pdfjs-dist@^4.10.38 installed in web-to-md
64 " 🔵 npm install failed — no network access in web-to-md Claude Code session
66 10:08p ✅ pdfjs-dist@^4.10.38 successfully installed in web-to-md (escalated permissions)
67 10:09p 🟣 lib/pdf.ts created — PDF extraction module for web-to-md
69 " ✅ lib/errors.ts extended with 6 PDF-specific error codes
70 " 🟣 lib/convert-state.ts created — discriminated union state for URL and PDF conversion
74 " 🔵 lib/markdown.ts existing pattern — metadata header + HTML-to-markdown body via Turndown
76 10:10p 🟣 lib/markdown.ts extended with PDF formatter — formatExtractedPdfMarkdown
78 " 🟣 actions/convert-url.ts refactored — PDF and URL conversion unified under single server action
79 " ✅ next.config.ts updated — serverActions.bodySizeLimit set to 10mb
82 " ✅ lib/i18n/types.ts Dictionary interface extended with PDF and mode-switch i18n keys
84 10:11p ✅ lib/i18n/en.ts updated — English copy for PDF upload feature added
86 " ✅ lib/i18n/es.ts updated — Spanish copy for PDF upload feature added (Rioplatense)
88 10:12p 🟣 components/url-submit-form.tsx rewritten — URL/PDF mode switch UI with file input and legacy state normalization
91 10:13p 🟣 components/markdown-result.tsx updated — PDF-aware metadata panel and source display
92 10:15p 🟣 Unit test suites created for PDF feature — pdf.test.ts, convert-url.test.ts, markdown-result.test.tsx
93 " 🔴 Three test failures diagnosed and fixed — File.arrayBuffer, mockRejectedValue, empty-result-state copy change

Access 220k tokens of past work via get_observations([IDs]) or mem-search skill.
</claude-mem-context>