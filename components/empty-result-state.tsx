import { FileText, ShieldCheck, WandSparkles } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card className="border-border bg-surface shadow-workbench">
      <CardHeader>
        <CardTitle className="text-xl text-foreground">{copy.title}</CardTitle>
        <CardDescription className="text-sm leading-6 text-muted-foreground">
          {pending ? copy.pendingDescription : copy.idleDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {copy.steps.map((item, index) => {
          const Icon = icons[index] ?? FileText;

          return (
            <article
              key={item.title}
              className="rounded-[28px] border border-border bg-surface-strong p-5 shadow-workbench-soft"
            >
              <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-surface text-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </article>
          );
        })}
      </CardContent>
    </Card>
  );
}
