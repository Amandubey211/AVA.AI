// components/DemoControls.tsx
"use client";

import { motion } from "framer-motion";
import { MessageSquare, Video, Coffee } from "lucide-react";
import { DemoInteraction } from "../lib/demo-data";

interface DemoControlsProps {
  script: DemoInteraction[];
  onSelect: (interaction: DemoInteraction) => void;
  onWatchDemo: () => void;
  onSupport: () => void;
}

export default function DemoControls({
  script,
  onSelect,
  onWatchDemo,
  onSupport,
}: DemoControlsProps) {
  return (
    <div className="p-3 md:p-6 pt-2 flex flex-col gap-4">
      {/* --- Predefined Questions Section --- */}
      <div>
        <p className="text-center text-sm text-gray-400 mb-2">
          Select a question to see a pre-recorded response:
        </p>
        <div className="flex flex-col gap-2">
          {script.map((interaction, index) => (
            <motion.button
              key={interaction.id}
              className="w-full text-left p-4 bg-gray-900/50 rounded-lg border border-white/10 hover:bg-purple-600/30 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              onClick={() => onSelect(interaction)}
            >
              <div className="flex items-center gap-3">
                <MessageSquare
                  size={18}
                  className="text-purple-400 flex-shrink-0"
                />
                <span className="font-semibold text-sm">
                  {interaction.title}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* --- Call-to-Action Section --- */}
      <div className="pt-2 border-t border-white/10">
        <p className="text-center text-sm text-gray-400 mb-3">
          The live AI is offline to manage API costs. See the full experience
          below!
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onWatchDemo}
            className="flex-1 flex items-center justify-center gap-2 w-full py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition-colors"
          >
            <Video size={18} />
            Watch Full Demo
          </button>
          <button
            onClick={onSupport}
            className="flex-1 flex items-center justify-center gap-2 w-full py-2 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors"
          >
            <Coffee size={18} />
            Support Project
          </button>
        </div>
      </div>
    </div>
  );
}
