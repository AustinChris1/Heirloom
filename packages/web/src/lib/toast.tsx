import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * App-wide notifications. A module-level emitter rather than a context, so any
 * code path, including dynamically imported modules, can report in one call.
 */

export type ToastKind = "success" | "error" | "info";

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
  /** Optional explorer link, rendered as a trailing action. */
  href?: string;
  hrefLabel?: string;
}

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
let listeners: Listener[] = [];
let nextId = 1;

function emit(): void {
  for (const l of listeners) l(toasts);
}

/** Chain errors carry ABI dumps; a toast is a glance, so keep only the sentence. */
function condense(message: string): string {
  const cut = message.search(/\s*\((action=|transaction=|data=|code=|version=)/);
  let out = cut > 0 ? message.slice(0, cut) : message;
  out = out.trim().replace(/\s+/g, " ");
  return out.length > 200 ? `${out.slice(0, 197)}…` : out;
}

function push(kind: ToastKind, message: string, href?: string, hrefLabel?: string): void {
  const t: Toast = { id: nextId++, kind, message: condense(message), href, hrefLabel };
  toasts = [...toasts, t];
  emit();
  setTimeout(() => dismiss(t.id), kind === "error" ? 12_000 : 6_000);
}

export function dismiss(id: number): void {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export const toast = {
  success: (message: string, href?: string, hrefLabel?: string) => push("success", message, href, hrefLabel),
  error: (message: string) => push("error", message),
  info: (message: string) => push("info", message),
};

/** Mount once, near the root. */
export function ToastHost() {
  const [items, setItems] = useState<Toast[]>(toasts);

  useEffect(() => {
    const listener: Listener = (next) => setItems(next);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[min(92vw,26rem)] flex-col gap-2">
      <AnimatePresence initial={false}>
        {items.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto border bg-black p-4 ${
              t.kind === "error" ? "border-white" : t.kind === "success" ? "border-ink-500" : "border-ink-700"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="mt-px font-mono text-[11px] text-white">
                {t.kind === "success" ? "✓" : t.kind === "error" ? "✕" : "·"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="break-words text-xs leading-relaxed text-ink-100">{t.message}</p>
                {t.href && (
                  <a
                    href={t.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-300 underline-offset-4 hover:text-white hover:underline"
                  >
                    {t.hrefLabel ?? "View ↗"}
                  </a>
                )}
              </div>
              <button
                className="font-mono text-[11px] text-ink-400 hover:text-white"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
