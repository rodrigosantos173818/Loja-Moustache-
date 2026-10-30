"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Anima a entrada (fade + slide-up) de qualquer bloco quando ele entra na
 * viewport. Discreto, uma única vez, respeita prefers-reduced-motion via
 * CSS (ver globals.css).
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "span" | "li";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      data-reveal
      data-visible={visible}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={className}
    >
      {children}
    </Tag>
  );
}
