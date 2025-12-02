"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

type Props = {
  children: React.ReactNode;
};

export default function SmoothScroll({ children }: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;

    const lenis = new Lenis({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.08,
    });

    lenis.on('scroll', (e: any) => {
      window.dispatchEvent(new CustomEvent('lenis-scroll', { detail: e }));
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ height: "100vh", overflow: "hidden" }}>
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
