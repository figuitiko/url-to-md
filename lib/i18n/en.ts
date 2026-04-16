import type { Dictionary } from "@/lib/i18n/types";

export const en = {
  metadata: {
    title: "Site2Markdown",
    description: "Extract one public web page into markdown that is ready to paste into LLM workflows.",
  },
  shell: {
    eyebrow: "Server-first extraction",
    title: "Convert a page into clean markdown without leaving the workbench.",
    description:
      "Paste one public URL, run the extractor on the server, and inspect the result inline as markdown or a readable preview.",
    panelTitle: "What this workbench optimizes for",
    panelDescription:
      "Safe public URLs, readable extraction, markdown you can inspect before copying into your next prompt.",
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
    cardTitle: "Source URL",
    cardDescription:
      "Paste a public article or documentation page. The server will fetch, extract, and format it into markdown.",
    label: "Public page URL",
    placeholder: "https://example.com/article",
    helperIdle: "Paste a public URL to extract markdown.",
    helperError: "Fix the URL and re-run the conversion in place.",
    helperSuccessPrefix: "Latest extraction ready from",
    capabilityIdle: "No browser rendering fallback in MVP",
    capabilityPending: "Fetching and converting",
    capabilityNote: "The extractor stays server-side and returns one page per request.",
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
      filename: "Filename",
    },
  },
  emptyState: {
    title: "Result workbench",
    idleDescription: "Paste a public URL to generate a markdown artifact you can inspect, copy, or download.",
    pendingDescription: "We’re preparing the result area for the next extraction.",
    steps: [
      {
        title: "Paste a public URL",
        description: "Paste a public URL to start the extraction flow. Private and local addresses are rejected before fetch.",
      },
      {
        title: "Run the server extractor",
        description: "The page is fetched on the server, cleaned with Readability, and transformed into markdown.",
      },
      {
        title: "Inspect the final artifact",
        description: "Review raw markdown first, then flip to preview mode if you want a quick validation pass.",
      },
    ],
  },
  inlineError: {
    title: "Conversion failed",
    description: "Friendly validation and extraction errors stay inline so you can correct the request without losing context.",
    fallback: "We couldn’t convert that URL. Please try another public page.",
    genericHttpPrefix: "That page returned an HTTP",
    messages: {
      EMPTY_URL: "Enter a URL.",
      INVALID_URL: "Enter an absolute URL.",
      UNSUPPORTED_PROTOCOL: "Enter a public HTTP(S) URL.",
      PRIVATE_NETWORK: "That URL points to a private or blocked network location.",
      HOST_RESOLUTION_FAILED: "We couldn’t resolve that host. Check the URL and try again.",
      REDIRECT_MISSING_LOCATION: "That page returned an invalid redirect.",
      TOO_MANY_REDIRECTS: "That page redirected too many times to process safely.",
      REQUEST_TIMEOUT: "The request timed out before the page could be fetched.",
      NON_HTML_CONTENT: "That URL did not return HTML content.",
      PAGE_TOO_LARGE: "That page is too large to process safely.",
      NO_READABLE_CONTENT: "We couldn’t find meaningful article content on that page.",
      UNKNOWN: "We couldn’t convert that URL. Please try another public page.",
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
    description: "We’re bringing up the interface so you can validate markdown output in one place.",
    cardTitle: "Initializing interface",
  },
  routeError: {
    eyebrow: "Runtime recovery",
    title: "The app hit an unexpected route-level error.",
    description: "This is separate from extraction failures. Reset the route and let’s get you back to the workbench.",
    cardTitle: "Unexpected app error",
    cardDescription: "The framework interrupted the page before the form could finish rendering.",
    unknownMessage: "Unknown route-level failure.",
    retry: "Try again",
  },
} satisfies Dictionary;
