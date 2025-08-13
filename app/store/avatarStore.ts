// store/avatarStore.ts
import { create } from "zustand";
import { UseChatHelpers, UIMessage } from "@ai-sdk/react";

export type ChatStatus = UseChatHelpers<UIMessage>["status"];

interface AvatarState {
  hasInitialized: boolean;
  initialize: () => void;
  isSpeaking: boolean;
  setSpeaking: (isSpeaking: boolean) => void;
  chatStatus: ChatStatus;
  setChatStatus: (status: ChatStatus) => void;
  isMuted: boolean;
  setMuted: (isMuted: boolean) => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
}

export const useAvatarStore = create<AvatarState>((set) => ({
  hasInitialized: false,
  initialize: () => set({ hasInitialized: true }),
  isSpeaking: false,
  setSpeaking: (isSpeaking) => set({ isSpeaking }),
  chatStatus: "ready",
  setChatStatus: (status) => set({ chatStatus: status }),
  isMuted: false,
  setMuted: (isMuted) => set({ isMuted }),
  isRecording: false,
  setIsRecording: (isRecording) => set({ isRecording }),
}));
