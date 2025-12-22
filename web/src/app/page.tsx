"use client";

import { useMemo, useState } from "react";

import type { ApiErrorResponse, ChatMessage, ChatResponse } from "../lib/api";
import { createSessionId, ensureSessionId, postChat, resetSession } from "../lib/api";
import { ChatHeader } from "../components/ChatHeader";
import { Composer } from "../components/Composer";
import { MessageList } from "../components/MessageList";

const MODELS = [
  "openai.openai/gpt-5.2",
  "openai.openai/gpt-4.1",
  "openai.openai/gpt-4o-mini",
] as const;

type ModelId = (typeof MODELS)[number];

export default function Home() {
  const [model, setModel] = useState<ModelId>(MODELS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "### Welcome\n\n- Ask about products (e.g. *best laptop for travel*)\n- Or check an order: *status of order 12345*\n\n### Next steps\n- Type your question below.",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading]
  );

  async function send() {
    const text = input.trim();
    if (!text) return;

    setError(null);
    setLoading(true);
    setInput("");

    // optimistic UI
    setMessages((m) => [...m, { role: "user", content: text }]);

    try {
      let sessionId = await ensureSessionId();

      const attempt = async (sid: string) =>
        postChat({ sessionId: sid, message: text, model });

      let res = await attempt(sessionId);

      // If backend restarted, the in-memory session store is wiped.
      // Auto-heal by creating a new session and retrying once.
      if (res.status === 404) {
        const maybe = (await res.json().catch(() => null)) as
          | ApiErrorResponse
          | null;
        if (maybe?.error?.code === "session_not_found") {
          sessionId = await createSessionId();
          window.localStorage.setItem("scsb_session_id", sessionId);
          res = await attempt(sessionId);
        }
      }

      if (!res.ok) {
        const maybe = (await res.json().catch(() => null)) as
          | ApiErrorResponse
          | null;
        const msg = maybe?.error?.message || `Request failed (${res.status})`;
        throw new Error(msg);
      }

      const data = (await res.json()) as ChatResponse;
      setMessages(data.messages);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "### Something went wrong\n\n- I couldn't complete that request.\n\n### Next steps\n- Try sending the message again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function reset() {
    setError(null);
    setLoading(true);

    try {
      const sessionId = await ensureSessionId();
      await resetSession(sessionId);

      setMessages([
        {
          role: "assistant",
          content:
            "### Session reset\n\n- Your chat history is cleared.\n\n### Next steps\n- Ask about products or check an order status.",
        },
      ]);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-dvh overflow-hidden text-[var(--foreground)]">
      <div className="mx-auto flex h-full max-w-4xl flex-col px-4 py-4 sm:py-8">
        <div className="shrink-0">
          <ChatHeader
            model={model}
            models={MODELS}
            onModelChange={(m) => setModel(m as ModelId)}
            onReset={() => void reset()}
            loading={loading}
          />
        </div>

        <main className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
          <div className="flex h-full min-h-0 flex-col">
            <MessageList messages={messages} loading={loading} error={error} />
            <Composer
              value={input}
              onChange={setInput}
              onSend={() => void send()}
              canSend={canSend}
              loading={loading}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
