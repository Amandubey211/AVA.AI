"use client";

import { Send, Mic, MicOff, Loader2, StopCircle } from "lucide-react";
import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAvatarStore, ChatStatus } from "../store/avatarStore";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: (message: string) => void;
  status: ChatStatus;
  stop: () => void;
  toggleRecording: () => void;
  handleMuteToggle: () => void;
}

export default function ChatInput({
  input,
  setInput,
  onSend,
  status,
  stop,
  toggleRecording,
  handleMuteToggle,
}: ChatInputProps) {
  const { hasInitialized, initialize, isRecording, isMuted } = useAvatarStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const isLoading = status === "submitted";
  const isStreaming = status === "streaming";
  const isReady = status === "ready";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !isReady) return;
    onSend(input);
    setInput("");
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 128)}px`;
    }
  }, [input]);

  const handleInitialClick = () => {
    initialize();
    toggleRecording();
  };

  if (!hasInitialized) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <motion.button
          onClick={handleInitialClick}
          className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-600/50"
          aria-label="Start Listening"
          whileHover={{ scale: 1.1 }}
          animate={{
            scale: [1, 1.05, 1],
            transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Mic size={48} />
        </motion.button>
        <p className="mt-4 text-gray-400">
          Click the mic to start the conversation
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="relative w-full">
      <div className="absolute top-[-50px] w-full flex justify-between items-center">
        <button
          type="button"
          onClick={handleMuteToggle}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm flex items-center gap-2"
              style={{ color: isMuted ? "#9CA3AF" : "#F87171" }}
            >
              {!isMuted && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              )}
              {isMuted ? "Muted" : "Listening..."}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && isReady) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
          placeholder="Type or click the mic to speak..."
          className="w-full bg-gray-900/50 rounded-xl p-4 pr-14 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 overflow-y-auto custom-scrollbar"
          rows={1}
          disabled={!isReady && !isStreaming}
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <AnimatePresence>
            {isStreaming ? (
              <motion.button
                key="stop"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                type="button"
                onClick={stop}
                className="p-2 rounded-full bg-red-600 hover:bg-red-500 transition-colors"
                aria-label="Stop generating"
              >
                <StopCircle size={24} />
              </motion.button>
            ) : (
              <>
                {input.trim() ? (
                  <motion.button
                    key="send"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    type="submit"
                    className="p-2 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 disabled:bg-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      <Send size={24} />
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    key="record"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    type="button"
                    onClick={toggleRecording}
                    className={`p-2 rounded-full transition-colors ${
                      isRecording
                        ? isMuted
                          ? "bg-gray-600"
                          : "bg-red-600 hover:bg-red-500 animate-pulse"
                        : "bg-blue-600 hover:bg-blue-500"
                    }`}
                    aria-label={
                      isRecording ? "Stop recording" : "Start recording"
                    }
                  >
                    <Mic size={24} />
                  </motion.button>
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </form>
  );
}
