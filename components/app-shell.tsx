import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

export function AppShell({
  eyebrow,
  title,
  description,
  children,
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}>) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="grid gap-6 rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] xl:p-8">
        <div className="space-y-4">
          <Badge variant="secondary" className="w-fit border-sky-400/20 bg-sky-400/10 text-sky-100">
            {eyebrow}
          </Badge>
          <div className="space-y-3">
            <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">{description}</p>
          </div>
        </div>

        <div className="grid gap-4 rounded-[28px] border border-white/10 bg-black/30 p-5 text-sm text-zinc-300">
          <div>
            <p className="font-medium text-white">What this workbench optimizes for</p>
            <p className="mt-2 leading-6 text-zinc-400">
              Safe public URLs, readable extraction, markdown you can inspect before copying into your next prompt.
            </p>
          </div>
          <dl className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div>
              <dt className="text-zinc-500">Mode</dt>
              <dd className="mt-1 font-medium text-white">Single-page, inline result</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Execution</dt>
              <dd className="mt-1 font-medium text-white">Server action + same-page state</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Output</dt>
              <dd className="mt-1 font-medium text-white">Markdown first, preview second</dd>
            </div>
          </dl>
        </div>
      </header>

      <section className="flex-1">{children}</section>
    </div>
  );
}
