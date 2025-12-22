"use client";

import { MarkdownMessage } from "./MarkdownMessage";

export function MessageBubble(props: {
  role: "user" | "assistant";
  content: string;
}) {
  const isUser = props.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[92%] rounded-2xl px-4 py-2 text-sm leading-6 sm:max-w-[80%] ${
          isUser
            ? "bg-zinc-900 text-white shadow-sm"
            : "bg-[var(--muted)] text-[var(--card-foreground)]"
        }`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap">{props.content}</div>
        ) : (
          <MarkdownMessage content={props.content} />
        )}
      </div>
    </div>
  );
}
