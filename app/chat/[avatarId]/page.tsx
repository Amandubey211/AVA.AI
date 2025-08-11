// app/chat/[avatarId]/page.tsx
"use client";

import AvatarCanvas from "@/app/components/AvatarCanvas";
import { AvatarConfig, avatars } from "@/app/lib/avatars";
import { useParams, useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const { avatarId } = params;

  const [avatar, setAvatar] = useState<AvatarConfig | null>(null);

  useEffect(() => {
    const foundAvatar = avatars.find((a) => a.id === avatarId);
    if (foundAvatar) {
      setAvatar(foundAvatar);
    }
  }, [avatarId]);

  if (!avatar) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        Loading assistant...
      </div>
    );
  }

  return (
    <main className="w-screen h-screen flex flex-col bg-gray-900">
      <div className="p-4 bg-black/50">
        <button
          onClick={() => router.push("/")}
          className="text-green-400 font-bold"
        >
          &larr; Back to Gallery
        </button>
      </div>
      <div className="flex-grow flex">
        <div className="w-1/2 h-full">
          <AvatarCanvas modelUrl={avatar.modelUrl} />
        </div>
        <div className="w-1/2 h-full p-6 flex items-center justify-center">
          <div className="w-full h-full bg-gray-800 rounded-xl p-4">
            <h2 className="text-3xl font-bold">Chat with {avatar.character}</h2>
            {/* Chat UI will go here */}
          </div>
        </div>
      </div>
    </main>
  );
}
