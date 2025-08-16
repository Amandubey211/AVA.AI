// components/AvatarCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mic, Lock } from "lucide-react"; // Import Lock icon
import { AvatarConfig } from "../lib/avatars";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
} as const;

const AvatarCard = React.memo(function AvatarCard({
  avatar,
}: {
  avatar: AvatarConfig;
}) {
  const isPublished = avatar.status === "Published";

  // The content of the card
  const CardContent = (
    <div
      className={`relative bg-gray-900 rounded-3xl overflow-hidden h-[350px] flex flex-col justify-between p-6 transition-all duration-300 ${
        isPublished ? "cursor-pointer group" : "cursor-not-allowed filter"
      }`}
      style={{
        backgroundImage: `url(${avatar.bgImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for unpublished cards */}
      {!isPublished && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 mt-14 px-4 py-2 bg-black/50 rounded-lg backdrop-blur-sm">
            <Lock size={20} className="text-white" />
            <span className="text-white text-sm font-semibold">
              Coming Soon
            </span>
          </div>
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-3xl font-bold text-white">{avatar.name}</h3>
        <p className="text-gray-300 mt-1">with {avatar.character}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {avatar.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-black/50 text-xs rounded-full text-white"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Buttons (only visible on published cards on hover) */}
      {isPublished && (
        <div className="relative z-10 flex items-center gap-3 mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            title="mic"
            className="p-4 rounded-full bg-black flex items-center justify-center shadow-md hover:scale-105 transition"
          >
            <Mic size={18} color="white" />
          </button>
          <button className="px-6 py-3 rounded-full font-semibold text-white bg-black hover:bg-white cursor-pointer hover:text-black transition">
            Talk
          </button>
        </div>
      )}
    </div>
  );

  return (
    <motion.div variants={itemVariants}>
      {/* Wrap with Link only if published */}
      {isPublished ? (
        <Link
          href={`/chat/${avatar.id}`}
          aria-label={`Chat with ${avatar.character}`}
        >
          {CardContent}
        </Link>
      ) : (
        // Otherwise, render a simple div that is not a link
        <div>{CardContent}</div>
      )}
    </motion.div>
  );
});

export default AvatarCard;
