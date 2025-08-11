// components/LiveFeaturedCard.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Info, Mic, Cuboid } from "lucide-react"; // Added Cuboid  icon
import { AvatarConfig } from "../lib/avatars";
import ModelPreviewModal from "./ModelPreviewModal";

export default function LiveFeaturedCard({ avatar }: { avatar: AvatarConfig }) {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* The 3D Preview Modal, which is only rendered when needed */}
      <ModelPreviewModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        modelUrl={avatar.modelUrl}
      />

      {/* The Card itself */}
      <div
        className="relative w-full h-[480px] rounded-4xl overflow-hidden group cursor-pointer"
        style={{
          backgroundImage: `url(${avatar.bgImageUrl})`,
          backgroundSize: "cover", // This CSS property ensures the image covers the full card
          backgroundPosition: "center",
        }}
      >
        <Link href={`/chat/${avatar.id}`}>
          {/* Main content overlay with the 65/35 split */}
          <div className="relative z-10 w-full h-full flex p-8">
            {/* LEFT SIDE (65%) */}
            <div className="w-2/3 flex flex-col justify-between">
              {/* Top Content */}
              <div>
                <h2
                  className="text-5xl font-bold leading-tight drop-shadow-lg"
                  dangerouslySetInnerHTML={{
                    __html: avatar.name.replace(" ", "<br/>"),
                  }}
                ></h2>
                <p className="mt-2 text-lg text-gray-300">
                  with {avatar.character}
                </p>
                <p className="mt-4 max-w-xs text-gray-200">
                  {avatar.shortDescription}
                </p>
              </div>
              {/* Bottom Bar */}
              <div className="flex items-center gap-4">
                <button
                  title="info"
                  className="p-3 rounded-full bg-black/50 hover:bg-black/80 transition-colors"
                >
                  <Info size={20} />
                </button>
                <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-black/50 hover:bg-black/80 font-semibold transition-colors">
                  <Mic size={16} />
                  Talk to {avatar.character}
                </button>
              </div>
            </div>

            {/* RIGHT SIDE (35%) - This is a dead zone for the link to allow the image to be "outside" the text flow */}
            <div className="w-1/3"></div>
          </div>
        </Link>

        {/* CHARACTER IMAGE (position absolute to sit on top of everything) */}
        <motion.img
          src={avatar.imageUrl}
          alt={avatar.character}
          className="absolute right-[-5%] bottom-0 w-auto h-[90%] object-contain pointer-events-none transition-transform duration-500 group-hover:scale-105"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* 3D PREVIEW BUTTON (position absolute) */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent link navigation
            setModalOpen(true);
          }}
          className="absolute bottom-8 right-8 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm transition-all text-white hover:scale-110"
          aria-label="Preview 3D Model"
        >
          <Cuboid size={24} />
        </button>

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent pointer-events-none"></div>
      </div>
    </>
  );
}
