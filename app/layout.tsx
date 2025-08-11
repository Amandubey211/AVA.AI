// app/layout.tsx
import Footer from "./components/Footer";
import LenisProvider from "./components/LenisProvider";
import Navbar from "./components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
export const metadata: Metadata = {
  title: "AI Avatar Platform",
  description: "Interactive AI Avatars powered by Next.js and Three.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black">
        {" "}
        {/* Set the base background color here */}
        <LenisProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LenisProvider>
        <Analytics />
      </body>
    </html>
  );
}
