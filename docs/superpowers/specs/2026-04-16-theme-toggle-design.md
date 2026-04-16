# Theme Toggle Design Spec

**Date:** 2026-04-16  
**Project:** Site2Markdown  
**Status:** Implemented in conversation, written for review

## 1. Goal

Add a persisted light/dark theme toggle to the existing Site2Markdown workbench without changing the product scope, route structure, or server-first extraction flow.

## 2. Product Scope

### In scope

- Two themes only: light and dark
- Persisted browser theme selection
- Toggle placed in the shared workbench header
- Theme-safe updates for the shared shell and primary result surfaces
- Localized theme labels for English and Spanish
- Unit coverage for theme toggle behavior

### Out of scope

- System theme support
- User profile persistence
- Full visual redesign
- E2E browser automation coverage for theming

## 3. UX Direction

The current app reads as a developer workbench with dark as the default visual identity. That should remain true.

The light theme should feel like the same product, not a different layout. The toggle should be compact, predictable, and live next to the locale switcher because both are global interface controls rather than task actions.

## 4. Architecture

### Core decisions

- Keep the app server-first
- Mount a small client theme provider beneath the root body
- Render a dedicated client ThemeToggle from the shared AppShell
- Use `next-themes` for browser persistence
- Keep dark as the default theme

### Why this boundary works

The root layout already owns `html`, `body`, locale-derived `lang`, and `suppressHydrationWarning`. That makes it the correct seam for theme wiring while keeping the rest of the route tree server-rendered.

### Styling approach

The app currently hard-codes dark-biased white/black/zinc utility classes across the shell, form, results, and shared primitives. A real theme toggle therefore requires semantic CSS variables for:

- background and foreground
- muted and subtle text
- border
- surface layers
- code surfaces
- danger states
- control shadows and focus offsets

## 5. Route and File Structure

```txt
app/
  layout.tsx
  globals.css
  [locale]/
    page.tsx
    loading.tsx
    error.tsx

components/
  app-shell.tsx
  locale-switcher.tsx
  theme-provider.tsx
  theme-toggle.tsx
  url-submit-form.tsx
  markdown-result.tsx
  markdown-preview.tsx
  empty-result-state.tsx
  error-message.tsx
  ui/
    badge.tsx
    button.tsx
    card.tsx
    input.tsx

lib/
  i18n/
    types.ts
    en.ts
    es.ts
```

## 6. Accessibility and Persistence

- The toggle exposes localized accessible labels describing the next action.
- The current theme state remains visible in the control label.
- Theme selection persists in browser storage via `next-themes`.
- The mounted-state guard avoids misleading client-only theme state during hydration.

## 7. Acceptance Criteria

- Users can switch between dark and light themes from the shared header.
- The selected theme persists across reloads.
- The main workbench surfaces remain readable in both themes.
- English and Spanish dictionaries include theme control copy.
- No client boundary is introduced beyond the provider and the toggle itself.
- Unit tests cover theme toggle behavior and shell integration.

## 8. Tech Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS v4
- next-themes
- Vitest + Testing Library

## 9. Summary

This change adds a compact, localized, persisted theme toggle while preserving the current server-first architecture. The main engineering work is not the button itself but the tokenization of the existing dark-only styling so the shared workbench remains coherent in both modes.
