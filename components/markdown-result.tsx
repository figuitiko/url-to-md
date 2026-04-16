"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Eye, FileText, Link2 } from "lucide-react";

import { CopyMarkdownButton } from "@/components/copy-markdown-button";
import { DownloadMarkdownButton } from "@/components/download-markdown-button";
import { MarkdownPreview } from "@/components/markdown-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ConvertSuccessState } from "@/lib/convert-state";
import type { Dictionary } from "@/lib/i18n/types";

function getTabs(copy: Dictionary["result"]) {
  return [
    { value: "markdown", label: copy.tabs.markdown, icon: FileText },
    { value: "preview", label: copy.tabs.preview, icon: Eye },
  ] as const;
}

type ResultTab = "markdown" | "preview";

export function MarkdownResult({
  data,
  pending,
  copy,
  buttonCopy,
}: Readonly<{
  data: ConvertSuccessState["data"];
  pending: boolean;
  copy: Dictionary["result"];
  buttonCopy: Dictionary["buttons"];
}>) {
  const [activeTab, setActiveTab] = useState<ResultTab>("markdown");
  const tabs = getTabs(copy);
  const tabIds = {
    markdown: "result-tab-markdown",
    preview: "result-tab-preview",
  } as const;
  const panelIds = {
    markdown: "result-panel-markdown",
    preview: "result-panel-preview",
  } as const;

  const metadata = useMemo(
    () => [
      { label: copy.metadata.title, value: data.title ?? copy.unknown },
      { label: copy.metadata.site, value: data.siteName ?? copy.unknown },
      { label: copy.metadata.filename, value: data.filename },
    ],
    [copy, data.filename, data.siteName, data.title],
  );

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, currentTab: ResultTab) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();

    const currentIndex = tabs.findIndex((tab) => tab.value === currentTab);
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];
    const nextTabId = tabIds[nextTab.value];

    setActiveTab(nextTab.value);
    document.getElementById(nextTabId)?.focus();
  }

  return (
    <Card className="overflow-hidden border-white/10 bg-white/5 shadow-2xl shadow-black/20">
      <CardHeader className="gap-5 border-b border-white/10 bg-black/20">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-emerald-400/20 bg-emerald-400/10 text-emerald-100">
                <CheckCircle2 className="mr-1 size-3.5" aria-hidden="true" />
                {copy.badgeReady}
              </Badge>
              {pending ? (
                <Badge variant="secondary" className="border-white/10 bg-white/10 text-zinc-200">
                  {copy.badgeRefreshing}
                </Badge>
              ) : null}
            </div>
            <div>
              <CardTitle className="text-2xl text-white">{data.title ?? copy.untitled}</CardTitle>
              <CardDescription className="mt-2 flex items-start gap-2 break-all text-sm text-zinc-400">
                <Link2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {data.sourceUrl}
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <CopyMarkdownButton markdown={data.markdown} copy={buttonCopy} />
            <DownloadMarkdownButton markdown={data.markdown} filename={data.filename} copy={buttonCopy} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {metadata.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">{item.label}</p>
              <p className="mt-2 line-clamp-2 text-sm font-medium text-zinc-100">{item.value}</p>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-2xl border border-white/10 bg-black/30 p-1" role="tablist" aria-label={copy.tabListLabel}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const selected = activeTab === tab.value;

              return (
                <Button
                  key={tab.value}
                  id={tabIds[tab.value]}
                  type="button"
                  variant={selected ? "secondary" : "ghost"}
                  className="rounded-xl"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={panelIds[tab.value]}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveTab(tab.value)}
                  onKeyDown={(event) => handleTabKeyDown(event, tab.value)}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
          <p className="text-sm text-zinc-400">
            {activeTab === "markdown" ? copy.viewDescriptions.markdown : copy.viewDescriptions.preview}
          </p>
        </div>

        {activeTab === "markdown" ? (
          <div
            id={panelIds.markdown}
            role="tabpanel"
            aria-labelledby={tabIds.markdown}
            className="overflow-hidden rounded-[28px] border border-white/10 bg-[#050505]"
          >
            <pre className="max-h-[720px] overflow-auto p-5 font-mono text-[13px] leading-6 text-zinc-200">
              <code>{data.markdown}</code>
            </pre>
          </div>
        ) : (
          <div
            id={panelIds.preview}
            role="tabpanel"
            aria-labelledby={tabIds.preview}
            className="max-h-[720px] overflow-auto rounded-[28px] border border-white/10 bg-[#050505] p-5"
          >
            <MarkdownPreview markdown={data.markdown} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
