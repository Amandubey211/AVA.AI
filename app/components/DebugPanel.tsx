// components/DebugPanel.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronUp, TestTube2 } from "lucide-react";
import { useAvatarStore } from "../store/avatarStore";
import { AvatarConfig } from "../lib/avatars";

export default function DebugPanel({ avatar }: { avatar: AvatarConfig }) {
  const { setEmotion, setSpeaking, isSpeaking } = useAvatarStore();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const emotionKeys = Object.keys(avatar.expressions);

  const panelVariants: Variants = {
    hidden: { opacity: 0, height: 0, y: 16, transition: { duration: 0.25 } },
    visible: {
      opacity: 1,
      height: "auto",
      y: 0,
      transition: {
        type: "spring",
        stiffness: 160,
        damping: 22,
        staggerChildren: 0.04,
        delayChildren: 0.05,
      },
    },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      layout
      className="absolute bottom-6 left-6 z-20 w-48 bg-gray-900/50 backdrop-blur-lg rounded-xl border border-white/10 text-xs shadow-xl flex flex-col-reverse"
    >
      {/* Footer / Toggle Button (now at the bottom visually) */}
      <div
        className="p-3 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors duration-200"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <TestTube2 size={18} className="text-purple-400" />
          <h4 className="font-bold text-white">Debug Panel</h4>
        </div>
        <motion.div
          animate={{ rotate: isCollapsed ? 0 : 180 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronUp size={18} className="text-gray-300" />
        </motion.div>
      </div>

      {/* Content above */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            key="panel-content"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="p-3 border-t border-white/10 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2">
              {emotionKeys.map((emotion) => (
                <motion.button
                  key={emotion}
                  variants={buttonVariants}
                  onClick={() => setEmotion(emotion)}
                  className="px-2 py-1 bg-gray-700/50 hover:bg-gray-600/50 rounded-md transition-all duration-200 hover:scale-[1.03] active:scale-95"
                >
                  {emotion}
                </motion.button>
              ))}
              <motion.button
                variants={buttonVariants}
                onClick={() => setEmotion(null)}
                className="px-2 py-1 bg-red-800/50 hover:bg-red-700/50 rounded-md col-span-2 transition-all duration-200 hover:scale-[1.03] active:scale-95"
              >
                Reset Emotion
              </motion.button>
              <motion.button
                variants={buttonVariants}
                onClick={() => setSpeaking(!isSpeaking)}
                className={`px-2 py-1 rounded-md col-span-2 transition-all duration-200 hover:scale-[1.03] active:scale-95 ${
                  isSpeaking
                    ? "bg-green-600/50 hover:bg-green-500/50"
                    : "bg-blue-800/50 hover:bg-blue-700/50"
                }`}
              >
                {isSpeaking ? "Lip-Sync: ON" : "Lip-Sync: OFF"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
