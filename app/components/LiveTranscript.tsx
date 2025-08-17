// components/LiveTranscript.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { UIMessage } from "@ai-sdk/react";
import ChatMessage from "./ChatMessage"; // We reuse our existing ChatMessage component

interface LiveTranscriptProps {
  messages: UIMessage[];
  avatarCharacterName: string;
}

export default function LiveTranscript({
  messages,
  avatarCharacterName,
}: LiveTranscriptProps) {
  // Get only the last two messages to display
  const lastTwoMessages = messages.slice(-2);

  return (
    <div className="absolute bottom-28 left-4 right-4 z-10 flex flex-col gap-3">
      <AnimatePresence>
        {lastTwoMessages.map((msg) => (
          <motion.div
            key={msg.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
          >
            {/* We can reuse the ChatMessage component for consistent styling */}
            <ChatMessage
              message={msg}
              avatarCharacterName={avatarCharacterName}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
