"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChatMessage } from "../lib/api";
import { MessageBubble } from "./MessageBubble";

const AUTO_SCROLL_BOTTOM_THRESHOLD_PX = 96;

export function MessageList(props: {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const messageCount = props.messages.length;

  const isNearBottom = useMemo(() => {
    const el = scrollRef.current;
    if (!el) return true;

    const distanceFromBottom = el.scrollHeight - el.clientHeight - el.scrollTop;
    return distanceFromBottom <= AUTO_SCROLL_BOTTOM_THRESHOLD_PX;
  }, [messageCount, props.loading, props.error]);

  useEffect(() => {
    // If the user is already at (or near) the bottom, keep them pinned there.
    if (isNearBottom) setShouldAutoScroll(true);
  }, [isNearBottom]);

  useEffect(() => {
    if (!shouldAutoScroll) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [props.messages, props.loading, props.error, shouldAutoScroll]);

  return (
    <div
      ref={scrollRef}
      className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6"
      onScroll={() => {
        const el = scrollRef.current;
        if (!el) return;
        const distanceFromBottom =
          el.scrollHeight - el.clientHeight - el.scrollTop;
        setShouldAutoScroll(distanceFromBottom <= AUTO_SCROLL_BOTTOM_THRESHOLD_PX);
      }}
    >
      <div className="space-y-3">
        {props.messages.map((m, idx) => (
          <MessageBubble key={idx} role={m.role} content={m.content} />
        ))}

        {props.loading ? (
          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--muted-foreground)]/50" />
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--muted-foreground)]/50 [animation-delay:150ms]" />
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--muted-foreground)]/50 [animation-delay:300ms]" />
            <span className="ml-1">Thinking…</span>
          </div>
        ) : null}

        {props.error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <div className="font-medium">Request failed</div>
            <div className="mt-1 opacity-90">{props.error}</div>
          </div>
        ) : null}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
