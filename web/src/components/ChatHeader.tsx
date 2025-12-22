"use client";

import { backendUrl } from "../lib/api";

export function ChatHeader(props: {
  model: string;
  models: readonly string[];
  onModelChange: (model: string) => void;
  onReset: () => void;
  loading: boolean;
}) {
  return (
    <header className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
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
        <label className="hidden text-xs text-[var(--muted-foreground)] sm:block">
          Model
        </label>
        <select
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm shadow-sm outline-none focus:ring-4 focus:ring-[var(--ring)]"
          value={props.model}
          onChange={(e) => props.onModelChange(e.target.value)}
          disabled={props.loading}
        >
          {props.models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <button
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm shadow-sm hover:bg-[var(--muted)] disabled:opacity-50"
          onClick={props.onReset}
          disabled={props.loading}
          type="button"
        >
          Reset
        </button>
      </div>
    </header>
  );
}
