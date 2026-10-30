"use client";
import { useEffect, useRef, type ReactNode } from "react";

/** Native modal: focus trap, inert background, Escape and focus restoration. */
export default function Dialog({ children, onClose, label, className = "" }: { children: ReactNode; onClose: () => void; label: string; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const callback = useRef(onClose);
  useEffect(() => { callback.current = onClose; }, [onClose]);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return <dialog ref={ref} className={`native-dialog ${className}`} aria-label={label} onCancel={(event) => { event.preventDefault(); callback.current(); }} onClick={(event) => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) callback.current(); } }}>{children}</dialog>;
}
