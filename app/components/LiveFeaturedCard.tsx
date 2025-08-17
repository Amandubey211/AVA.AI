// components/LiveFeaturedCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Info, Mic, Lock } from "lucide-react"; // Import the Lock icon
import { AvatarConfig } from "../lib/avatars";

const LiveFeaturedCard = React.memo(function LiveFeaturedCard({
  avatar,
}: {
  avatar: AvatarConfig;
}) {
  const isPublished = avatar.status === "Published";

  // Set CSS variables for dynamic styling from the theme config
  const cardStyle = {
    "--text-color": avatar.theme?.textColor || "#FFFFFF",
    "--theme-color": avatar.theme?.themeColor || "#555555",
    "--font-family": avatar.theme?.fontFamily || "sans-serif",
  } as React.CSSProperties;

  // The main content of the card, which will be conditionally wrapped in a Link
  const CardContent = (
    <div
      className={`relative w-full   h-[380px] md:h-[480px]    rounded-3xl overflow-hidden transition-all duration-300 ${
        isPublished ? "cursor-pointer group" : "cursor-not-allowed"
      }`}
      style={{
        ...cardStyle,
        backgroundImage: `url(${avatar.bgImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* --- NEW: Grayscale filter and "Coming Soon" overlay for unpublished cards --- */}
      {!isPublished && (
        <>
          <div className="absolute inset-0 filter grayscale bg-black/40"></div>
          <div className="absolute inset-0 z-30 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 px-4 py-2 bg-black/70 rounded-lg backdrop-blur-sm">
              <Lock size={20} className="text-white" />
              <span className="text-white text-sm font-semibold">
                Coming Soon
              </span>
            </div>
          </div>
        </>
      )}

      {/* Main content overlay with the 65/35 split */}
      <div className="relative z-10 w-full h-full flex p-2">
        <div className="w-2/3 flex flex-col justify-between">
          <div className="relative z-10 w-full h-full flex p-6 md:p-8">
            <div className="w-full sm:w-2/3 flex flex-col justify-between">
              <div>
                <h2
                  // --- RESPONSIVE FIX: Smaller text on mobile (`text-4xl`) ---
                  className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg"
                  style={{
                    color: "var(--text-color)",
                    fontFamily: "var(--font-family)",
                  }}
                >
                  {avatar.name.replace(" ", "\n")}
                </h2>
                <p
                  className="mt-2 text-base md:text-lg text-gray-300"
                  style={{ fontFamily: "var(--font-family)" }}
                >
                  with {avatar.character}
                </p>
                <p
                  className="mt-4 max-w-xs text-sm md:text-base text-gray-200"
                  style={{ fontFamily: "var(--font-family)" }}
                >
                  {avatar.shortDescription}
                </p>
              </div>

              {isPublished && (
                <div className="flex items-center gap-3 sm:gap-4">
                  <button
                    title="info"
                    className="p-3 rounded-full bg-black/50 hover:bg-black/80 transition-colors"
                  >
                    <Info size={20} />
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-black/50 font-semibold text-sm sm:text-base transition-colors"
                    style={{ backgroundColor: "var(--theme-color)" }}
                  >
                    <Mic size={16} />
                    Talk to {avatar.character}
                  </button>
                </div>
              )}
            </div>
            <div className="hidden sm:block sm:w-1/3"></div>
          </div>
        </div>
        <div className="w-1/3"></div>
      </div>

      {/* Character Image (conditionally shown for published cards) */}
      {isPublished && (
        <motion.img
          src={avatar.imageUrl}
          alt={avatar.character}
          className="absolute  right-[-20%] bottom-0 w-auto h-[90%] object-cover pointer-events-none transition-transform duration-500 group-hover:scale-105"
          style={{ willChange: "transform" }}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent pointer-events-none"></div>
    </div>
  );

  // Render the card wrapped in a Link if it's published, otherwise render a plain div
  return isPublished ? (
    <Link
      href={`/chat/${avatar.id}`}
      aria-label={`Chat with ${avatar.character}`}
    >
      {CardContent}
    </Link>
  ) : (
    <div>{CardContent}</div>
  );
});

export default LiveFeaturedCard;
