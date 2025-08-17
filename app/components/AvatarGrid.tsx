// components/AvatarGrid.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import AvatarCard from "./AvatarCard";
import { AvatarConfig } from "../lib/avatars";

interface AvatarGridProps {
  avatars: AvatarConfig[];
}

export default function AvatarGrid({ avatars }: AvatarGridProps) {
  return (
    <motion.div
      layout
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto"
    >
      <AnimatePresence>
        {avatars.map((avatar) => (
          <AvatarCard key={avatar.id} avatar={avatar} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
