// components/LenisProvider.tsx
"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { LenisContext } from "../context/LenisContext";

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis only once
    if (!lenisRef.current) {
      lenisRef.current = new Lenis();
    }

    const lenis = lenisRef.current;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      // On cleanup, properly destroy the instance if the method exists
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  return (
    // Provide the lenis instance to all child components
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
}
