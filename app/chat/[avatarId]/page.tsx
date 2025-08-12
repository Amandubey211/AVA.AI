// app/chat/[avatarId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AvatarConfig, avatars } from "@/app/lib/avatars";
import ChatExperience from "@/app/components/ChatExperience";

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const [avatar, setAvatar] = useState<AvatarConfig | null>(null);

  useEffect(() => {
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
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center text-white">
        Loading Assistant...
      </div>
    );
  }

  return <ChatExperience key={avatar.id} avatar={avatar} />;
}
