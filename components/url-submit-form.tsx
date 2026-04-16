"use client";

import { useEffect, useMemo, useState } from "react";
import { useActionState } from "react";
import { ArrowRight, Globe, LoaderCircle, Sparkles } from "lucide-react";

import { convertUrl } from "@/actions/convert-url";
import { EmptyResultState } from "@/components/empty-result-state";
import { ErrorMessage } from "@/components/error-message";
import { MarkdownResult } from "@/components/markdown-result";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { initialConvertState, type ConvertState, type ConvertSuccessState } from "@/lib/convert-state";
import { getLocalizedConvertErrorMessage } from "@/lib/i18n/error-message";
import type { Dictionary } from "@/lib/i18n/types";

const LEGACY_FALLBACK_ERROR_CODE = "UNKNOWN" as const;

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

function normalizeConvertState(state: ConvertState | LegacyConvertState | undefined): ConvertState {
  if (!state || typeof state !== "object") {
    return { status: "idle" };
  }

  if ("status" in state) {
    if (state.status === "idle") {
      return { status: "idle" };
    }

    if (state.status === "error" && "errorCode" in state && typeof state.errorCode === "string") {
      return {
        status: "error",
        errorCode: state.errorCode,
        errorStatus: "errorStatus" in state && typeof state.errorStatus === "number" ? state.errorStatus : undefined,
      };
    }

    if (
      state.status === "success" &&
      "data" in state &&
      state.data &&
      typeof state.data === "object" &&
      "sourceUrl" in state.data &&
      typeof state.data.sourceUrl === "string" &&
      "markdown" in state.data &&
      typeof state.data.markdown === "string" &&
      "filename" in state.data &&
      typeof state.data.filename === "string"
    ) {
      return {
        status: "success",
        data: {
          sourceUrl: state.data.sourceUrl,
          title: "title" in state.data && typeof state.data.title === "string" ? state.data.title : null,
          siteName: "siteName" in state.data && typeof state.data.siteName === "string" ? state.data.siteName : null,
          markdown: state.data.markdown,
          filename: state.data.filename,
        },
      };
    }

    return { status: "idle" };
  }

  if ("ok" in state && state.ok === true && state.data?.sourceUrl && state.data.markdown && state.data.filename) {
    return {
      status: "success",
      data: {
        sourceUrl: state.data.sourceUrl,
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
  dictionary: Pick<Dictionary, "buttons" | "emptyState" | "inlineError" | "result">;
}>) {
  if (state.status === "success") {
    return <MarkdownResult data={state.data} pending={pending} copy={dictionary.result} buttonCopy={dictionary.buttons} />;
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
  dictionary: Pick<Dictionary, "buttons" | "emptyState" | "form" | "inlineError" | "result">;
}>) {
  const [rawState, formAction, pending] = useActionState(convertUrl, initialConvertState);
  const state = normalizeConvertState(rawState);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (state.status === "success") {
      setUrl(state.data.sourceUrl);
    }
  }, [state]);

  const helperText = useMemo(() => {
    if (state.status === "idle") return dictionary.form.helperIdle;
    if (state.status === "error") return dictionary.form.helperError;
    return state.data.sourceUrl
      ? `${dictionary.form.helperSuccessPrefix} ${state.data.sourceUrl}`
      : dictionary.form.helperIdle;
  }, [dictionary.form, state]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      <Card className="h-fit border-white/10 bg-white/5 shadow-2xl shadow-black/20">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-xl text-white">{dictionary.form.cardTitle}</CardTitle>
              <CardDescription className="mt-2 text-sm leading-6 text-zinc-400">{dictionary.form.cardDescription}</CardDescription>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-2 text-zinc-300">
              <Globe className="size-5" aria-hidden="true" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <label className="space-y-2 text-sm font-medium text-zinc-200" htmlFor="url">
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

            <div className="flex flex-wrap items-center gap-3">
              <SubmitButton pending={pending} copy={dictionary.buttons} />
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-zinc-400">
                {pending ? <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" /> : <Sparkles className="size-3.5" aria-hidden="true" />}
                {pending ? dictionary.form.capabilityPending : dictionary.form.capabilityIdle}
              </div>
            </div>

            <p className="flex items-start gap-2 text-sm leading-6 text-zinc-400" role="status" aria-live="polite">
              <ArrowRight className="mt-1 size-4 shrink-0" aria-hidden="true" />
              <span>{helperText}</span>
            </p>

            <p className="text-xs leading-6 text-zinc-500">{dictionary.form.capabilityNote}</p>
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
