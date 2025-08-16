// components/DebugPanel.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronUp, ChevronDown, TestTube2 } from "lucide-react";
import { useAvatarStore } from "../store/avatarStore";
import { AvatarConfig } from "../lib/avatars";

export default function DebugPanel({ avatar }: { avatar: AvatarConfig }) {
  const { setEmotion, setSpeaking, isSpeaking } = useAvatarStore();

  // --- NEW: State to manage the panel's collapsed state ---
  const [isCollapsed, setIsCollapsed] = useState(true);

  const emotionKeys = Object.keys(avatar.expressions);

  // Animation variants for the panel content
  const panelVariants: Variants = {
    hidden: { opacity: 0, height: 0, y: -10 },
    visible: {
      opacity: 1,
      height: "auto",
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  return (
    <motion.div
      layout // This animates the size change when collapsing/expanding
      className="absolute bottom-6 left-6 z-20 w-48 bg-gray-900/50 backdrop-blur-lg rounded-xl border border-white/10 text-xs shadow-2xl"
    >
      {/* --- The Always-Visible Header Bar --- */}
      <div
        className="p-2 flex justify-between items-center cursor-pointer hover:bg-white/5"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <TestTube2 size={16} className="text-purple-400" />
          <h4 className="font-bold text-white">Debug Panel</h4>
        </div>
        <motion.div animate={{ rotate: isCollapsed ? 0 : 180 }}>
          <ChevronUp size={16} className="text-gray-400" />
        </motion.div>
      </div>

      {/* --- The Collapsible Content --- */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            key="panel-content"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="p-2 border-t border-white/10 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2">
              {emotionKeys.map((emotion) => (
                <button
                  key={emotion}
                  onClick={() => setEmotion(emotion)}
                  className="px-2 py-1 bg-gray-700/50 hover:bg-gray-600/50 rounded-md transition-colors"
                >
                  {emotion}
                </button>
              ))}
              <button
                onClick={() => setEmotion(null)}
                className="px-2 py-1 bg-red-800/50 hover:bg-red-700/50 rounded-md col-span-2 transition-colors"
              >
                Reset Emotion
              </button>
              <button
                onClick={() => setSpeaking(!isSpeaking)}
                className={`px-2 py-1 rounded-md col-span-2 transition-colors ${
                  isSpeaking
                    ? "bg-green-600/50 hover:bg-green-500/50"
                    : "bg-blue-800/50 hover:bg-blue-700/50"
                }`}
              >
                {isSpeaking ? "Lip-Sync: ON" : "Lip-Sync: OFF"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
