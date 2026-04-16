import { FileText, ShieldCheck, WandSparkles } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Dictionary } from "@/lib/i18n/types";

const icons = [ShieldCheck, WandSparkles, FileText] as const;

export function EmptyResultState({
  copy,
  pending = false,
}: Readonly<{
  copy: Dictionary["emptyState"];
  pending?: boolean;
}>) {
  return (
    <Card className="border-white/10 bg-white/5 shadow-2xl shadow-black/20">
      <CardHeader>
        <CardTitle className="text-xl text-white">{copy.title}</CardTitle>
        <CardDescription className="text-sm leading-6 text-zinc-400">
          {pending ? copy.pendingDescription : copy.idleDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {copy.steps.map((item, index) => {
          const Icon = icons[index] ?? FileText;

          return (
            <article key={item.title} className="rounded-[28px] border border-white/10 bg-black/20 p-5">
              <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-100">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{item.description}</p>
            </article>
          );
        })}
      </CardContent>
    </Card>
  );
}
