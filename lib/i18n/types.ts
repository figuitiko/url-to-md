import type { Site2MarkdownErrorCode } from "@/lib/errors";

export interface Dictionary {
  metadata: {
    title: string;
    description: string;
  };
  shell: {
    eyebrow: string;
    title: string;
    description: string;
    panelTitle: string;
    panelDescription: string;
    themeToggle: {
      label: string;
      light: string;
      dark: string;
      switchToLight: string;
      switchToDark: string;
    };
    localeSwitcher: {
      switchToEnglish: string;
      switchToSpanish: string;
    };
    stats: {
      modeLabel: string;
      modeValue: string;
      executionLabel: string;
      executionValue: string;
      outputLabel: string;
      outputValue: string;
    };
  };
  form: {
    cardTitle: string;
    cardDescription: string;
    modeLabel: string;
    modeUrl: string;
    modePdf: string;
    label: string;
    placeholder: string;
    pdfLabel: string;
    helperIdleUrl: string;
    helperIdlePdf: string;
    helperError: string;
    helperSuccessPrefix: string;
    capabilityIdleUrl: string;
    capabilityIdlePdf: string;
    capabilityPending: string;
    capabilityNoteUrl: string;
    capabilityNotePdf: string;
  };
  buttons: {
    copy: string;
    copied: string;
    download: string;
    submit: string;
    submitting: string;
  };
  result: {
    badgeReady: string;
    badgeRefreshing: string;
    untitled: string;
    unknown: string;
    tabs: {
      markdown: string;
      preview: string;
    };
    viewDescriptions: {
      markdown: string;
      preview: string;
    };
    tabListLabel: string;
    metadata: {
      title: string;
      site: string;
      pages: string;
      filename: string;
    };
  };
  emptyState: {
    title: string;
    idleDescription: string;
    pendingDescription: string;
    steps: ReadonlyArray<{
      title: string;
      description: string;
    }>;
  };
  inlineError: {
    title: string;
    description: string;
    fallback: string;
    genericHttpPrefix: string;
    messages: Record<Exclude<Site2MarkdownErrorCode, "HTTP_STATUS">, string>;
    http: {
      blocked: string;
      notFound: string;
      server: string;
    };
  };
  loading: {
    eyebrow: string;
    title: string;
    description: string;
    cardTitle: string;
  };
  routeError: {
    eyebrow: string;
    title: string;
    description: string;
    cardTitle: string;
    cardDescription: string;
    unknownMessage: string;
    retry: string;
  };
}
