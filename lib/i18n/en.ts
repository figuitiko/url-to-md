import type { Dictionary } from "@/lib/i18n/types";

export const en = {
  metadata: {
    title: "Site2Markdown",
    description:
      "Extract one public web page into markdown that is ready to paste into LLM workflows.",
  },
  shell: {
    eyebrow: "Server-first extraction",
    title: "Convert a page into clean markdown without leaving the workbench.",
    description:
      "Paste one public URL, run the extractor on the server, and inspect the result inline as markdown or a readable preview.",
    panelTitle: "What this workbench optimizes for",
    panelDescription:
      "Safe public URLs, readable extraction, markdown you can inspect before copying into your next prompt.",
    themeToggle: {
      label: "Theme",
      light: "Light",
      dark: "Dark",
      switchToLight: "Switch to light theme",
      switchToDark: "Switch to dark theme",
    },
    localeSwitcher: {
      switchToEnglish: "Switch to English",
      switchToSpanish: "Cambiar a español",
    },
    stats: {
      modeLabel: "Mode",
      modeValue: "Single-page, inline result",
      executionLabel: "Execution",
      executionValue: "Server action + same-page state",
      outputLabel: "Output",
      outputValue: "Markdown first, preview second",
    },
  },
  form: {
    cardTitle: "Source input",
    cardDescription:
      "Choose a source mode. Use a public URL or upload one text-based PDF to convert it into markdown.",
    modeLabel: "Source mode",
    modeUrl: "Public URL",
    modePdf: "PDF upload",
    label: "Public page URL",
    placeholder: "https://example.com/article",
    pdfLabel: "PDF file",
    helperIdleUrl: "Paste a public URL to extract markdown.",
    helperIdlePdf: "Upload one PDF file (max 10MB, up to 200 pages).",
    helperError: "Fix the input and re-run the conversion in place.",
    helperSuccessPrefix: "Latest extraction ready from",
    capabilityIdleUrl: "No browser rendering fallback in MVP",
    capabilityIdlePdf: "Text-based PDFs only in MVP (no OCR)",
    capabilityPending: "Fetching and converting",
    capabilityNoteUrl:
      "The extractor stays server-side and returns one page per request.",
    capabilityNotePdf:
      "PDF processing is server-side, ephemeral, and returns one markdown artifact per upload.",
  },
  buttons: {
    copy: "Copy markdown",
    copied: "Copied",
    download: "Download .md",
    submit: "Extract markdown",
    submitting: "Converting…",
  },
  result: {
    badgeReady: "Extraction ready",
    badgeRefreshing: "Refreshing…",
    untitled: "Untitled page",
    unknown: "Unknown",
    tabs: {
      markdown: "Markdown",
      preview: "Preview",
    },
    viewDescriptions: {
      markdown: "Exact output, ready to copy.",
      preview: "Rendered approximation for quick QA.",
    },
    tabListLabel: "Result views",
    metadata: {
      title: "Title",
      site: "Site",
      pages: "Pages",
      filename: "Filename",
    },
  },
  emptyState: {
    title: "Result workbench",
    idleDescription:
      "Paste a public URL or upload a PDF to generate a markdown artifact you can inspect, copy, or download.",
    pendingDescription:
      "We’re preparing the result area for the next extraction.",
    steps: [
      {
        title: "Choose a source",
        description:
          "Use a public URL or one PDF upload. Private and local addresses are rejected before fetch.",
      },
      {
        title: "Run the server extractor",
        description:
          "The source is processed on the server and transformed into markdown.",
      },
      {
        title: "Inspect the final artifact",
        description:
          "Review raw markdown first, then flip to preview mode if you want a quick validation pass.",
      },
    ],
  },
  inlineError: {
    title: "Conversion failed",
    description:
      "Friendly validation and extraction errors stay inline so you can correct the request without losing context.",
    fallback: "We couldn’t convert that input. Please try again.",
    genericHttpPrefix: "That page returned an HTTP",
    messages: {
      EMPTY_URL: "Enter a URL.",
      INVALID_URL: "Enter an absolute URL.",
      UNSUPPORTED_PROTOCOL: "Enter a public HTTP(S) URL.",
      PRIVATE_NETWORK:
        "That URL points to a private or blocked network location.",
      HOST_RESOLUTION_FAILED:
        "We couldn’t resolve that host. Check the URL and try again.",
      REDIRECT_MISSING_LOCATION: "That page returned an invalid redirect.",
      TOO_MANY_REDIRECTS:
        "That page redirected too many times to process safely.",
      REQUEST_TIMEOUT:
        "The request timed out before the page could be fetched.",
      NON_HTML_CONTENT: "That URL did not return HTML content.",
      PAGE_TOO_LARGE: "That page is too large to process safely.",
      NO_READABLE_CONTENT:
        "We couldn’t find meaningful article content on that page.",
      PDF_FILE_REQUIRED: "Upload a PDF file.",
      PDF_INVALID_TYPE: "Upload a valid PDF file.",
      PDF_TOO_LARGE: "That PDF exceeds the 10MB upload limit.",
      PDF_TOO_MANY_PAGES: "That PDF exceeds the 200-page limit.",
      PDF_PARSE_FAILED: "We couldn’t parse that PDF file.",
      PDF_NO_TEXT_CONTENT: "That PDF does not contain extractable text.",
      UNKNOWN: "We couldn’t convert that input. Please try again.",
    },
    http: {
      blocked: "That page is blocking automated access right now.",
      notFound: "That page could not be found.",
      server: "That page is having a server error right now.",
    },
  },
  loading: {
    eyebrow: "Preparing workspace",
    title: "Loading Site2Markdown",
    description:
      "We’re bringing up the interface so you can validate markdown output in one place.",
    cardTitle: "Initializing interface",
  },
  routeError: {
    eyebrow: "Runtime recovery",
    title: "The app hit an unexpected route-level error.",
    description:
      "This is separate from extraction failures. Reset the route and let’s get you back to the workbench.",
    cardTitle: "Unexpected app error",
    cardDescription:
      "The framework interrupted the page before the form could finish rendering.",
    unknownMessage: "Unknown route-level failure.",
    retry: "Try again",
  },
} satisfies Dictionary;
