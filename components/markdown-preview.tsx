import { createElement, Fragment, type ReactNode } from "react";

function getSafeHref(rawHref: string) {
  try {
    const href = new URL(rawHref, "https://site2markdown-preview.local");

    if (href.protocol === "http:" || href.protocol === "https:" || href.protocol === "mailto:") {
      return rawHref;
    }

    return null;
  } catch {
    return null;
  }
}

function renderInline(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^\)]+\))/gu);

  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^\)]+)\)$/u);

    if (!match) {
      return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
    }

    const safeHref = getSafeHref(match[2]);

    if (!safeHref) {
      return <Fragment key={`${match[1]}-${index}`}>{match[1]}</Fragment>;
    }

    return (
      <a
        key={`${safeHref}-${index}`}
        href={safeHref}
        target="_blank"
        rel="noreferrer"
        className="text-sky-300 underline decoration-sky-400/50 underline-offset-4 transition hover:text-sky-200"
      >
        {match[1]}
      </a>
    );
  });
}

function isHorizontalRule(line: string) {
  return /^ {0,3}([-*_])(?:\s*\1){2,}\s*$/u.test(line);
}

function headingLevel(line: string) {
  const match = line.match(/^(#{1,6})\s+(.+)$/u);
  return match ? { level: match[1].length, content: match[2] } : null;
}

function fenceInfo(line: string) {
  const match = line.match(/^```\s*([^\s]*)/u);
  return match ? match[1] : null;
}

export function MarkdownPreview({ markdown }: Readonly<{ markdown: string }>) {
  const lines = markdown.replace(/\r\n?/gu, "\n").split("\n");
  const elements: ReactNode[] = [];

  for (let index = 0; index < lines.length; ) {
    const rawLine = lines[index] ?? "";
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const heading = headingLevel(line);
    if (heading) {
      const className = {
        1: "text-3xl font-semibold text-white",
        2: "text-2xl font-semibold text-white",
        3: "text-xl font-semibold text-white",
        4: "text-lg font-semibold text-white",
        5: "text-base font-semibold text-white",
        6: "text-sm font-semibold uppercase tracking-[0.18em] text-zinc-300",
      }[heading.level];
      const tagName = `h${heading.level}` as keyof JSX.IntrinsicElements;

      elements.push(
        createElement(
          tagName,
          {
            key: `heading-${index}`,
            className: `mt-6 first:mt-0 ${className}`,
          },
          renderInline(heading.content),
        ),
      );
      index += 1;
      continue;
    }

    if (isHorizontalRule(line)) {
      elements.push(<hr key={`hr-${index}`} className="my-6 border-white/10" />);
      index += 1;
      continue;
    }

    const language = fenceInfo(line);
    if (language !== null) {
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !/^```/u.test(lines[index] ?? "")) {
        codeLines.push(lines[index] ?? "");
        index += 1;
      }
      index += 1;
      elements.push(
        <div key={`code-${index}`} className="my-5 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
          {language ? <div className="border-b border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-zinc-500">{language}</div> : null}
          <pre className="overflow-auto p-4 font-mono text-sm leading-6 text-zinc-200">
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>,
      );
      continue;
    }

    if (/^>\s?/u.test(line)) {
      const quoteLines: string[] = [];
      while (index < lines.length && /^>\s?/u.test((lines[index] ?? "").trimEnd())) {
        quoteLines.push((lines[index] ?? "").trimEnd().replace(/^>\s?/u, ""));
        index += 1;
      }
      elements.push(
        <blockquote key={`quote-${index}`} className="my-5 border-l-2 border-sky-400/50 pl-4 text-sm leading-7 text-zinc-300">
          {quoteLines.map((quoteLine, quoteIndex) => (
            <p key={`${quoteLine}-${quoteIndex}`}>{renderInline(quoteLine)}</p>
          ))}
        </blockquote>,
      );
      continue;
    }

    if (/^[-*+]\s+/u.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*+]\s+/u.test((lines[index] ?? "").trimEnd())) {
        items.push((lines[index] ?? "").trimEnd().replace(/^[-*+]\s+/u, ""));
        index += 1;
      }
      elements.push(
        <ul key={`ul-${index}`} className="my-5 list-disc space-y-2 pl-6 text-sm leading-7 text-zinc-200">
          {items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>{renderInline(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s+/u.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/u.test((lines[index] ?? "").trimEnd())) {
        items.push((lines[index] ?? "").trimEnd().replace(/^\d+\.\s+/u, ""));
        index += 1;
      }
      elements.push(
        <ol key={`ol-${index}`} className="my-5 list-decimal space-y-2 pl-6 text-sm leading-7 text-zinc-200">
          {items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>{renderInline(item)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    const paragraphLines = [line];
    index += 1;
    while (index < lines.length) {
      const next = (lines[index] ?? "").trimEnd();
      if (!next.trim()) break;
      if (headingLevel(next) || isHorizontalRule(next) || /^```/u.test(next) || /^>\s?/u.test(next) || /^[-*+]\s+/u.test(next) || /^\d+\.\s+/u.test(next)) {
        break;
      }
      paragraphLines.push(next);
      index += 1;
    }

    elements.push(
      <p key={`paragraph-${index}`} className="my-4 text-sm leading-7 text-zinc-200 sm:text-[15px]">
        {renderInline(paragraphLines.join(" "))}
      </p>,
    );
  }

  return <div className="mx-auto max-w-3xl">{elements}</div>;
}
