// context/LenisContext.tsx
"use client";

import { createContext } from "react";
import type Lenis from "lenis";

export const LenisContext = createContext<Lenis | null>(null);
