// "use client";

// import { useEffect, useState, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { useAvatarStore } from "../store/avatarStore";
// import { AvatarConfig } from "../lib/avatars";
// import AvatarCanvas from "./AvatarCanvas";
// import ChatMessage from "./ChatMessage";
// import ChatInput from "./ChatInput";
// import { motion } from "framer-motion";
// import { useAvatarChat } from "../api/hooks/useAvatarChat";
// import { ArrowLeft } from "lucide-react";

// export default function ChatExperience({ avatar }: { avatar: AvatarConfig }) {
//   const router = useRouter();
//   const { isRecording, setIsRecording } = useAvatarStore();
//   const [recognition, setRecognition] = useState<SpeechRecognition | null>(
//     null
//   );
//   const [input, setInput] = useState("");
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   const { messages, status, error, stop, sendMessage } = useAvatarChat({
//     systemPrompt: avatar.systemPrompt,
//   });

//   // Initialize Speech Recognition
//   useEffect(() => {
//     const SpeechRecognitionAPI =
//       window.SpeechRecognition || (window as any).webkitSpeechRecognition;
//     if (!SpeechRecognitionAPI) {
//       console.warn("SpeechRecognition API not supported.");
//       return;
//     }
//     const recog = new SpeechRecognitionAPI();
//     recog.continuous = true;
//     recog.interimResults = true;
//     recog.lang = "en-US";

//     recog.onresult = (event) => {
//       const transcript = Array.from(event.results)
//         .map((result) => result[0].transcript)
//         .join("");
//       setInput(transcript);
//     };

//     recog.onerror = (event: any) => {
//       console.error("Speech recognition error:", event.error);
//       setIsRecording(false);
//     };

//     recog.onend = () => setIsRecording(false);
//     setRecognition(recog);
//   }, [setIsRecording]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const createUserMessage = (text: string) => ({
//     id: `user-msg-${Date.now()}`,
//     role: "user",
//     parts: [{ type: "text", text }],
//   });

//   const handleSend = (message: string) => {
//     if (!message.trim() || !avatar) return;
//     sendMessage(createUserMessage(message));
//     setInput("");
//   };

//   const toggleRecording = () => {
//     if (isRecording) {
//       recognition?.stop();
//     } else {
//       setInput("");
//       recognition?.start();
//     }
//     setIsRecording(!isRecording);
//   };

//   const listVariants = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: { staggerChildren: 0.15 },
//     },
//   };

//   return (
//     <main className="relative w-screen h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
//       <div className="absolute top-6 left-6 z-20">
//         <button
//           onClick={() => router.push("/")}
//           className="flex items-center gap-2 px-4 py-2 bg-black/50 text-white font-semibold rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
//           aria-label="Back to Gallery"
//         >
//           <ArrowLeft size={20} />
//           <span>Back to Gallery</span>
//         </button>
//       </div>

//       <div className="flex flex-1 overflow-hidden">
//         <div className="w-3/5 h-full relative">
//           <AvatarCanvas
//             modelUrl={avatar.modelUrl}
//             isSpeaking={useAvatarStore((s) => s.isSpeaking)}
//             camera={{ position: [0, 0, 2.2], fov: 75 }}
//           />
//         </div>

//         <div className="w-2/5 h-full p-6 flex flex-col bg-black/30 backdrop-blur-lg border-l-2 border-white/10">
//           <div className="mb-6 text-center">
//             <h2 className="text-4xl font-bold tracking-tight">{`Chat with ${avatar.character}`}</h2>
//             <p className="text-gray-400 mt-1">{avatar.shortDescription}</p>
//           </div>

//           <motion.div
//             variants={listVariants}
//             initial="hidden"
//             animate="show"
//             className="flex-grow overflow-y-auto pr-4 -mr-4 mb-4 custom-scrollbar"
//             aria-live="polite"
//           >
//             {messages.map((msg) => (
//               <ChatMessage key={msg.id} message={msg} />
//             ))}
//             {status === "submitted" && (
//               <ChatMessage
//                 message={{
//                   id: "thinking",
//                   role: "assistant",
//                   parts: [{ type: "text", text: "Thinking..." }],
//                 }}
//               />
//             )}
//             <div ref={messagesEndRef} />
//           </motion.div>

//           {error && (
//             <div className="text-red-500 text-sm mb-4 p-3 bg-red-500/10 rounded-lg">
//               <strong>Error:</strong> {error.message}
//             </div>
//           )}

//           <ChatInput
//             input={input}
//             setInput={setInput}
//             onSend={handleSend}
//             status={status}
//             stop={stop}
//             toggleRecording={toggleRecording}
//           />
//         </div>
//       </div>
//     </main>
//   );
// }
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

export default function ChatExperience({ avatar }: { avatar: AvatarConfig }) {
  const router = useRouter();
  // We only need these state values now, the hook handles the rest.
  const { isRecording, setIsRecording } = useAvatarStore();
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // The custom hook now handles all complex logic, including TTS.
  const { messages, status, error, stop, sendMessage } = useAvatarChat({
    systemPrompt: avatar.systemPrompt,
  });

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.warn("SpeechRecognition API not supported.");
      return;
    }
    const recog = new SpeechRecognitionAPI();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = "en-US";
    recog.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setInput(transcript);
    };
    recog.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };
    recog.onend = () => setIsRecording(false);
    setRecognition(recog);
  }, [setIsRecording]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- THE CORRECTED `handleSend` FUNCTION ---
  const handleSend = (messageText: string) => {
    if (!messageText.trim() || !avatar) return;

    // The `sendMessage` function from our hook expects a UIMessage object.
    // We no longer need the createUserMessage helper.
    const createUserMessage = (text: string) => ({
      id: `user-msg-${Date.now()}`,
      role: "user",
      parts: [{ type: "text", text }],
    });
    sendMessage(createUserMessage(messageText));

    setInput(""); // Clear the input after sending
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
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
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
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {status === "submitted" && (
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
          {error && (
            <div className="text-red-500 text-sm mb-4 p-3 bg-red-500/10 rounded-lg">
              <strong>Error:</strong> {error.message}
            </div>
          )}
          <ChatInput
            input={input}
            setInput={setInput}
            onSend={handleSend}
            status={status}
            stop={stop}
            toggleRecording={toggleRecording}
          />
        </div>
      </div>
    </main>
  );
}
