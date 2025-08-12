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

  // --- NEW: State for TTS Audio ---
  audioQueue: string[]; // A queue of message texts to be spoken
  addAudioToQueue: (text: string) => void; // Action to add a new message text
  playNextAudio: () => void; // Action to play the next audio in the queue
}

export const useAvatarStore = create<AvatarState>((set, get) => ({
  isSpeaking: false,
  setSpeaking: (isSpeaking) => set({ isSpeaking }),
  chatStatus: "ready",
  setChatStatus: (status) => set({ chatStatus: status }),
  isMuted: false,
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  isRecording: false,
  setIsRecording: (isRecording) => set({ isRecording }),

  // --- NEW: Initial state and actions for TTS Audio ---
  audioQueue: [],
  addAudioToQueue: (text) => {
    set((state) => ({ audioQueue: [...state.audioQueue, text] }));
  },
  playNextAudio: async () => {
    const { audioQueue, isMuted, setSpeaking } = get();

    if (audioQueue.length === 0 || isMuted) {
      setSpeaking(false);
      return;
    }

    setSpeaking(true);
    const nextText = audioQueue[0];

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: nextText }),
      });

      if (!response.ok) throw new Error("Failed to fetch audio stream");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.play();

      audio.onended = () => {
        // When audio finishes, remove it from the queue and try to play the next one
        set((state) => ({ audioQueue: state.audioQueue.slice(1) }));
        get().playNextAudio();
      };
    } catch (error) {
      console.error("Failed to play audio:", error);
      // If there's an error, clear the queue and stop speaking
      set({ audioQueue: [], isSpeaking: false });
    }
  },
}));
