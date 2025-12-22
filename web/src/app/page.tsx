"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatResponse = {
  reply: string;
  messages: ChatMessage[];
  session_id?: string;
};

type ApiErrorResponse = {
  error?: {
    message?: string;
    code?: string;
  };
};

function backendUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
    "http://127.0.0.1:5000"
  );
}

async function createSessionId(): Promise<string> {
  const res = await fetch(`${backendUrl()}/api/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });

  if (!res.ok) throw new Error(`Failed to create session (${res.status})`);
  const data = (await res.json()) as { session_id: string };
  return data.session_id;
}

async function ensureSessionId(): Promise<string> {
  const key = "scsb_session_id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const sid = await createSessionId();
  window.localStorage.setItem(key, sid);
  return sid;
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! Ask me about products or say something like: What is the status of order 12345?",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
        fetch(`${backendUrl()}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sid, message: text }),
        });

      let res = await attempt(sessionId);

      // If backend restarted, the in-memory session store is wiped.
      // Auto-heal by creating a new session and retrying once.
      if (res.status === 404) {
        const maybe = (await res.json().catch(() => null)) as ApiErrorResponse | null;
        if (maybe?.error?.code === "session_not_found") {
          sessionId = await createSessionId();
          window.localStorage.setItem("scsb_session_id", sessionId);
          res = await attempt(sessionId);
        }
      }

      if (!res.ok) {
        const maybe = (await res.json().catch(() => null)) as ApiErrorResponse | null;
        const msg = maybe?.error?.message || `Request failed (${res.status})`;
        throw new Error(msg);
      }

      const data = (await res.json()) as ChatResponse;
      setMessages(data.messages);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
      // keep optimistic user message, add assistant error
      setMessages((m) => [...m, { role: "assistant", content: "(error)" }]);
    } finally {
      setLoading(false);
    }
  }

  async function reset() {
    setError(null);
    setLoading(true);
    try {
      const sessionId = await ensureSessionId();
      const res = await fetch(`${backendUrl()}/api/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });
      if (!res.ok) throw new Error(`Reset failed (${res.status})`);

      setMessages([
        {
          role: "assistant",
          content:
            "Session reset. Ask me about products or check an order status.",
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
    <div className="min-h-screen text-[var(--foreground)]">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-8">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight">
              Smart Customer Support Bot
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Local Next.js UI ↔ Flask API
            </p>
            <p className="mt-2 truncate text-xs text-[var(--muted-foreground)]">
              Backend: {backendUrl()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm shadow-sm hover:bg-[var(--muted)] disabled:opacity-50"
              onClick={reset}
              disabled={loading}
              type="button"
            >
              Reset
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="space-y-3">
                {messages.map((m, idx) => {
                  const isUser = m.role === "user";
                  return (
                    <div
                      key={idx}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[92%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm leading-6 sm:max-w-[80%] ${
                          isUser
                            ? "bg-zinc-900 text-white"
                            : "bg-[var(--muted)] text-[var(--card-foreground)]"
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  );
                })}

                {loading ? (
                  <div className="text-sm text-[var(--muted-foreground)]">
                    Thinking…
                  </div>
                ) : null}

                {error ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                    {error}
                  </div>
                ) : null}

                <div ref={bottomRef} />
              </div>
            </div>

            <div className="border-t border-[var(--border)] bg-[var(--card)] p-3 sm:p-4">
              <form
                className="flex items-end gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void send();
                }}
              >
                <input
                  className="flex-1 rounded-xl border border-[var(--border)] bg-white px-3 py-3 text-sm outline-none shadow-sm focus:border-transparent focus:ring-4 focus:ring-[var(--ring)] disabled:opacity-50"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about products, or: status of order 12345"
                  disabled={loading}
                />
                <button
                  className="rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 disabled:opacity-50"
                  type="submit"
                  disabled={!canSend}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
