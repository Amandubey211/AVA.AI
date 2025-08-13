// store/avatarStore.ts
"use client"; // Zustand stores are client-side

import { create } from "zustand";
import { UseChatHelpers, UIMessage } from "@ai-sdk/react";
import { playTTS } from "../lib/playTTS";

// Define the type for chat status, derived from the AI SDK's useChat hook.
export type ChatStatus = UseChatHelpers<UIMessage>["status"];

// Define the interface for the state managed by this store.
interface AvatarState {
  // UI Initialization State
  hasInitialized: boolean;
  initialize: () => void;

  // Speaking Animation State
  isSpeaking: boolean;
  setSpeaking: (isSpeaking: boolean) => void;

  // Chat Status from AI SDK
  chatStatus: ChatStatus;
  setChatStatus: (status: ChatStatus) => void;

  // Microphone Control States
  isMuted: boolean;
  setMuted: (isMuted: boolean) => void; // Explicit setter for mute state
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;

  // --- NEW: State and Actions for TTS Audio Queue ---
  audioQueue: string[]; // A queue of text strings that need to be spoken
  addAudioToQueue: (text: string) => void; // Action to add text to the queue
  playNextAudio: () => void; // Action to start/continue playing audio from the queue
}

// Create the Zustand store
export const useAvatarStore = create<AvatarState>((set, get) => ({
  // --- Initial State Values ---
  hasInitialized: false,
  isSpeaking: false,
  chatStatus: "ready",
  isMuted: false,
  isRecording: false,
  audioQueue: [], // Initialize audio queue as empty

  // --- Actions (State Modifiers) ---

  // Action to mark the UI as initialized (e.g., after user's first click)
  initialize: () => set({ hasInitialized: true }),

  // Set whether the avatar should be "speaking" (for lip-sync)
  setSpeaking: (isSpeaking) => set({ isSpeaking }),

  // Set the current chat status (e.g., 'ready', 'submitted', 'streaming')
  setChatStatus: (status) => set({ chatStatus: status }),

  // Explicitly set the mute state
  setMuted: (isMuted) => set({ isMuted }),

  // Explicitly set whether the microphone is actively recording
  setIsRecording: (isRecording) => set({ isRecording }),

  // --- TTS Audio Queue Actions ---

  // Adds a new text string to the end of the audio queue
  addAudioToQueue: (text) => {
    set((state) => ({ audioQueue: [...state.audioQueue, text] }));
  },

  // Plays the next audio in the queue. This is an asynchronous loop.
  playNextAudio: async () => {
    const { audioQueue, isMuted, setSpeaking } = get(); // Get current state values

    // If the queue is empty or the app is muted, stop speaking and return.
    if (audioQueue.length === 0 || isMuted) {
      setSpeaking(false);
      return;
    }

    // Set speaking to true to activate lip-sync while audio is playing.
    setSpeaking(true);

    // Get the next text string to play (without removing it yet).
    const nextText = audioQueue[0];

    try {
      // Call the playTTS helper function and await its completion.
      // This ensures sentences play sequentially.
      await playTTS(nextText);

      // Once audio finishes, remove the played sentence from the queue.
      // Then, recursively call playNextAudio to process the next item.
      set((state) => ({ audioQueue: state.audioQueue.slice(1) }));
      get().playNextAudio(); // Call get() to ensure we get the latest state for recursion.
    } catch (error) {
      console.error("Failed to play audio:", error);
      // On error, clear the entire queue and stop speaking to prevent getting stuck.
      set({ audioQueue: [], isSpeaking: false });
    }
  },
}));
