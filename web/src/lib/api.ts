export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ChatResponse = {
  reply: string;
  messages: ChatMessage[];
  session_id?: string;
  model?: string;
};

export type ApiErrorResponse = {
  error?: {
    message?: string;
    code?: string;
  };
};

export function backendUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
    "http://127.0.0.1:5000"
  );
}

export async function createSessionId(): Promise<string> {
  const res = await fetch(`${backendUrl()}/api/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });

  if (!res.ok) throw new Error(`Failed to create session (${res.status})`);
  const data = (await res.json()) as { session_id: string };
  return data.session_id;
}

export async function ensureSessionId(): Promise<string> {
  const key = "scsb_session_id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const sid = await createSessionId();
  window.localStorage.setItem(key, sid);
  return sid;
}

export async function postChat(params: {
  sessionId: string;
  message: string;
  model: string;
}): Promise<Response> {
  return fetch(`${backendUrl()}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: params.sessionId,
      message: params.message,
      model: params.model,
    }),
  });
}

export async function resetSession(sessionId: string): Promise<void> {
  const res = await fetch(`${backendUrl()}/api/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
  });
  if (!res.ok) throw new Error(`Reset failed (${res.status})`);
}
