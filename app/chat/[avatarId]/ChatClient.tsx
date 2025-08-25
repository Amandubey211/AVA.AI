// app/chat/[avatarId]/ChatClient.tsx
"use client";

import ChatExperience from "@/app/components/ChatExperience";
import DemoExperience from "@/app/components/DemoExperience";
import { AvatarConfig } from "@/app/lib/avatars";

// This component receives the fully loaded, stable data as props
export default function ChatClient({
  avatar,
  isDevelopment,
}: {
  avatar: AvatarConfig;
  isDevelopment: boolean;
}) {
  // All the logic is now simply to decide which experience to render.
  // The `key` prop ensures a full re-mount when switching between avatars.
  return isDevelopment ? (
    <ChatExperience key={avatar.id} avatar={avatar} />
  ) : (
    <DemoExperience key={avatar.id} avatar={avatar} />
  );
}
