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
import { ArrowLeft, Coffee, Video } from "lucide-react";
import { useAvatarChat } from "../hooks/useAvatarChat";
import TypingIndicator from "./TypingIndicator";
import BuyMeACoffeeModal from "./BuyMeACoffeeModal";
import DebugPanel from "./DebugPanel";

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

  const finalTranscriptRef = useRef("");
  const isMuteAction = useRef(false);
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  useEffect(() => {
    setIsDevelopment(process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === "true");
  }, []);

  const { messages, status, error, stop, sendMessage, setMessages } =
    useAvatarChat({
      systemPrompt: avatar.systemPrompt,
      ttsVoiceId: avatar.ttsVoiceId,
    });

  // Welcome Message Logic
  useEffect(() => {
    if (messages.length === 0 && isDevelopment) {
      const welcomeMessage = `Hello! I'm ${avatar.character}. How can I help you today?`;
      const timeoutId = setTimeout(() => {
        setMessages([
          {
            id: "welcome-msg",
            role: "assistant",
            parts: [{ type: "text", text: welcomeMessage }],
          },
        ]);
        useAvatarStore
          .getState()
          .addAudioToQueue(welcomeMessage, avatar.ttsVoiceId);
        useAvatarStore.getState().playNextAudio();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDevelopment]);

  // Speech Recognition Setup
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
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInput(finalTranscriptRef.current + interimTranscript);
    };
    recog.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };
    recog.onend = () => {
      if (!isMuteAction.current) {
        setIsRecording(false);
      }
      isMuteAction.current = false;
    };
    setRecognition(recog);
    return () => {
      recog.stop();
    };
  }, [setIsRecording]);

  useEffect(() => {
    initialize();
  }, [initialize]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    if (input === "") {
      finalTranscriptRef.current = "";
    }
  }, [input]);

  const handleSend = (messageText: string) => {
    if (!messageText.trim() || !avatar) return;
    sendMessage({
      id: `user-msg-${Date.now()}`,
      role: "user",
      parts: [{ type: "text", text: messageText }],
    });
    setInput("");
    finalTranscriptRef.current = "";
  };

  const toggleRecording = () => {
    /* ... */
  };
  const handleMuteToggle = () => {
    /* ... */
  };
  const listVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const videoId = "40UcgTHhIWY";
  return (
    <main className="relative w-screen h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      {isDevelopment && <DebugPanel avatar={avatar} />}
      <BuyMeACoffeeModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-3/5 h-full relative">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${avatar.bgImageUrl})` }}
          />
          <div className="relative z-10 w-full h-full">
            <AvatarCanvas
              modelUrl={avatar.modelUrl}
              expressions={avatar.expressions}
              idleAnimationUrl={avatar.idleAnimationUrl}
              camera={{ position: [0, 0, 2.2], fov: 75 }}
            />
          </div>
        </div>
        <div className="w-2/5 h-full flex flex-col bg-black/40 backdrop-blur-xl border-l-2 border-white/10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 flex items-center gap-4 border-b border-white/10"
          >
            <button
              onClick={() => router.push("/")}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Back to Gallery"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-grow">
              <h2 className="text-xl font-bold tracking-tight">{`Chat with ${avatar.character}`}</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-xs text-green-400">Online</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="flex-grow overflow-y-auto p-6 custom-scrollbar"
            aria-live="polite"
          >
            {!isDevelopment ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-center text-gray-400"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  Live Demo Coming Soon!
                </h3>
                <p className="max-w-xs mb-6">
                  The live AI chat is currently offline to manage API costs
                  during development. You can see the full experience in the
                  demo video.
                </p>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <a
                    href={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&mute=1&showinfo=0&rel=0`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition-colors"
                  >
                    <Video size={18} />
                    Watch Demo Video
                  </a>
                  <button
                    onClick={() => setIsSupportModalOpen(true)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Coffee size={18} />
                    Support the Project
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    avatarCharacterName={avatar.character}
                  />
                ))}
                {status === "submitted" && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </>
            )}
          </motion.div>

          {isDevelopment && (
            <div className="p-6 pt-2">
              <ChatInput
                input={input}
                setInput={setInput}
                onSend={handleSend}
                status={status}
                stop={stop}
                toggleRecording={toggleRecording}
                handleMuteToggle={handleMuteToggle}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
