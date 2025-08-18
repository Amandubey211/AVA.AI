// components/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion"; // Import motion

export default function Footer() {
  // Animation variants for each footer section
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.footer
      className="bg-black text-gray-400 py-16 px-8 border-t border-gray-800"
      initial="hidden"
      whileInView="visible" // Animate when the footer scrolls into view
      viewport={{ once: true, amount: 0.2 }} // Trigger animation once, when 20% is visible
      transition={{ staggerChildren: 0.15 }} // Stagger the animation of child sections
    >
      {/* --- RESPONSIVE GRID: 1 col on mobile, 2 on tablet, 4 on desktop --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
        {/* Section 1: Product Branding */}
        <motion.div
          variants={sectionVariants}
          className="text-center md:text-left"
        >
          <h3 className="text-xl font-bold text-white mb-4">AVA.AI</h3>
          <p>
            Next-generation AI assistants for immersive digital interactions.
          </p>
        </motion.div>

        {/* Section 2: Platform Links */}
        <motion.div
          variants={sectionVariants}
          className="text-center md:text-left"
        >
          <h4 className="font-semibold text-white mb-4">Platform</h4>
          <ul>
            <li className="mb-2">
              <Link
                href="#"
                className="hover:text-purple-400 transition-colors"
              >
                Features
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="/Pricing"
                className="hover:text-purple-400 transition-colors"
              >
                Pricing
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="#"
                className="hover:text-purple-400 transition-colors"
              >
                Studio
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* Section 3: Company Links */}
        <motion.div
          variants={sectionVariants}
          className="text-center md:text-left"
        >
          <h4 className="font-semibold text-white mb-4">Company</h4>
          <ul>
            <li className="mb-2">
              <Link
                href="#"
                className="hover:text-purple-400 transition-colors"
              >
                About Us
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="#"
                className="hover:text-purple-400 transition-colors"
              >
                Careers
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="mailto:amandubey8833@gmail.com"
                className="hover:text-purple-400 transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* Section 4: About the Creator */}
        <motion.div
          variants={sectionVariants}
          className="flex flex-col items-center md:items-start"
        >
          <h4 className="font-semibold text-white mb-4">Meet the Creator</h4>
          <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-gray-600">
            <Image
              src="/images/aman.dev.png"
              alt="Aman Dubey"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 hover:scale-110"
            />
          </div>
          <p className="text-white font-semibold mb-2">Aman Dubey</p>
          <p className="text-sm mb-4 text-center md:text-left">
            Product-minded Full-Stack Developer & Creator of AVA.AI
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm justify-center md:justify-start">
            <Link
              href="https://amandubey.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors"
            >
              Portfolio
            </Link>
            <Link
              href="https://github.com/Amandubey211"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="https://www.linkedin.com/in/profile-amandubey/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors"
            >
              LinkedIn
            </Link>
            <a
              href="mailto:amandubey.dev@gmail.com"
              className="hover:text-purple-400 transition-colors"
            >
              Email
            </a>
          </div>
        </motion.div>
      </div>

      {/* Copyright Section */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()} AVA.AI Platform. All rights
          reserved.
        </p>
        <p className="mt-2 text-gray-500">Developed with ❤️ by Aman Dubey</p>
      </div>
    </motion.footer>
  );
}
