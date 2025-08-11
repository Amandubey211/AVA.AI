// components/AvatarCard.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Info, Mic } from "lucide-react";
import { AvatarConfig } from "../lib/avatars";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
} as const; // <-- THE FIX IS HERE: This `as const` assertion solves the type issue.

export default function AvatarCard({ avatar }: { avatar: AvatarConfig }) {
  const buttonClass =
    avatar.action === "Talk"
      ? "bg-gray-700 hover:bg-gray-600"
      : "bg-green-500 text-black hover:bg-green-400";

  return (
    <motion.div variants={itemVariants}>
      <Link href={`/chat/${avatar.id}`}>
        <div className="bg-gray-800 rounded-3xl h-[450px] flex flex-col group cursor-pointer overflow-hidden p-1">
          {/* Main Image Background */}
          <div
            className="relative w-full h-full rounded-2xl overflow-hidden flex flex-col justify-end p-6"
            style={{
              backgroundImage: `url(${avatar.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center 70%",
            }}
          >
            {/* Gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

            {/* Content at bottom */}
            <div className="relative z-10 transition-all transform group-hover:-translate-y-2">
              <h3 className="text-2xl font-bold">{avatar.name}</h3>
              <p className="text-gray-300">with {avatar.character}</p>
              <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                {avatar.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-black/50 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Buttons appear on hover */}
            <div className="absolute bottom-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                className="p-3 rounded-full bg-black/50 backdrop-blur-sm"
                title="Info"
              >
                <Info size={16} />
              </button>
              <button
                className={`px-5 py-3 rounded-full font-semibold flex items-center gap-2 ${buttonClass}`}
              >
                <Mic size={16} />
                {avatar.action}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
