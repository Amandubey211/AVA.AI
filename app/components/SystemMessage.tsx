// components/SystemMessage.tsx
"use client";

import { motion } from "framer-motion";
import { Info } from "lucide-react";

export default function SystemMessage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-3 my-4 p-3 text-sm text-gray-400 bg-gray-800 rounded-lg"
    >
      <Info size={18} />
      <div className="text-center">{children}</div>
    </motion.div>
  );
}
