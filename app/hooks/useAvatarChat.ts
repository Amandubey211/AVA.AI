"use client";

import React from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai"; // ✅ from original
import type { UIMessage } from "ai";
import { toast } from "react-hot-toast";
import { useAvatarStore } from "../store/avatarStore";

interface UseAvatarChatParams {
  systemPrompt: string;
  ttsVoiceId: string;
}

export function useAvatarChat({
  systemPrompt,
  ttsVoiceId,
}: UseAvatarChatParams) {
  const {
    setSpeaking,
    setChatStatus,
    addAudioToQueue,
    playNextAudio,
    setEmotion,
  } = useAvatarStore();

  const chat = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat", // ✅ uses default transport
    }),

    onError: (error) => {
      toast.error("Sorry, an error occurred.");
      console.error("Chat error:", error);
      setSpeaking(false);
      setEmotion(null);
    },

    onFinish: ({ message }) => {
      const finalText =
        message?.parts.find((p) => p.type === "text")?.text.trim() ?? "";
      const sentimentRegex = /\[([a-zA-Z]+)\]\s*$/;
      const match = finalText.match(sentimentRegex);
      const extractedEmotion = match ? match[1].toLowerCase() : "neutral";
      const cleanedText = finalText.replace(sentimentRegex, "").trim();

      setEmotion(extractedEmotion);

      if (cleanedText) {
        addAudioToQueue(cleanedText, ttsVoiceId);
        playNextAudio();
      } else {
        setSpeaking(false);
        setTimeout(() => setEmotion(null), 1500);
      }
    },
  });

  React.useEffect(() => {
    setChatStatus(chat.status);
    // This now correctly represents the "thinking" animation state.
    if (chat.status === "submitted") {
      setSpeaking(true);
      setEmotion(null);
    }
  }, [chat.status, setChatStatus, setSpeaking, setEmotion]);

  const sendMessage = (message: UIMessage) => {
    useAvatarStore.getState().audioQueue = [];
    setEmotion(null);
    chat.sendMessage(message, { body: { systemPrompt } });
  };

  return { ...chat, sendMessage };
}
