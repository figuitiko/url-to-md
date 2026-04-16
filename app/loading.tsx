import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      <AppShell
        eyebrow="Preparing workspace"
        title="Loading Site2Markdown"
        description="We’re bringing up the interface so you can validate markdown output in one place."
      >
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle>Initializing interface</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-12 animate-pulse rounded-2xl bg-white/10" />
            <div className="h-[420px] animate-pulse rounded-3xl bg-white/5" />
          </CardContent>
        </Card>
      </AppShell>
    </main>
  );
}
