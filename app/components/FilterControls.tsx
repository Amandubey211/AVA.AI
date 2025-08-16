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
    <div className="flex justify-center mb-12">
      <div className="relative flex items-center p-1 bg-gray-800 rounded-full border border-white/10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-colors z-10 ${
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
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
