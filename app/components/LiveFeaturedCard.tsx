// components/LiveFeaturedCard.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Info, Mic, Cuboid } from "lucide-react";
import { AvatarConfig } from "../lib/avatars";
import ModelPreviewModal from "./ModelPreviewModal";

const LiveFeaturedCard = React.memo(function LiveFeaturedCard({
  avatar,
}: {
  avatar: AvatarConfig;
}) {
  const [isModalOpen, setModalOpen] = useState(false);

  // Set CSS variables for dynamic styling. Default to white/gray if not provided.
  const cardStyle = {
    "--text-color": avatar.theme?.textColor || "#FFFFFF",
    "--theme-color": avatar.theme?.themeColor || "#555555",
    "--font-family": avatar.theme?.fontFamily || "sans-serif",
  } as React.CSSProperties;

  return (
    <>
      <ModelPreviewModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        modelUrl={avatar.modelUrl}
      />
      <div
        className="relative w-full h-[480px] rounded-3xl overflow-hidden group cursor-pointer"
        style={{
          ...cardStyle, // Apply dynamic styles
          backgroundImage: `url(${avatar.bgImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Link href={`/chat/${avatar.id}`}>
          <div className="relative z-10 w-full h-full flex p-8">
            <div className="w-2/3 flex flex-col justify-between">
              <div>
                <h2
                  className="text-5xl font-bold leading-tight drop-shadow-lg"
                  style={{
                    color: "var(--text-color)",
                    fontFamily: "var(--font-family)",
                  }}
                >
                  {avatar.name.replace(" ", "\n")}
                </h2>
                <p
                  className="mt-2 text-lg text-gray-300"
                  style={{ fontFamily: "var(--font-family)" }}
                >
                  with {avatar.character}
                </p>
                <p
                  className="mt-4 max-w-xs text-gray-200"
                  style={{ fontFamily: "var(--font-family)" }}
                >
                  {avatar.shortDescription}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  title="info"
                  className="p-3 rounded-full bg-black/50 hover:bg-black/80 transition-colors"
                >
                  <Info size={20} />
                </button>
                <button
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-black/50 font-semibold transition-colors"
                  style={{ backgroundColor: "var(--theme-color)" }}
                >
                  <Mic size={16} />
                  Talk to {avatar.character}
                </button>
              </div>
            </div>
            <div className="w-1/3"></div>
          </div>
        </Link>
        <motion.img
          src={avatar.imageUrl}
          alt={avatar.character}
          className="absolute right-[-5%] bottom-0 w-auto h-[90%] object-contain pointer-events-none"
          style={{ willChange: "transform" }} // --- PERFORMANCE OPTIMIZATION ---
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setModalOpen(true);
          }}
          className="absolute bottom-8 right-8 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm transition-all text-white hover:scale-110"
          aria-label="Preview 3D Model"
        >
          <Cuboid size={24} />
        </button>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent pointer-events-none"></div>
      </div>
    </>
  );
});

export default LiveFeaturedCard;
