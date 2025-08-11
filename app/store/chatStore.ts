// store/chatStore.ts
import { create } from "zustand";
import { avatars, AvatarConfig } from "../lib/avatars";

interface ChatState {
  currentAvatar: AvatarConfig;
  setCurrentAvatar: (avatar: AvatarConfig) => void;
  // ... we will add more state later
}

export const useChatStore = create<ChatState>((set) => ({
  // Set the first avatar as the default
  currentAvatar: avatars[0],

  // Action to update the avatar
  setCurrentAvatar: (avatar) => set({ currentAvatar: avatar }),
}));
