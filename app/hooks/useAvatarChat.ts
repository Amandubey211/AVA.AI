// app/hooks/useAvatarChat.ts
"use client";

import React from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai"; // ✅ from original
import type { UIMessage } from "ai";
import { toast } from "react-hot-toast";
import { useAvatarStore } from "../store/avatarStore";

interface UseAvatarChatParams {
  systemPrompt: string;
}

export function useAvatarChat({ systemPrompt }: UseAvatarChatParams) {
  const { setSpeaking, setChatStatus, addAudioToQueue, playNextAudio } =
    useAvatarStore();

  const chat = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat", // ✅ uses default transport
    }),

    // ✅ Handle complete AI responses for TTS
    onFinish: ({ message }) => {
      const textContent =
        message?.parts
          ?.filter((part) => part.type === "text")
          .map((part) => (part as { type: "text"; text: string }).text)
          .join("")
          .trim() ?? "";

      if (textContent) {
        addAudioToQueue(textContent);
        playNextAudio();
      } else {
        setSpeaking(false);
      }
    },

    // ✅ Network/API errors
    onError: (error) => {
      toast.error("Sorry, an error occurred. Please try again.");
      console.error("Chat error:", error);
      setSpeaking(false);
    },
  });

  // ✅ Sync chat status with avatar UI states
  React.useEffect(() => {
    setChatStatus(chat.status);
    if (chat.status === "submitted" || chat.status === "streaming") {
      setSpeaking(true);
    }
  }, [chat.status, setChatStatus, setSpeaking]);

  // ✅ Enhanced sendMessage to always include systemPrompt
  const sendMessage = (message: UIMessage | string) => {
    // Clear any leftover TTS audio queue
    useAvatarStore.getState().audioQueue = [];

    if (typeof message === "string") {
      chat.sendMessage(
        {
          role: "user",
          parts: [{ type: "text", text: message }],
        },
        {
          body: { systemPrompt },
        }
      );
    } else {
      chat.sendMessage(message, {
        body: { systemPrompt },
      });
    }
  };

  return {
    ...chat,
    sendMessage,
  };
}
