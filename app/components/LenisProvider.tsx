// components/LenisProvider.tsx
'use client';

import { useEffect, useRef } from 'react';
// Correct import based on your specified package
import Lenis from 'lenis'; 

export default function LenisProvider({ children }: { children: React.ReactNode }) {
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

    // Clean up the effect
    return () => {
      cancelAnimationFrame(rafId);
      // You can add a destroy method if the specific version has it,
      // but stopping the animation frame is the main task.
    };
  }, []);

  return <>{children}</>;
}