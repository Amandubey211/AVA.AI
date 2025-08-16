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
      className={`flex items-end gap-3 my-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
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
            ? "bg-blue-600/50 rounded-br-none"
            : "bg-gray-800/50 rounded-bl-none"
        }`}
      >
        {/* --- THE FIX: Uncomment and update the style property --- */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          // This tells the browser to tile the small noise image across the entire div
          style={{
            backgroundImage: `url('/images/ui/shared/noise.png')`,
            backgroundRepeat: "repeat",
          }}
        />

        <p className="relative z-10 text-sm text-gray-100 whitespace-pre-wrap leading-relaxed">
          {textContent}
        </p>
      </div>
      {isUser && (
        <div className="w-9 h-9 rounded-full bg-blue-600/80 flex-shrink-0 flex items-center justify-center shadow-lg text-white font-bold text-lg">
          <User size={20} />
        </div>
      )}
    </motion.div>
  );
}
