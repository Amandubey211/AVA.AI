// components/VideoModal.tsx
"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAvatarStore } from "../store/avatarStore";

export default function VideoModal() {
  // --- Get state and actions from the global store ---
  const { isModalOpen, modalVideoUrl, closeModal } = useAvatarStore();
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Manual Scroll Lock
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Manual Focus Trap and Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
      if (e.key === "Tab" && modalContentRef.current) {
        const focusableElements = modalContentRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstEl = focusableElements[0] as HTMLElement;
        const lastEl = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;
        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            lastEl?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastEl) {
            firstEl?.focus();
            e.preventDefault();
          }
        }
      }
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      setTimeout(() => modalContentRef.current?.focus(), 100); // Focus after animation
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, closeModal]);

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8  bg-black/90 modal-backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.div
            ref={modalContentRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-4xl bg-gray-900/80 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative pt-[56.25%]">
              <iframe
                src={modalVideoUrl} // Use the URL from the store
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                title="AVA.AI Demo Video"
              />
            </div>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors z-10"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="p-4 bg-gray-900/80 border-t border-white/10 text-center text-sm text-gray-300">
              Your AI Companion Demo
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
