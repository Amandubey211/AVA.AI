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
import { ArrowLeft, Info } from "lucide-react";
import { useAvatarChat } from "../hooks/useAvatarChat";

// Type definitions for robust Speech Recognition
interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}
interface IWindow extends Window {
  SpeechRecognition: SpeechRecognitionStatic;
  webkitSpeechRecognition: SpeechRecognitionStatic;
}

export default function ChatExperience({ avatar }: { avatar: AvatarConfig }) {
  const router = useRouter();
  const { isRecording, setIsRecording, isMuted, setMuted, initialize } =
    useAvatarStore();
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // --- THE DEFINITIVE FIX: A ref to track the reason for stopping recognition ---
  // This ref will tell our `onend` handler whether to *truly* stop the session.
  const isMuteAction = useRef(false);

  const [isDevelopment, setIsDevelopment] = useState(false);
  useEffect(() => {
    setIsDevelopment(process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === "true");
  }, []);

  const { messages, status, error, stop, sendMessage } = useAvatarChat({
    systemPrompt: avatar.systemPrompt,
  });

  // Initialize Speech Recognition
  useEffect(() => {
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
    recog.onresult = (event: SpeechRecognitionEvent) => {
      if (useAvatarStore.getState().isMuted) return;
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setInput(transcript);
    };
    recog.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    // --- THE DEFINITIVE FIX: The "smart" onend handler ---
    recog.onend = () => {
      // This handler now checks our flag.
      // If the stop was caused by a mute/unmute action, we do nothing.
      if (isMuteAction.current) {
        // Reset the flag for the next action.
        isMuteAction.current = false;
        return;
      }
      // If it was a "natural" stop (e.g., user clicked the main stop button),
      // then we update the state.
      setIsRecording(false);
    };
    setRecognition(recog);
  }, [setIsRecording]);

  useEffect(() => {
    initialize();
  }, [initialize]);
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

  // --- THE DEFINITIVE, BUG-FREE LOGIC ---
  const toggleRecording = () => {
    if (isRecording) {
      isMuteAction.current = false; // This is a real stop, not a mute action.
      recognition?.stop();
    } else {
      setInput("");
      setMuted(false);
      recognition?.start();
      setIsRecording(true);
    }
  };

  const handleMuteToggle = () => {
    const nextMutedState = !isMuted;
    setMuted(nextMutedState);

    if (isRecording) {
      isMuteAction.current = true; // Signal to `onend` to ignore this stop.
      recognition?.stop();

      if (!nextMutedState) {
        // If unmuting, immediately restart. The `onend` event will be ignored.
        recognition?.start();
      }
    }
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
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-3 my-4 p-3 text-sm text-gray-400 bg-gray-800 rounded-lg"
              >
                <Info size={18} />
                <div className="text-center">
                  This feature is currently in development.
                  <br />
                  Full functionality will be live by 15-08-2025 (12 AM IST).
                </div>
              </motion.div>
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
            handleMuteToggle={handleMuteToggle}
          />
        </div>
      </div>
    </main>
  );
}
