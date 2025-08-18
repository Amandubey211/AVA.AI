// app/chat/[avatarId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AvatarConfig, avatars } from "@/app/lib/avatars";
import ChatExperience from "@/app/components/ChatExperience";
import Loader from "@/app/components/Loader";
import DemoExperience from "@/app/components/DemoExperience";

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const [avatar, setAvatar] = useState<AvatarConfig | null>(null);
  const [isDevelopment, setIsDevelopment] = useState(false);
  useEffect(() => {
    // Check the env var once
    setIsDevelopment(process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === "true");

    if (params && params.avatarId) {
      const { avatarId } = params as { avatarId: string };
      const foundAvatar = avatars.find((a) => a.id === avatarId);
      if (foundAvatar) {
        setAvatar(foundAvatar);
      } else {
        router.push("/");
      }
    }
  }, [params, router]);

  if (!avatar) {
    return <Loader text="Loading Assistant..." />;
  }

  return isDevelopment ? (
    <ChatExperience key={avatar.id} avatar={avatar} />
  ) : (
    <DemoExperience avatar={avatar} />
  );
}
