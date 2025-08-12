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
}

export default function ChatInput({
  input,
  setInput,
  onSend,
  status,
  stop,
  toggleRecording,
}: ChatInputProps) {
  const { isRecording, isMuted, toggleMute } = useAvatarStore();
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
      textareaRef.current.style.height = `${Math.min(scrollHeight, 128)}px`; // Max height of 128px
    }
  }, [input]);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="relative w-full">
      <div className="absolute top-[-50px] w-full flex justify-between items-center">
        <button
          type="button"
          onClick={toggleMute}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-sm text-red-400 flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Listening...
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
                    className="p-2 rounded-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 transition-colors"
                    disabled={isLoading || !input.trim()}
                    aria-label={isLoading ? "Sending message" : "Send message"}
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
                        ? "bg-red-600 hover:bg-red-500"
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
