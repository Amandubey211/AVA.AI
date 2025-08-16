// components/Navbar.tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image"; // Import the Next.js Image component

// Ensure your logo image is located in the /public/images directory.
// For example: /public/images/ava-ai-logo.png
import AvaAiLogo from "@/public/images/ui/home/logo.png"; // Adjust path as needed

export default function Navbar() {
  return (
    <motion.nav
      className="w-full py-2 px-8 flex justify-between items-center backdrop-blur-sm fixed top-0 z-50 bg-black/50" // Added bg-black/50 for consistent blur
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <Link href="/">
        <motion.div
          whileHover={{ scale: 1.05 }} // Subtle hover animation
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer"
        >
          {/* Replace the text with your Image component */}
          <Image
            src={AvaAiLogo}
            alt="AVA.AI Logo"
            width={80} // Adjust width as needed
            height={30} // Adjust height as needed, or use 'auto' for aspect ratio
            priority // Prioritize loading for LCP
          />
        </motion.div>
      </Link>
      <div className="hidden md:flex gap-8 items-center">
        <Link
          href="/"
          className="hover:text-purple-400 text-purple-200 transition-colors"
        >
          AI Assistants
        </Link>
        <Link
          href="https://amandubey.vercel.app/about"
          target="_blank"
          className="hover:text-purple-400 text-purple-200 transition-colors"
        >
          Creator
        </Link>
        <Link
          href="/Pricing"
          className="hover:text-purple-400 text-purple-200 transition-colors"
        >
          Plans & Pricing
        </Link>
      </div>
      <motion.button
        className="px-5 py-2 bg-purple-500 rounded-full font-semibold text-white hover:bg-purple-400 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Subscribe Now
      </motion.button>
    </motion.nav>
  );
}
