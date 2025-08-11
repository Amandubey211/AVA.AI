// components/ChatInput.tsx
"use client";

import { Send, Loader2 } from "lucide-react";
import { useRef, useEffect, useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput("");
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [input]);

  return (
    <form onSubmit={handleSubmit} className="relative mt-4">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            // --- FIX: Type assertion to the specific element type ---
            (e.currentTarget as HTMLTextAreaElement).form?.requestSubmit();
          }
        }}
        placeholder="Type your message..."
        className="w-full bg-gray-900 rounded-lg p-4 pr-16 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 overflow-y-auto"
        rows={1}
        disabled={isLoading}
      />
      <button
        type="submit"
        className="absolute bottom-4 right-4 p-2 rounded-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 transition-colors"
        disabled={isLoading || !input.trim()}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
      </button>
    </form>
  );
}
