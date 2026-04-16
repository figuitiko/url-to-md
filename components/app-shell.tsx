import type { ReactNode } from "react";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

export function AppShell({
  locale,
  copy,
  children,
}: Readonly<{
  locale: Locale;
  copy: Dictionary["shell"];
  children: ReactNode;
}>) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="grid gap-6 rounded-4xl border border-border bg-surface p-6 shadow-workbench backdrop-blur xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] xl:p-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge
              variant="secondary"
              className="w-fit border-info-border bg-info-surface text-info-foreground"
            >
              {copy.eyebrow}
            </Badge>
            <div className="flex flex-wrap items-center gap-3">
              <ThemeToggle labels={copy.themeToggle} />
              <LocaleSwitcher locale={locale} labels={copy.localeSwitcher} />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {copy.title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {copy.description}
            </p>
          </div>
        </div>

        <div className="grid gap-4 rounded-[28px] border border-border bg-surface-strong p-5 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">{copy.panelTitle}</p>
            <p className="mt-2 leading-6 text-muted-foreground">
              {copy.panelDescription}
            </p>
          </div>
          <dl className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div>
              <dt className="text-subtle-foreground">{copy.stats.modeLabel}</dt>
              <dd className="mt-1 font-medium text-foreground">
                {copy.stats.modeValue}
              </dd>
            </div>
            <div>
              <dt className="text-subtle-foreground">
                {copy.stats.executionLabel}
              </dt>
              <dd className="mt-1 font-medium text-foreground">
                {copy.stats.executionValue}
              </dd>
            </div>
            <div>
              <dt className="text-subtle-foreground">
                {copy.stats.outputLabel}
              </dt>
              <dd className="mt-1 font-medium text-foreground">
                {copy.stats.outputValue}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <section className="flex-1">{children}</section>
    </div>
  );
}
