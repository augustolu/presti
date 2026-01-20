"use client";

import { useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";
import { LenisContext } from "@/lib/LenisContext";

type Props = {
  children: React.ReactNode;
};

export default function SmoothScroll({ children }: Props) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const newLenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.08,
    });

    newLenis.on('scroll', (e: any) => {
      window.dispatchEvent(new CustomEvent('lenis-scroll', { detail: e }));
    });

    function raf(time: number) {
      newLenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    setLenis(newLenis);

    return () => {
      newLenis.destroy();
      setLenis(null);
    };
  }, [setLenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
