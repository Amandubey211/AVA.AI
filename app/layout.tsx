// app/layout.tsx
"use client"; // --- STEP 1: Convert to a Client Component to use hooks.

import { usePathname } from "next/navigation"; // --- STEP 2: Import the hook.
import Footer from "./components/Footer";
import LenisProvider from "./components/LenisProvider";
import Navbar from "./components/Navbar";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

// Note: The `metadata` export is removed as it's not supported in a root client layout.
// Metadata should be defined in individual page.tsx files.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // --- STEP 3: Get the current URL path.
  const pathname = usePathname();

  // --- STEP 4: Determine if we are on a chat page.
  const isChatPage = pathname.startsWith("/chat");

  return (
    <html lang="en">
      <body className="bg-black">
        <LenisProvider>
          {/* --- STEP 5: Conditionally render the Navbar. --- */}
          {/* It will only appear if `isChatPage` is false. */}
          {!isChatPage && <Navbar />}

          <main>{children}</main>

          {/* --- STEP 6: Conditionally render the Footer. --- */}
          {!isChatPage && <Footer />}
        </LenisProvider>

        <Analytics />
      </body>
    </html>
  );
}
