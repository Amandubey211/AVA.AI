"use client";

import AvatarCanvas from "@/app/components/AvatarCanvas";
import ChatInput from "@/app/components/ChatInput";
import ChatMessage from "@/app/components/ChatMessage";
import { AvatarConfig, avatars } from "@/app/lib/avatars";
import { useAvatarStore } from "@/app/store/chatStore";
import { UIMessage } from "@ai-sdk/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();

  const [avatar, setAvatar] = useState<AvatarConfig | null>(null);
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { isSpeaking, setSpeaking } = useAvatarStore();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { avatarId } = params;
    const foundAvatar = avatars.find((a) => a.id === avatarId);
    if (foundAvatar) setAvatar(foundAvatar);
    else router.push("/");
  }, [params, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (messageContent: string) => {
    if (!avatar) return;

    // --- FIX: Construct UIMessage with the correct `parts` array ---
    const userMessage: UIMessage = {
      id: Date.now().toString(),
      role: "user",
      parts: [{ type: "text", text: messageContent }],
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setSpeaking(true);

    try {
      // The `messages` are already in the correct format, so no mapping is needed here
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: avatar.systemPrompt,
          messages: newMessages,
        }),
      });

      if (!response.ok) throw new Error("API request failed");

      const aiResponseJson = await response.json();
      // --- FIX: Construct the AI message with the correct `parts` array ---
      const aiMessage: UIMessage = {
        id: Date.now().toString(),
        role: "assistant",
        parts: [{ type: "text", text: aiResponseJson.content }],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      // --- FIX: Construct the error message with the correct `parts` array ---
      const errorMessage: UIMessage = {
        id: Date.now().toString(),
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Sorry, I ran into an error. Please try again.",
          },
        ],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setSpeaking(false);
    }
  };

  if (!avatar) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center text-white">
        Loading Assistant...
      </div>
    );
  }

  return (
    <main className="relative w-screen h-screen flex flex-col bg-gray-900 text-white">
      {/* ... (rest of the JSX is unchanged) ... */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 px-4 py-2 bg-black/50 text-white font-semibold rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
        >
          &larr; Back
        </button>
      </div>
      <div className="flex-grow flex overflow-hidden">
        <div className="w-3/5 h-full bg-gray-900">
          <AvatarCanvas
            modelUrl={avatar.modelUrl}
            isSpeaking={isSpeaking}
            camera={{ position: [0, 0, 2.2], fov: 70 }}
          />
        </div>
        <div className="w-2/5 h-full p-6 flex flex-col bg-gray-800 border-l-2 border-gray-700">
          <div className="mb-4">
            <h2 className="text-3xl font-bold">Chat with {avatar.character}</h2>
            <p className="text-gray-400">{avatar.shortDescription}</p>
          </div>
          <div className="flex-grow overflow-y-auto pr-4 mb-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <ChatMessage
                message={{
                  id: "thinking",
                  role: "assistant",
                  parts: [{ type: "text", text: "Thinking..." }],
                }}
              />
            )}
            <div ref={messagesEndRef} />
          </div>
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
}
