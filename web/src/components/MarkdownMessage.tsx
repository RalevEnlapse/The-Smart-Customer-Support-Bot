"use client";

import { useCallback, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function isLikelyInlineCode(className?: string): boolean {
  return !(className || "").includes("language-");
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }, [value]);

  return (
    <button
      type="button"
      onClick={() => void onCopy()}
      className="rounded-md border border-[var(--border)] bg-[var(--card)] px-2 py-1 text-xs text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
      aria-label="Copy code"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function MarkdownMessage({ content }: { content: string }) {
  const text = useMemo(() => (content || "").trim(), [content]);

  return (
    <div className="prose prose-zinc max-w-none text-sm prose-p:my-2 prose-pre:overflow-x-auto prose-pre:rounded-xl prose-pre:bg-zinc-950 prose-pre:text-zinc-50 prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({ href, children, ...props }) {
            const safeHref = href || "";
            const isExternal =
              safeHref.startsWith("http://") || safeHref.startsWith("https://");
            return (
              <a
                href={safeHref}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer noopener" : undefined}
                className="font-medium text-blue-700 underline decoration-blue-300 underline-offset-2 hover:decoration-blue-700 dark:text-blue-300 dark:decoration-blue-700"
                {...props}
              >
                {children}
              </a>
            );
          },
          code({ className, children }) {
            const codeText = String(children || "").replace(/\n$/, "");

            // Inline code
            if (isLikelyInlineCode(className)) {
              return (
                <code className="rounded-md bg-[var(--muted)] px-1.5 py-0.5 font-mono text-[0.9em]">
                  {codeText}
                </code>
              );
            }

            // Fenced code block
            return (
              <div className="not-prose my-3 overflow-hidden rounded-xl border border-[var(--border)] bg-zinc-950">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
                  <div className="truncate text-xs text-zinc-300">Code</div>
                  <CopyButton value={codeText} />
                </div>
                <pre className="m-0 overflow-x-auto p-3 text-xs leading-5 text-zinc-50">
                  <code className={className}>{codeText}</code>
                </pre>
              </div>
            );
          },
          table({ children }) {
            return (
              <div className="not-prose my-3 w-full overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card)]">
                <table className="w-full border-collapse text-sm">{children}</table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border-b border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-left text-xs font-semibold text-[var(--muted-foreground)]">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border-b border-[var(--border)] px-3 py-2 align-top">
                {children}
              </td>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
