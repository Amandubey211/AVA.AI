"use client";

import React from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { useAvatarStore } from "@/app/store/avatarStore";
import { playTTS } from "@/app/lib/playTTS";

interface UseAvatarChatParams {
  systemPrompt: string;
}

export function useAvatarChat({ systemPrompt }: UseAvatarChatParams) {
  const { setSpeaking, setChatStatus } = useAvatarStore();

  const chat = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),

    onFinish: async ({ message }) => {
      console.log("onFinish triggered with full assistant message:", message);

      const text =
        message?.parts
          ?.filter((part) => part.type === "text")
          .map((part) => (part as { type: "text"; text: string }).text)
          .join("")
          .trim() ?? "";

      if (text) {
        try {
          setSpeaking(true);
          await playTTS(text);
          console.log("TTS playback succeeded");
        } catch (e) {
          console.error("TTS playback failed", e);
        } finally {
          setSpeaking(false);
        }
      } else {
        console.warn("No text found in assistant message parts for TTS");
        setSpeaking(false);
      }
    },

    onError: (error) => {
      console.error("Chat error:", error);
      setSpeaking(false);
    },
  });

  React.useEffect(() => {
    setChatStatus(chat.status);
    if (chat.status === "streaming") {
      setSpeaking(true);
    }
  }, [chat.status, setChatStatus, setSpeaking]);

  const sendMessageWithSystemPrompt = (message: UIMessage | string) => {
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
    sendMessage: sendMessageWithSystemPrompt,
  };
}
