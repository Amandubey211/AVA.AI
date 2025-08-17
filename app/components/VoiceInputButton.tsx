// components/VoiceInputButton.tsx
"use client";

import { motion, Variants } from "framer-motion";
import { Mic, StopCircle } from "lucide-react";
import { useAvatarStore } from "../store/avatarStore";

interface VoiceInputButtonProps {
  toggleRecording: () => void;
}

export default function VoiceInputButton({
  toggleRecording,
}: VoiceInputButtonProps) {
  const { isRecording, isMuted } = useAvatarStore();

  const buttonVariants: Variants = {
    idle: { scale: 1, backgroundColor: "rgba(37, 99, 235, 0.8)" }, // blue-600
    recording: {
      scale: [1, 1.1, 1],
      backgroundColor: "rgba(220, 38, 38, 0.8)", // red-600
      transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
    },
    muted: { scale: 1, backgroundColor: "rgba(75, 85, 99, 0.8)" }, // gray-500
  };

  const getAnimationState = () => {
    if (isRecording) {
      return isMuted ? "muted" : "recording";
    }
    return "idle";
  };

  return (
    <motion.button
      onClick={toggleRecording}
      className="w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg backdrop-blur-lg border border-white/20"
      variants={buttonVariants}
      animate={getAnimationState()}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isRecording ? "Stop Recording" : "Start Recording"}
    >
      {isRecording ? <StopCircle size={40} /> : <Mic size={40} />}
    </motion.button>
  );
}
