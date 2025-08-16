// components/ChatMessage.tsx
"use client";

import { motion, Variants } from "framer-motion";
import type { UIMessage } from "@ai-sdk/react";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: UIMessage;
  avatarCharacterName?: string;
}

export default function ChatMessage({
  message,
  avatarCharacterName,
}: ChatMessageProps) {
  if (!message) return null;

  const isUser = message.role === "user";
  const textContent = Array.isArray(message.parts)
    ? message.parts.find((part) => part.type === "text")?.text || ""
    : "";

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      // --- UI ENHANCEMENT: Reduced vertical margin for a tighter look ---
      className={`flex items-end gap-3 my-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        // AI Avatar Circle
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex-shrink-0 flex items-center justify-center shadow-lg text-white font-bold text-lg uppercase">
          {avatarCharacterName ? (
            avatarCharacterName.charAt(0)
          ) : (
            <Bot size={20} />
          )}
        </div>
      )}
      <div
        className={`relative p-3 rounded-2xl max-w-sm shadow-md border border-white/10 overflow-hidden ${
          isUser
            ? "bg-blue-600/50 rounded-br-none" // More transparent for a glassy feel
            : "bg-gray-800/50 rounded-bl-none" // More transparent for a glassy feel
        }`}
      >
        {/* --- UI ENHANCEMENT: Subtle background noise for texture --- */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          // style={{ backgroundImage: `url('/images/noise.png')` }} // Add a subtle noise texture to your /public/images
        />

        {/* --- UI ENHANCEMENT: Smaller, cleaner text --- */}
        <p className="relative text-sm text-gray-100 whitespace-pre-wrap leading-relaxed">
          {textContent}
        </p>
      </div>
      {isUser && (
        // User Avatar Circle
        <div className="w-9 h-9 rounded-full bg-blue-600/80 flex-shrink-0 flex items-center justify-center shadow-lg text-white font-bold text-lg">
          <User size={20} />
        </div>
      )}
    </motion.div>
  );
}
