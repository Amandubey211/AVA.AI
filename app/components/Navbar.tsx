// components/Navbar.tsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

import AvaAiLogo from "@/public/images/ui/home/logo.png";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { href: "/", label: "AI Assistants" },
    {
      href: "https://amandubey.vercel.app/about",
      label: "Creator",
      target: "_blank",
    },
    { href: "/Pricing", label: "Plans & Pricing" },
  ];

  return (
    <>
      <motion.nav
        className="w-full py-2 px-4 sm:px-8 flex justify-between items-center backdrop-blur-sm fixed top-0 z-50 bg-black/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
          >
            <Image
              src={AvaAiLogo}
              alt="AVA.AI Logo"
              width={80}
              height={30}
              priority
            />
          </motion.div>
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.target}
              className="hover:text-purple-400 text-purple-200 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* --- DESKTOP SUBSCRIBE BUTTON --- */}
        <motion.button
          className="hidden md:block px-5 py-2 bg-purple-500 rounded-full font-semibold text-white hover:bg-purple-400 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Subscribe Now
        </motion.button>

        {/* --- MOBILE HAMBURGER MENU BUTTON / CLOSE BUTTON --- */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-purple-200 relative z-50" // z-50 to ensure it's on top of the menu
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence initial={false} mode="wait">
              {isMobileMenuOpen ? (
                // --- THE "X" ICON ---
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                // --- THE "MENU" ICON ---
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-40 bg-gray-900/90 backdrop-blur-lg pt-24 p-8 flex flex-col"
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target={link.target}
                  className="text-2xl font-semibold text-purple-200 hover:text-purple-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <motion.button
                className="mt-8 px-8 py-3 bg-purple-500 rounded-full font-bold text-white hover:bg-purple-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe Now
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
