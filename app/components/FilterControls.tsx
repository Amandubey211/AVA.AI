// components/FilterControls.tsx
"use client";

import { motion } from "framer-motion";

// Define the categories for our filters
export const categories = [
  "All",
  "LANGUAGE",
  "CAREER",
  "FINANCE",
  "TECH",
  "COOKING",
  "HISTORY",
  "CREATIVE",
];

interface FilterControlsProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function FilterControls({
  selectedCategory,
  setSelectedCategory,
}: FilterControlsProps) {
  return (
    <motion.div
      className="flex justify-center mb-12 px-4" // Add horizontal padding for mobile
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* --- RESPONSIVE FIX: Use `flex-wrap` and adjust padding/gap --- */}
      <div className="relative flex flex-wrap justify-center items-center gap-2 p-1.5 bg-gray-800 rounded-full border border-white/10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            // --- RESPONSIVE FIX: Adjust padding for better touch targets ---
            className={`relative px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full transition-colors z-10 ${
              selectedCategory === category
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {/* The animated pill that slides behind the active category */}
            {selectedCategory === category && (
              <motion.div
                layoutId="active-pill" // This ID is crucial for the animation
                className="absolute inset-0 bg-purple-600 rounded-full"
                style={{ zIndex: -1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="capitalize">{category.toLowerCase()}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
