import { create } from "zustand";

interface AvatarAnimationState {
  isSpeaking: boolean;
  setSpeaking: (isSpeaking: boolean) => void;
}

export const useAvatarStore = create<AvatarAnimationState>((set) => ({
  isSpeaking: false,
  setSpeaking: (isSpeaking) => set({ isSpeaking }),
}));

// Optional: Add selector hooks for better performance
export const useIsSpeaking = () => useAvatarStore((state) => state.isSpeaking);
