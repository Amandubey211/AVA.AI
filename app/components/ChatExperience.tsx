// components/ChatExperience.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAvatarStore } from "../store/avatarStore";
import { AvatarConfig } from "../lib/avatars";
import AvatarCanvas from "./AvatarCanvas";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useAvatarChat } from "../hooks/useAvatarChat";
import SystemMessage from "./SystemMessage";
import { useDevMode } from "../hooks/use-dev-mode";

// --- THE DEFINITIVE TYPE-SAFE SPEECH RECOGNITION SETUP ---
// 1. Define an interface for the SpeechRecognition constructor
interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}

// 2. Extend the global Window interface to include both standard and vendor-prefixed versions
interface IWindow extends Window {
  SpeechRecognition: SpeechRecognitionStatic;
  webkitSpeechRecognition: SpeechRecognitionStatic;
}

export default function ChatExperience({ avatar }: { avatar: AvatarConfig }) {
  const router = useRouter();
  const { isRecording, setIsRecording } = useAvatarStore();
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const isDevelopment = useDevMode();

  const { messages, status, error, stop, sendMessage } = useAvatarChat({
    systemPrompt: avatar.systemPrompt,
  });

  useEffect(() => {
    // 3. Use the extended IWindow type for the window object
    const SpeechRecognitionAPI =
      (window as IWindow).SpeechRecognition ||
      (window as IWindow).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      console.warn("SpeechRecognition API not supported.");
      return;
    }
    const recog = new SpeechRecognitionAPI();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = "en-US";

    // 4. Use the correct `SpeechRecognitionEvent` type
    recog.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setInput(transcript);
    };

    // 5. Use the correct `SpeechRecognitionErrorEvent` type, removing the `any`
    recog.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recog.onend = () => setIsRecording(false);
    setRecognition(recog);
  }, [setIsRecording]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (messageText: string) => {
    if (!messageText.trim() || !avatar) return;
    sendMessage({
      id: `user-msg-${Date.now()}`,
      role: "user",
      parts: [{ type: "text", text: messageText }],
    });
    setInput("");
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognition?.stop();
    } else {
      setInput("");
      recognition?.start();
    }
    setIsRecording(!isRecording);
  };

  const listVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  return (
    <main className="relative w-screen h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 px-4 py-2 bg-black/50 text-white font-semibold rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
          aria-label="Back to Gallery"
        >
          <ArrowLeft size={20} />
          <span>Back to Gallery</span>
        </button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-3/5 h-full relative">
          <AvatarCanvas
            modelUrl={avatar.modelUrl}
            isSpeaking={useAvatarStore((s) => s.isSpeaking)}
            camera={{ position: [0, 0, 2.2], fov: 75 }}
          />
        </div>
        <div className="w-2/5 h-full p-6 flex flex-col bg-black/30 backdrop-blur-lg border-l-2 border-white/10">
          <div className="mb-6 text-center">
            <h2 className="text-4xl font-bold tracking-tight">{`Chat with ${avatar.character}`}</h2>
            <p className="text-gray-400 mt-1">{avatar.shortDescription}</p>
          </div>
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="flex-grow overflow-y-auto pr-4 -mr-4 mb-4 custom-scrollbar"
            aria-live="polite"
          >
            {!isDevelopment && (
              <SystemMessage>
                This feature is currently in development.
                <br />
                Full functionality will be live by 15-08-2025 (12 AM IST).
              </SystemMessage>
            )}

            {isDevelopment &&
              messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

            {isDevelopment && status === "submitted" && (
              <ChatMessage
                message={{
                  id: "thinking",
                  role: "assistant",
                  parts: [{ type: "text", text: "Thinking..." }],
                }}
              />
            )}
            <div ref={messagesEndRef} />
          </motion.div>
          {isDevelopment && error && (
            <div className="text-red-500 text-sm mb-4 p-3 bg-red-500/10 rounded-lg">
              <strong>Error:</strong> {error.message}
            </div>
          )}
          <ChatInput
            input={input}
            setInput={setInput}
            onSend={isDevelopment ? handleSend : () => {}}
            status={status}
            stop={stop}
            toggleRecording={toggleRecording}
          />
        </div>
      </div>
    </main>
  );
}
