// components/Loader.tsx
"use client";

import { motion, Variants } from "framer-motion";

export default function Loader({ text = "Loading..." }: { text?: string }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const dotVariants: Variants = {
    initial: { scale: 0.8, opacity: 0.5 },
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gray-900 text-white"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-3">
        <motion.div
          variants={dotVariants}
          style={{ transitionDelay: "0s" }}
          className="w-4 h-4 bg-purple-500 rounded-full"
        />
        <motion.div
          variants={dotVariants}
          style={{ transitionDelay: "0.2s" }}
          className="w-4 h-4 bg-purple-500 rounded-full"
        />
        <motion.div
          variants={dotVariants}
          style={{ transitionDelay: "0.4s" }}
          className="w-4 h-4 bg-purple-500 rounded-full"
        />
      </div>
      <p className="mt-6 text-lg text-gray-400 tracking-wider">{text}</p>
    </motion.div>
  );
}
