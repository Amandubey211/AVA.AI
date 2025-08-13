// components/ChatMessage.tsx
"use client";
import { motion, Variants } from "framer-motion";
import type { UIMessage } from "@ai-sdk/react";
import { Bot, User } from "lucide-react"; // Keep Bot/User for fallback/flexibility

interface ChatMessageProps {
  message: UIMessage;
  avatarCharacterName?: string; // New prop for avatar's first letter
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
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      className={`flex items-start gap-4 my-5 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        // AI Avatar Circle
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex-shrink-0 flex items-center justify-center shadow-lg text-white font-bold text-xl uppercase">
          {avatarCharacterName ? (
            avatarCharacterName.charAt(0)
          ) : (
            <Bot size={24} />
          )}
        </div>
      )}
      <div
        className={`p-4 rounded-3xl max-w-md shadow-lg backdrop-blur-md ${
          // Added backdrop-blur-md
          isUser
            ? "bg-blue-600/70 rounded-br-none" // Slightly transparent for glass effect
            : "bg-gray-700/70 rounded-bl-none" // Slightly transparent for glass effect
        }`}
      >
        <p className="text-white whitespace-pre-wrap leading-relaxed">
          {textContent}
        </p>
      </div>
      {isUser && (
        // User Avatar Circle
        <div className="w-10 h-10 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center shadow-lg text-white font-bold text-xl">
          <User size={24} />
        </div>
      )}
    </motion.div>
  );
}
