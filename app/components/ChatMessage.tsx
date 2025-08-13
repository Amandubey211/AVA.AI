"use client";

import { motion, Variants } from "framer-motion";
import type { UIMessage } from "@ai-sdk/react";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: UIMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
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
        // Now TypeScript knows that 'type' must be "spring", "tween", etc.
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
        <div className="w-10 h-10 rounded-full bg-purple-500 flex-shrink-0 flex items-center justify-center shadow-lg">
          <Bot size={24} />
        </div>
      )}
      <div
        className={`p-4 rounded-2xl max-w-md shadow-md ${
          isUser ? "bg-blue-600 rounded-br-none" : "bg-gray-700 rounded-bl-none"
        }`}
      >
        <p className="text-white whitespace-pre-wrap leading-relaxed">
          {textContent}
        </p>
      </div>
      {isUser && (
        <div className="w-10 h-10 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center shadow-lg">
          <User size={24} />
        </div>
      )}
    </motion.div>
  );
}
