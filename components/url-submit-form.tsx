"use client";

import { useEffect, useMemo, useState } from "react";
import { useActionState } from "react";
import { ArrowRight, FileText, Globe, LoaderCircle, Sparkles } from "lucide-react";

import { convertUrl } from "@/actions/convert-url";
import { EmptyResultState } from "@/components/empty-result-state";
import { ErrorMessage } from "@/components/error-message";
import { MarkdownResult } from "@/components/markdown-result";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  initialConvertState,
  type ConvertState,
  type ConvertSuccessState,
} from "@/lib/convert-state";
import { getLocalizedConvertErrorMessage } from "@/lib/i18n/error-message";
import type { Dictionary } from "@/lib/i18n/types";

const LEGACY_FALLBACK_ERROR_CODE = "UNKNOWN" as const;

type SourceMode = "url" | "pdf";

type LegacyConvertState =
  | {
      ok: true;
      data?: {
        sourceUrl?: string;
        title?: ConvertSuccessState["data"]["title"];
        siteName?: ConvertSuccessState["data"]["siteName"];
        markdown?: string;
        filename?: string;
      };
    }
  | {
      ok: false;
      error?: string;
    };

function normalizeConvertState(
  state: ConvertState | LegacyConvertState | undefined,
): ConvertState {
  if (!state || typeof state !== "object") {
    return { status: "idle" };
  }

  if ("status" in state) {
    if (state.status === "idle") {
      return { status: "idle" };
    }

    if (
      state.status === "error" &&
      "errorCode" in state &&
      typeof state.errorCode === "string"
    ) {
      return {
        status: "error",
        errorCode: state.errorCode,
        errorStatus:
          "errorStatus" in state && typeof state.errorStatus === "number"
            ? state.errorStatus
            : undefined,
      };
    }

    if (
      state.status === "success" &&
      "data" in state &&
      state.data &&
      typeof state.data === "object" &&
      "source" in state.data &&
      state.data.source &&
      typeof state.data.source === "object" &&
      "markdown" in state.data &&
      typeof state.data.markdown === "string" &&
      "filename" in state.data &&
      typeof state.data.filename === "string"
    ) {
      const source = state.data.source;

      if (
        "kind" in source &&
        source.kind === "url" &&
        "url" in source &&
        typeof source.url === "string"
      ) {
        return {
          status: "success",
          data: {
            source: {
              kind: "url",
              url: source.url,
            },
            title:
              "title" in state.data && typeof state.data.title === "string"
                ? state.data.title
                : null,
            siteName:
              "siteName" in state.data && typeof state.data.siteName === "string"
                ? state.data.siteName
                : null,
            markdown: state.data.markdown,
            filename: state.data.filename,
          },
        };
      }

      if (
        "kind" in source &&
        source.kind === "pdf" &&
        "fileName" in source &&
        typeof source.fileName === "string" &&
        "pageCount" in source &&
        typeof source.pageCount === "number"
      ) {
        return {
          status: "success",
          data: {
            source: {
              kind: "pdf",
              fileName: source.fileName,
              pageCount: source.pageCount,
            },
            title:
              "title" in state.data && typeof state.data.title === "string"
                ? state.data.title
                : null,
            siteName:
              "siteName" in state.data && typeof state.data.siteName === "string"
                ? state.data.siteName
                : null,
            markdown: state.data.markdown,
            filename: state.data.filename,
          },
        };
      }
    }

    return { status: "idle" };
  }

  if (
    "ok" in state &&
    state.ok === true &&
    state.data?.sourceUrl &&
    state.data.markdown &&
    state.data.filename
  ) {
    return {
      status: "success",
      data: {
        source: {
          kind: "url",
          url: state.data.sourceUrl,
        },
        title: state.data.title ?? null,
        siteName: state.data.siteName ?? null,
        markdown: state.data.markdown,
        filename: state.data.filename,
      },
    };
  }

  if ("ok" in state && state.ok === false) {
    return {
      status: "error",
      errorCode: LEGACY_FALLBACK_ERROR_CODE,
    };
  }

  return { status: "idle" };
}

function ResultPanel({
  pending,
  state,
  dictionary,
}: Readonly<{
  pending: boolean;
  state: ConvertState;
  dictionary: Pick<
    Dictionary,
    "buttons" | "emptyState" | "inlineError" | "result"
  >;
}>) {
  if (state.status === "success") {
    return (
      <MarkdownResult
        data={state.data}
        pending={pending}
        copy={dictionary.result}
        buttonCopy={dictionary.buttons}
      />
    );
  }

  if (state.status === "error") {
    return (
      <ErrorMessage
        message={getLocalizedConvertErrorMessage(state, dictionary.inlineError)}
        copy={dictionary.inlineError}
        pending={pending}
      />
    );
  }

  return <EmptyResultState copy={dictionary.emptyState} pending={pending} />;
}

