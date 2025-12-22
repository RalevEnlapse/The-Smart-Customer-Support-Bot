"use client";

import { useCallback } from "react";

export function Composer(props: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  canSend: boolean;
  loading: boolean;
}) {
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        props.onSend();
      }
    },
    [props]
  );

  return (
    <div className="border-t border-[var(--border)] bg-[var(--card)] p-3 sm:p-4">
      <form
        className="flex-1 items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          props.onSend();
        }}
      >
        <div className="flex w-full gap-2">
          <input
            className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-3 text-sm text-gray-900 shadow-sm outline-none focus:border-transparent focus:ring-4 focus:ring-[var(--ring)] disabled:opacity-50"
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder="Ask about products, or: status of order 12345"
            disabled={props.loading}
            onKeyDown={onKeyDown}
            aria-label="Message"
          />
          <button
            className="rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 disabled:opacity-50"
            type="submit"
            disabled={!props.canSend}
          >
            Send
          </button>
        </div>

        <div className="mt-1 ml-2 text-[11px] text-[var(--muted-foreground)]">
          Tip: Press Enter to send.
        </div>
      </form>
    </div>
  );
}
