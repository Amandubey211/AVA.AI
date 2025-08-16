// app/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import Footer from "./components/Footer";
import LenisProvider from "./components/LenisProvider";
import Navbar from "./components/Navbar";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "react-hot-toast";
import VideoModal from "./components/VideoModal"; // Import the new global modal

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isChatPage = pathname.startsWith("/chat");

  return (
    <html lang="en">
      <body className="bg-black">
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ style: { background: "#333", color: "#fff" } }}
        />

        <LenisProvider>
          {!isChatPage && <Navbar />}
          <main>{children}</main>
          {!isChatPage && <Footer />}
        </LenisProvider>

        {/* --- Render the global VideoModal here --- */}
        <VideoModal />

        <Analytics />
      </body>
    </html>
  );
}
