// store/demoStore.ts
"use client";

import { create } from "zustand";
import { randInt } from "three/src/math/MathUtils.js";

interface DemoAvatarState {
  isSpeaking: boolean;
  setSpeaking: (isSpeaking: boolean) => void;
  currentEmotion: string | null;
  setEmotion: (emotion: string | null) => void;
  currentVisemes: [number, number][];
  setVisemes: (visemes: [number, number][]) => void;
  currentAudio: HTMLAudioElement | null;
  setCurrentAudio: (audio: HTMLAudioElement | null) => void;
  blink: boolean;
  triggerBlink: () => void;
}

export const useDemoStore = create<DemoAvatarState>((set) => ({
  isSpeaking: false,
  setSpeaking: (isSpeaking) => set({ isSpeaking }),
  currentEmotion: null,
  setEmotion: (emotion) => set({ currentEmotion: emotion }),
  currentVisemes: [],
  setVisemes: (visemes) => set({ currentVisemes: visemes }),
  currentAudio: null,
  setCurrentAudio: (audio) => set({ currentAudio: audio }),
  blink: false,
  triggerBlink: () => {
    set({ blink: true });
    setTimeout(() => set({ blink: false }), 100);
  },
}));

const nextBlink = () => {
  setTimeout(() => {
    useDemoStore.getState().triggerBlink();
    nextBlink();
  }, randInt(1000, 5000));
};
nextBlink();
