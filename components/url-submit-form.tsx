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

const IDLE_HELPER_TEXT = "Paste a public URL to extract markdown.";

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
    return { status: "idle", message: IDLE_HELPER_TEXT };
  }

  if ("status" in state) {
    if (state.status === "idle" && "message" in state && typeof state.message === "string") {
      return state;
    }

    if (state.status === "error" && "error" in state && typeof state.error === "string") {
      return state;
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

    return { status: "idle", message: IDLE_HELPER_TEXT };
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
      error: state.error ?? "We couldn’t convert that URL. Please try another public page.",
    };
  }

  return { status: "idle", message: IDLE_HELPER_TEXT };
}

function ResultPanel({ pending, state }: Readonly<{ pending: boolean; state: ConvertState }>) {
  if (state.status === "success") {
    return <MarkdownResult data={state.data} pending={pending} />;
  }

  if (state.status === "error") {
    return <ErrorMessage message={state.error} pending={pending} />;
  }

  return <EmptyResultState pending={pending} />;
}

export function UrlSubmitForm() {
  const [rawState, formAction, pending] = useActionState(convertUrl, initialConvertState);
  const state = normalizeConvertState(rawState);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (state.status === "success") {
      setUrl(state.data.sourceUrl);
    }
  }, [state]);

  const helperText = useMemo(() => {
    if (state.status === "idle") return state.message;
    if (state.status === "error") return "Fix the URL and re-run the conversion in place.";
    return state.data?.sourceUrl
      ? `Latest extraction ready from ${state.data.sourceUrl}`
      : IDLE_HELPER_TEXT;
  }, [state]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      <Card className="h-fit border-white/10 bg-white/5 shadow-2xl shadow-black/20">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-xl text-white">Source URL</CardTitle>
              <CardDescription className="mt-2 text-sm leading-6 text-zinc-400">
                Paste a public article or documentation page. The server will fetch, extract, and format it into markdown.
              </CardDescription>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-2 text-zinc-300">
              <Globe className="size-5" aria-hidden="true" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <label className="space-y-2 text-sm font-medium text-zinc-200" htmlFor="url">
              Public page URL
              <Input
                id="url"
                name="url"
                type="url"
                inputMode="url"
                autoComplete="url"
                placeholder="https://example.com/article"
                required
                value={url}
                onChange={(event) => setUrl(event.target.value)}
              />
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <SubmitButton pending={pending} />
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-zinc-400">
                {pending ? <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" /> : <Sparkles className="size-3.5" aria-hidden="true" />}
                {pending ? "Fetching and converting" : "No browser rendering fallback in MVP"}
              </div>
            </div>

            <p className="flex items-start gap-2 text-sm leading-6 text-zinc-400" role="status" aria-live="polite">
              <ArrowRight className="mt-1 size-4 shrink-0" aria-hidden="true" />
              <span>{helperText}</span>
            </p>
          </form>
        </CardContent>
      </Card>

      <ResultPanel state={state} pending={pending} />
    </div>
  );
}
