// app/hooks/use-dev-mode.ts
"use client";

import { useState, useEffect } from "react";

// This hook checks for a client-side environment variable to determine if we're in dev mode.
// It's safe because it only runs on the client.
export function useDevMode() {
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    // We check the value of the public Next.js env var.
    const devFlag = process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === "true";
    setIsDevelopment(devFlag);
  }, []);

  return isDevelopment;
}
