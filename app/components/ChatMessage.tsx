// components/ChatMessage.tsx
"use client";
import { motion } from "framer-motion";
import type { UIMessage } from "@ai-sdk/react";

interface ChatMessageProps {
  message: UIMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  // --- FIX: Find the first text part in the `parts` array ---
  // This makes the component robust for the future.
  const textContent =
    message.parts.find((part) => part.type === "text")?.text || "";

  return (
    <motion.div
      className={`flex items-start gap-3 my-4 ${isUser ? "justify-end" : ""}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-purple-500 flex-shrink-0"></div>
      )}
      <div
        className={`p-3 rounded-xl max-w-lg ${
          isUser ? "bg-blue-600" : "bg-gray-700"
        }`}
      >
        {/* --- FIX: Render the extracted text content --- */}
        <p className="text-white whitespace-pre-wrap">{textContent}</p>
      </div>
    </motion.div>
  );
}
