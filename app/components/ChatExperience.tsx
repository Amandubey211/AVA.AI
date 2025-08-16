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
import TypingIndicator from "./TypingIndicator";

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
  useEffect(() => {
    setIsDevelopment(process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === "true");
  }, []);

  const { messages, status, stop, sendMessage, setMessages } = useAvatarChat({
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

  // Initialize UI state on component mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Auto-scroll logic
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Stale transcript bug fix
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
        {/* The CSS background container */}
        <div className="w-3/5 h-full relative">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            // style={{ backgroundImage: `url(${avatar.bgImageUrl})` }} // Uncomment if you have a background image
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
          {/* Header Section */}
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

          {/* Message List */}
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="flex-grow overflow-y-auto p-6 custom-scrollbar"
            aria-live="polite"
          >
            {isDevelopment &&
              messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  avatarCharacterName={avatar.character}
                />
              ))}
            {isDevelopment && status === "submitted" && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </motion.div>

          {/* Error Display
          {isDevelopment && error && (
            <div className="px-6 pb-2 text-red-500 text-sm">
              <strong>Error:</strong> {error.message}
            </div>
          )} */}

          {/* Chat Input Area */}
          <div className="p-6 pt-2">
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
      </div>
    </main>
  );
}