export function UrlSubmitForm({
  dictionary,
}: Readonly<{
  dictionary: Pick<
    Dictionary,
    "buttons" | "emptyState" | "form" | "inlineError" | "result"
  >;
}>) {
  const [rawState, formAction, pending] = useActionState(
    convertUrl,
    initialConvertState,
  );
  const state = normalizeConvertState(rawState);
  const [mode, setMode] = useState<SourceMode>("url");
  const [url, setUrl] = useState("");
  const [pdfInputKey, setPdfInputKey] = useState(0);

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    if (state.data.source.kind === "url") {
      setMode("url");
      setUrl(state.data.source.url);
      return;
    }

    setMode("pdf");
    setPdfInputKey((current) => current + 1);
  }, [state]);

  const helperText = useMemo(() => {
    if (state.status === "error") {
      return dictionary.form.helperError;
    }

    if (state.status === "success") {
      if (state.data.source.kind === "url") {
        return `${dictionary.form.helperSuccessPrefix} ${state.data.source.url}`;
      }

      return `${dictionary.form.helperSuccessPrefix} ${state.data.source.fileName}`;
    }

    return mode === "url"
      ? dictionary.form.helperIdleUrl
      : dictionary.form.helperIdlePdf;
  }, [dictionary.form, mode, state]);

  const capabilityLabel = pending
    ? dictionary.form.capabilityPending
    : mode === "url"
      ? dictionary.form.capabilityIdleUrl
      : dictionary.form.capabilityIdlePdf;

  const capabilityNote =
    mode === "url"
      ? dictionary.form.capabilityNoteUrl
      : dictionary.form.capabilityNotePdf;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      <Card className="h-fit border-border bg-surface shadow-workbench">
        <CardHeader className="gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-xl text-foreground">
                {dictionary.form.cardTitle}
              </CardTitle>
              <CardDescription className="mt-2 text-sm leading-6 text-muted-foreground">
                {dictionary.form.cardDescription}
              </CardDescription>
            </div>
            <div className="rounded-2xl border border-border bg-surface-strong p-2 text-muted-foreground">
              {mode === "url" ? (
                <Globe className="size-5" aria-hidden="true" />
              ) : (
                <FileText className="size-5" aria-hidden="true" />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form
            action={formAction}
            encType="multipart/form-data"
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">
                {dictionary.form.modeLabel}
              </p>
              <div className="inline-flex w-fit rounded-2xl border border-border bg-surface-strong p-1">
                <Button
                  type="button"
                  variant={mode === "url" ? "secondary" : "ghost"}
                  className="rounded-xl"
                  onClick={() => setMode("url")}
                  aria-pressed={mode === "url"}
                >
                  {dictionary.form.modeUrl}
                </Button>
                <Button
                  type="button"
                  variant={mode === "pdf" ? "secondary" : "ghost"}
                  className="rounded-xl"
                  onClick={() => setMode("pdf")}
                  aria-pressed={mode === "pdf"}
                >
                  {dictionary.form.modePdf}
                </Button>
              </div>
            </div>

            <input type="hidden" name="sourceMode" value={mode} />

            {mode === "url" ? (
              <label
                className="flex flex-col gap-2 text-sm font-medium text-foreground"
                htmlFor="url"
              >
                {dictionary.form.label}
                <Input
                  id="url"
                  name="url"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  placeholder={dictionary.form.placeholder}
                  required
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                />
              </label>
            ) : (
              <label
                className="flex flex-col gap-2 text-sm font-medium text-foreground"
                htmlFor="pdf"
              >
                {dictionary.form.pdfLabel}
                <Input
                  key={pdfInputKey}
                  id="pdf"
                  name="pdf"
                  type="file"
                  accept="application/pdf,.pdf"
                  required
                />
              </label>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <SubmitButton pending={pending} copy={dictionary.buttons} />
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-strong px-3 py-1.5 text-xs text-muted-foreground">
                {pending ? (
                  <LoaderCircle
                    className="size-3.5 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Sparkles className="size-3.5" aria-hidden="true" />
                )}
                {capabilityLabel}
              </div>
            </div>

            <p
              className="flex items-start gap-2 text-sm leading-6 text-muted-foreground"
              role="status"
              aria-live="polite"
            >
              <ArrowRight className="mt-1 size-4 shrink-0" aria-hidden="true" />
              <span>{helperText}</span>
            </p>

            <p className="text-xs leading-6 text-subtle-foreground">
              {capabilityNote}
            </p>
          </form>
        </CardContent>
      </Card>

      <ResultPanel
        state={state}
        pending={pending}
        dictionary={{
          buttons: dictionary.buttons,
          emptyState: dictionary.emptyState,
          inlineError: dictionary.inlineError,
          result: dictionary.result,
        }}
      />
    </div>
  );
}
