import { AppShell } from "@/components/app-shell";
import { UrlSubmitForm } from "@/components/url-submit-form";

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <AppShell
        eyebrow="Server-first extraction"
        title="Convert a page into clean markdown without leaving the workbench."
        description="Paste one public URL, run the extractor on the server, and inspect the result inline as markdown or a readable preview."
      >
        <UrlSubmitForm />
      </AppShell>
    </main>
  );
}
