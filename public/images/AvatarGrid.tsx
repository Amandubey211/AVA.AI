// components/AvatarGrid.tsx
"use client"; // This is the crucial directive

import { motion } from "framer-motion";
import AvatarCard from "../../app/components/AvatarCard";
import { AvatarConfig } from "../../app/lib/avatars";

// Define the shape of the props this component expects
interface AvatarGridProps {
  avatars: AvatarConfig[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function AvatarGrid({ avatars }: AvatarGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {avatars.map((avatar) => (
        <AvatarCard key={avatar.id} avatar={avatar} />
      ))}
    </motion.div>
  );
}
