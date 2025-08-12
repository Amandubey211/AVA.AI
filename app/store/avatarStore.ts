// store/avatarStore.ts
import { create } from "zustand";
import { UseChatHelpers, UIMessage } from "@ai-sdk/react";

export type ChatStatus = UseChatHelpers<UIMessage>["status"];

interface AvatarState {
  isSpeaking: boolean;
  setSpeaking: (isSpeaking: boolean) => void;
  chatStatus: ChatStatus;
  setChatStatus: (status: ChatStatus) => void;
  isMuted: boolean;
  toggleMute: () => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;

  isTtsLoading: boolean; // New: indicates if TTS fetch in progress
  setTtsLoading: (loading: boolean) => void;
}

export const useAvatarStore = create<AvatarState>((set) => ({
  isSpeaking: false,
  setSpeaking: (isSpeaking) => set({ isSpeaking }),
  chatStatus: "ready",
  setChatStatus: (status) => set({ chatStatus: status }),
  isMuted: false,
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  isRecording: false,
  setIsRecording: (isRecording) => set({ isRecording }),

  isTtsLoading: false,
  setTtsLoading: (loading) => set({ isTtsLoading: loading }),
}));
