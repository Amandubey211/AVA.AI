// store/avatarStore.ts
"use client";

import { create } from "zustand";
import { UseChatHelpers, UIMessage } from "@ai-sdk/react";
import { playTTS } from "../lib/playTTS";
import { randInt } from "three/src/math/MathUtils.js";

export type ChatStatus = UseChatHelpers<UIMessage>["status"];

interface AvatarState {
  hasInitialized: boolean;
  initialize: () => void;
  isSpeaking: boolean;
  setSpeaking: (isSpeaking: boolean) => void;
  isAudioPlaying: boolean;
  chatStatus: ChatStatus;
  setChatStatus: (status: ChatStatus) => void;
  isMuted: boolean;
  setMuted: (isMuted: boolean) => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  audioQueue: { text: string; ttsVoiceId: string }[];
  addAudioToQueue: (text: string, ttsVoiceId: string) => void;
  playNextAudio: () => void;
  currentEmotion: string | null;
  setEmotion: (emotion: string | null) => void;
  isPlaying: boolean;
  // --- NEW: Add blink state to the global store ---
  blink: boolean;
  triggerBlink: () => void;
  isModalOpen: boolean;
  modalVideoUrl: string;
  openModal: (url: string) => void;
  closeModal: () => void;
}

export const useAvatarStore = create<AvatarState>((set, get) => ({
  hasInitialized: false,
  initialize: () => set({ hasInitialized: true }),
  isSpeaking: false,
  setSpeaking: (isSpeaking) => set({ isSpeaking }),
  isAudioPlaying: false,
  chatStatus: "ready",
  setChatStatus: (status) => set({ chatStatus: status }),
  isMuted: false,
  setMuted: (isMuted) => set({ isMuted }),
  isRecording: false,
  setIsRecording: (isRecording) => set({ isRecording }),
  audioQueue: [],
  currentEmotion: null,
  isPlaying: false,
  blink: false,
  isModalOpen: false,
  modalVideoUrl: "",
  openModal: (url) => set({ isModalOpen: true, modalVideoUrl: url }),
  closeModal: () => set({ isModalOpen: false, modalVideoUrl: "" }),

  // --- NEW: Blink Action ---
  // This action will be called by a global timer
  triggerBlink: () => {
    set({ blink: true });
    setTimeout(() => set({ blink: false }), 100);
  },

  setEmotion: (emotion) => set({ currentEmotion: emotion }),

  addAudioToQueue: (text, ttsVoiceId) => {
    set((state) => ({
      audioQueue: [...state.audioQueue, { text, ttsVoiceId }],
    }));
  },

  playNextAudio: async () => {
    const { audioQueue, isMuted, isPlaying } = get();
    if (isPlaying) return;
    if (audioQueue.length === 0 || isMuted) {
      set({ isSpeaking: false, isAudioPlaying: false, currentEmotion: null });
      return;
    }
    set({ isPlaying: true, isSpeaking: true, isAudioPlaying: true });
    const nextAudio = audioQueue[0];
    try {
      const { audio } = await playTTS(nextAudio.text, nextAudio.ttsVoiceId);
      audio.play();
      audio.onended = () => {
        set({ isPlaying: false });
        set((state) => ({ audioQueue: state.audioQueue.slice(1) }));
        get().playNextAudio();
      };
    } catch (error) {
      console.error("Failed to play audio:", error);
      set({
        audioQueue: [],
        isSpeaking: false,
        isAudioPlaying: false,
        currentEmotion: null,
        isPlaying: false,
      });
    }
  },
}));

// --- NEW: Global Blinking Timer ---
// This timer lives outside the React lifecycle and calls our store's action.
const nextBlink = () => {
  setTimeout(() => {
    useAvatarStore.getState().triggerBlink();
    nextBlink();
  }, randInt(1000, 5000));
};
nextBlink(); // Start the timer when the app loads
