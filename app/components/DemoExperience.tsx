// components/DemoExperience.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
// import Image from "next/image";
import { useDemoStore } from "../store/demoStore";
import { useAvatarStore } from "../store/avatarStore";
import { AvatarConfig } from "../lib/avatars";
import DemoAvatarCanvas from "./DemoAvatarCanvas";
import ChatMessage from "./ChatMessage";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { DemoInteraction, alexDemoScript } from "../lib/demo-data";
import DemoControls from "./DemoControls";
import TypingIndicator from "./TypingIndicator";
import type { UIMessage } from "@ai-sdk/react";
import BuyMeACoffeeModal from "./BuyMeACoffeeModal";

export default function DemoExperience({ avatar }: { avatar: AvatarConfig }) {
  const router = useRouter();
  const { setEmotion, setSpeaking, setVisemes, setCurrentAudio, isSpeaking } =
    useDemoStore();
  const { openModal } = useAvatarStore();

  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDemoSelect = (interaction: DemoInteraction) => {
    if (isThinking || isSpeaking) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${interaction.id}`,
        role: "user",
        parts: [{ type: "text", text: interaction.userQuestion }],
      },
    ]);

    setIsThinking(true);
    setEmotion(null);

    setTimeout(() => {
      setIsThinking(false);
      setEmotion(interaction.emotion);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${interaction.id}`,
          role: "assistant",
          parts: [
            {
              type: "text",
              text: interaction.aiResponse.replace(/\[([a-zA-Z]+)\]\s*$/, ""),
            },
          ],
        },
      ]);

      const audio = new Audio(interaction.audioUrl);
      setCurrentAudio(audio);
      setVisemes(interaction.visemes);
      setSpeaking(true);

      audio.play();
      audio.onended = () => {
        setSpeaking(false);
        setCurrentAudio(null);
        setVisemes([]);
        setEmotion(null);
      };
    }, 1500);
  };

  const videoId = "bUw9OxeBJhI";
  const demoVideoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&mute=1&showinfo=0&rel=0`;

  return (
    <main className="relative w-screen h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      <BuyMeACoffeeModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      {/* --- Unified Floating Back Button (Visible on ALL screen sizes) --- */}
      <div className="absolute top-6 left-6 z-30">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 px-4 py-2 bg-black/50 text-white font-semibold rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
          aria-label="Back to Gallery"
        >
          <ArrowLeft size={20} />
          {/* Text is hidden on small screens, visible on screens `sm` and up */}
          <span className="hidden sm:inline">Back to Gallery</span>
        </button>
      </div>

      {/* --- Base Layer: Avatar Canvas (No change needed) --- */}
      <div className="absolute inset-0 md:relative md:w-3/5 h-full">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${avatar.bgImageUrl})` }}
        />
        <div className="relative z-10 w-full h-full">
          <DemoAvatarCanvas
            thinking={isThinking}
            modelUrl={avatar.modelUrl}
            expressions={avatar.expressions}
            idleAnimationUrl={avatar.idleAnimationUrl}
            camera={{ position: [0, 0, 2.2], fov: 75 }}
          />
        </div>
      </div>

      {/* --- UI Layer: The Unified Chat Panel --- */}
      {/* This single div now handles both mobile and desktop layouts. */}
      <div className="absolute inset-0 z-20 flex flex-col md:relative md:w-2/5 bg-black/30  md:border-l-2 border-white/10">
        {/* --- Responsive Header --- */}
        <div className="p-4 text-center border-b border-white/10 md:pt-6 pt-10">
          {/* Mobile Title (hidden on md and up) */}
          <h2 className="text-2xl font-bold md:hidden">{`Chat with ${avatar.character}`}</h2>
          {/* Desktop Title (hidden by default) */}
          <h2 className="text-2xl font-bold hidden md:block">
            Interactive Demo with
          </h2>
          <p className="text-gray-400 mt-1 text-sm md:text-xs ">
            {avatar.shortDescription}
          </p>
        </div>

        <motion.div className="flex-grow overflow-y-auto  custom-scrollbar text-xs">
          {messages.slice(-1).map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              avatarCharacterName={avatar.character}
            />
          ))}
          {isThinking && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </motion.div>

        {/* --- Demo Controls (Now a permanent footer for the panel) --- */}
        <div className="border-t border-white/10">
          <DemoControls
            script={alexDemoScript}
            onSelect={handleDemoSelect}
            onWatchDemo={() => openModal(demoVideoUrl)}
            onSupport={() => setIsSupportModalOpen(true)}
          />
        </div>
      </div>
    </main>
  );
}
