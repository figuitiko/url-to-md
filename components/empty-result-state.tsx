import { FileText, ShieldCheck, WandSparkles } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const checklist = [
  {
    title: "Paste a public URL",
    description: "Paste a public URL to start the extraction flow. Private and local addresses are rejected before fetch.",
    icon: ShieldCheck,
  },
  {
    title: "Run the server extractor",
    description: "The page is fetched on the server, cleaned with Readability, and transformed into markdown.",
    icon: WandSparkles,
  },
  {
    title: "Inspect the final artifact",
    description: "Review raw markdown first, then flip to preview mode if you want a quick validation pass.",
    icon: FileText,
  },
] as const;

export function EmptyResultState({ pending = false }: Readonly<{ pending?: boolean }>) {
  return (
    <Card className="border-white/10 bg-white/5 shadow-2xl shadow-black/20">
      <CardHeader>
        <CardTitle className="text-xl text-white">Result workbench</CardTitle>
        <CardDescription className="text-sm leading-6 text-zinc-400">
          {pending
            ? "We’re preparing the result area for the next extraction."
            : "Paste a public URL to generate a markdown artifact you can inspect, copy, or download."}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {checklist.map((item) => {
          const Icon = item.icon;

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
