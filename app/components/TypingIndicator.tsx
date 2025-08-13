// components/TypingIndicator.tsx
"use client";

import { motion, Variants } from "framer-motion"; // Correctly import Variants
import { Bot } from "lucide-react";

export default function TypingIndicator() {
  // --- THE FIX IS HERE: Add `as const` to the variants object ---
  const dotVariants: Variants = {
    initial: { y: 0 },
    animate: {
      y: [0, -4, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  } as const; // This tells TypeScript to infer the most literal type possible.

  return (
    <motion.div
      className="flex items-end gap-3 my-5"
      // It's generally better to pass the variants object directly
      // rather than spreading individual initial/animate props if using `variants`.
      variants={dotVariants}
      initial="initial"
      animate="animate"
      exit={{ opacity: 0, y: -10 }} // Ensure exit animation is also defined
    >
      <div className="w-10 h-10 rounded-full bg-purple-500 flex-shrink-0 flex items-center justify-center shadow-lg">
        <Bot size={24} />
      </div>
      <div className="p-4 rounded-2xl max-w-md shadow-md bg-gray-700 rounded-bl-none flex gap-2">
        <motion.span
          variants={dotVariants}
          initial="initial"
          animate="animate"
          style={{ transitionDelay: "0s" }}
          className="w-2 h-2 bg-gray-400 rounded-full"
        />
        <motion.span
          variants={dotVariants}
          initial="initial"
          animate="animate"
          style={{ transitionDelay: "0.2s" }}
          className="w-2 h-2 bg-gray-400 rounded-full"
        />
        <motion.span
          variants={dotVariants}
          initial="initial"
          animate="animate"
          style={{ transitionDelay: "0.4s" }}
          className="w-2 h-2 bg-gray-400 rounded-full"
        />
      </div>
    </motion.div>
  );
}
