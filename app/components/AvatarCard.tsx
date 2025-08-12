"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";
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
  return (
    <motion.div variants={itemVariants}>
      <Link href={`/chat/${avatar.id}`}>
        <div
          className="relative bg-gray-900 rounded-3xl overflow-hidden h-[350px] flex flex-col justify-between p-6 cursor-pointer"
          style={{
            backgroundImage: `url(${avatar.bgImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
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

          {/* Buttons */}
          <div className="relative z-10 flex items-center gap-3 mt-6">
            <button
              title="mic"
              className="p-4 rounded-full bg-black flex items-center justify-center shadow-md hover:scale-105 transition"
            >
              <Mic size={18} color="white" />
            </button>
            <button className="px-6 py-3 rounded-full font-semibold text-white bg-black  hover:bg-white cursor-pointer hover:text-black transition">
              Talk
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

export default AvatarCard;
