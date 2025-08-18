// components/ChatExperience.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
// import Image from "next/image";
import { useAvatarStore } from "../store/avatarStore";
import { AvatarConfig } from "../lib/avatars";
import AvatarCanvas from "./AvatarCanvas";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput"; // For Desktop
import { motion } from "framer-motion";
import { ArrowLeft, Coffee, Video } from "lucide-react";
import { useAvatarChat } from "../hooks/useAvatarChat";
import TypingIndicator from "./TypingIndicator";
import VoiceInputButton from "./VoiceInputButton"; // For Mobile
import LiveTranscript from "./LiveTranscript"; // For Mobile
import BuyMeACoffeeModal from "./BuyMeACoffeeModal";
// import DebugPanel from "./DebugPanel";

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
  const {
    isRecording,
    setIsRecording,
    isMuted,
    setMuted,
    initialize,
    openModal,
  } = useAvatarStore();

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

  const {
    messages,
    status,
    stop,
    sendMessage,
    setMessages,
  } = // we can use error field in future
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
      }, 500);
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDevelopment]);

  // Speech Recognition Setup (with all bug fixes)
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
    if (isRecording) {
      if (input.trim()) {
        handleSend(input);
      }
      isMuteAction.current = false;
      recognition?.stop();
    } else {
      setInput("");
      finalTranscriptRef.current = "";
      setMuted(false);
      recognition?.start();
      setIsRecording(true);
    }
  };

  const handleMuteToggle = () => {
    const nextMutedState = !isMuted;
    setMuted(nextMutedState);
    if (isRecording) {
      isMuteAction.current = true;
      recognition?.stop();
      if (!nextMutedState) {
        recognition?.start();
      }
    }
  };

  const videoId = "bUw9OxeBJhI";
  const demoVideoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&mute=1&showinfo=0&rel=0`;

  return (
    <main className="relative w-screen h-screen flex flex-col md:flex-row bg-gray-900 text-white overflow-hidden">
      {/* --- UI ENHANCEMENT: Global Background Image --- */}
      {/* This div now covers the entire screen, sitting behind all UI elements. */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center filter blur-sm"
        style={{ backgroundImage: `url(${avatar.bgImageUrl})` }}
      />
      {/* A subtle vignette overlay on top of the background */}
      <div className="absolute inset-0 z-0 bg-black/30"></div>

      {/* {isDevelopment && <DebugPanel avatar={avatar} />} */}
      <BuyMeACoffeeModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      {/* --- FLOATING DESKTOP BACK BUTTON --- */}
      <div className="absolute top-6 left-6 z-30 hidden md:flex">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 px-4 py-2 bg-black/50 text-white font-semibold rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
          aria-label="Back to Gallery"
        >
          <ArrowLeft size={20} />
          <span>Back to Gallery</span>
        </button>
      </div>

      {/* --- Base Layer: Avatar Canvas --- */}
      {/* This is now a transparent canvas floating on top of the background */}
      <div className="absolute inset-0 md:relative md:w-3/5 h-full">
        <div className="relative z-10 w-full h-full">
          <AvatarCanvas
            modelUrl={avatar.modelUrl}
            expressions={avatar.expressions}
            idleAnimationUrl={avatar.idleAnimationUrl}
            camera={{ position: [0, 0, 2.2], fov: 75 }}
          />
        </div>
      </div>

      {/* --- UI Layer --- */}
      <div className="absolute inset-0 z-20 flex flex-col md:relative md:w-2/5">
        {/* --- MOBILE UI (hidden on medium screens and up) --- */}
        <div className="md:hidden flex flex-col h-full w-full">
          <div className="absolute top-6 left-4 right-4 z-20">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-4 py-2 bg-black/50 text-white font-semibold rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
            >
              <ArrowLeft size={20} /> Back
            </button>
          </div>

          {isDevelopment ? (
            // Mobile "Online" View
            <>
              <LiveTranscript
                messages={messages}
                avatarCharacterName={avatar.character}
              />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <VoiceInputButton toggleRecording={toggleRecording} />
              </div>
            </>
          ) : (
            // Mobile "Offline" View
            <div className="flex flex-col items-center justify-end h-full text-center text-gray-400 p-4 pb-12">
              <div className="flex flex-col gap-3 w-full max-w-xs">
                <button
                  onClick={() => openModal(demoVideoUrl)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition-colors"
                >
                  <Video size={18} /> Watch Demo Video
                </button>
                <button
                  onClick={() => setIsSupportModalOpen(true)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Coffee size={18} /> Support the Project
                </button>
              </div>
            </div>
          )}
        </div>

        {/* --- DESKTOP UI (visible on medium screens and up) --- */}
        {/* UI ENHANCEMENT: Increased backdrop-blur and adjusted background color */}
        <div className="hidden md:flex w-full h-full flex-col bg-black/20 backdrop-blur-2xl border-l-2 border-white/10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 flex items-center gap-4 border-b border-white/10"
          >
            <div className="flex-grow">
              <h2 className="text-2xl font-bold tracking-tight">{`Chat with ${avatar.character}`}</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-xs text-green-400">Online</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.15 } },
            }}
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
                  The live AI chat is currently offline to manage API costs. You
                  can see the full experience in the demo video.
                </p>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <button
                    onClick={() => openModal(demoVideoUrl)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition-colors"
                  >
                    <Video size={18} /> Watch Demo Video
                  </button>
                  <button
                    onClick={() => setIsSupportModalOpen(true)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Coffee size={18} /> Support the Project
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
