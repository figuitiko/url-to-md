# Theme Toggle Implementation Plan

> **For agentic workers:** follow the existing docs/superpowers execution pattern and implement this change in small verified steps.

**Goal:** Add a persisted light/dark toggle to the Site2Markdown workbench and make the main shell, form, result, loading, and error surfaces readable in both themes.

**Architecture:** Keep the app server-first, mount a small client `ThemeProvider` under the root body, place the toggle in the shared AppShell header, and convert dark-only UI classes into semantic theme tokens.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS v4, next-themes, Vitest, Testing Library

---

## Planned File Structure

### Create

- `/Users/frank/Workspace/next-js/web-to-md/docs/superpowers/specs/2026-04-16-theme-toggle-design.md`
- `/Users/frank/Workspace/next-js/web-to-md/docs/superpowers/plans/2026-04-16-theme-toggle-implementation-plan.md`
- `/Users/frank/Workspace/next-js/web-to-md/components/theme-provider.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/components/theme-toggle.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/tests/unit/theme-toggle.test.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/tests/unit/app-shell.test.tsx`

### Update

- `/Users/frank/Workspace/next-js/web-to-md/app/layout.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/app/globals.css`
- `/Users/frank/Workspace/next-js/web-to-md/components/app-shell.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/components/locale-switcher.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/components/url-submit-form.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/components/markdown-result.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/components/markdown-preview.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/components/empty-result-state.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/components/error-message.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/components/ui/button.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/components/ui/input.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/components/ui/badge.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/components/ui/card.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/app/[locale]/loading.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/app/[locale]/error.tsx`
- `/Users/frank/Workspace/next-js/web-to-md/lib/i18n/types.ts`
- `/Users/frank/Workspace/next-js/web-to-md/lib/i18n/en.ts`
- `/Users/frank/Workspace/next-js/web-to-md/lib/i18n/es.ts`
- `/Users/frank/Workspace/next-js/web-to-md/tests/unit/i18n.test.ts`

---

## Tasks

- [x] Define the theme-toggle design and scope in docs.
- [x] Add a root-level `ThemeProvider` wrapper around the app tree.
- [x] Extend dictionary types and localized copy for theme labels.
- [x] Add a compact client theme toggle to the AppShell header.
- [x] Introduce semantic theme tokens in `app/globals.css`.
- [x] Refactor the main workbench surfaces away from hard-coded dark classes.
- [x] Update loading and route-error states to respect the active theme.
- [x] Add unit coverage for the toggle and shell integration.
- [x] Run `npm run test`.
- [x] Run `npm run lint`.
- [x] Run `npm run typecheck`.

---

## Verification Targets

- Theme changes persist across reloads.
- The header shows both locale and theme controls without layout regressions.
- The form, empty state, result panel, preview panel, loading state, and route error state remain readable in both themes.
- Localized theme copy is available in English and Spanish.

---

## Execution Notes

- Default theme remains dark.
- System theme support is intentionally excluded.
- The styling pass is limited to the shared shell and primary task surfaces rather than a full design-system rewrite.
