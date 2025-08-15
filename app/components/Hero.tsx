"use client";
import React, {
  Suspense,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Canvas } from "@react-three/fiber";
import { Text, Environment, Preload } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { Color } from "three";

import heroBackgroundImage from "@/public/images/ui/home/heroimage.png";

function VideoModal({
  isOpen,
  onClose,
  videoUrl,
}: {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}) {
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Manual Scroll Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Manual Focus Trap
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen || !modalContentRef.current) return;
      const focusableElements = modalContentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusableEl = focusableElements[0] as HTMLElement;
      const lastFocusableEl = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableEl) {
            lastFocusableEl?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableEl) {
            firstFocusableEl?.focus();
            e.preventDefault();
          }
        }
      }
    },
    [isOpen]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      modalContentRef.current?.focus();
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/90 modal-backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={modalContentRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-3xl bg-gray-900/80 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative pt-[56.25%]">
              {" "}
              {/* 16:9 aspect ratio */}
              <iframe
                src={videoUrl}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                title="AVA.AI Demo Video"
              />
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors z-10"
              aria-label="Close modal"
            >
              <svg
                xmlns="https://www.w3.org/2000/svg"
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

function HeroScene({ fontSize }: { fontSize: number }) {
  const textColor = new Color("#FFFFFF");
  const purpleColor = new Color("#8A2BE2");
  const pinkColor = new Color("#FF10F0");

  return (
    <>
      <Environment preset="night" />
      <spotLight
        position={[-5, 0, 5]}
        intensity={150}
        angle={Math.PI / 6}
        penumbra={0.5}
        color={purpleColor}
      />
      <spotLight
        position={[5, 0, 5]}
        intensity={150}
        angle={Math.PI / 6}
        penumbra={0.5}
        color={pinkColor}
      />
      <Text
        font="/fonts/Anton-Regular.ttf"
        fontSize={fontSize}
        position={[0, 0, 0]}
        textAlign="center"
        color={textColor}
        anchorX="center"
        anchorY="middle"
      >
        AI That Understands You
      </Text>
      <EffectComposer>
        <Bloom
          kernelSize={KernelSize.LARGE}
          luminanceThreshold={0}
          luminanceSmoothing={0.9}
          intensity={3.5}
          mipmapBlur={true}
        />
        <Vignette eskil={false} offset={0.1} darkness={1.5} />
      </EffectComposer>
    </>
  );
}

export default function Hero() {
  const router = useRouter();
  const [fontSize, setFontSize] = useState(3.5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoId = "40UcgTHhIWY";
  const demoVideoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&mute=1&showinfo=0&rel=0`;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setFontSize(1.8);
      else if (width < 768) setFontSize(2.2);
      else if (width < 1024) setFontSize(2.8);
      else setFontSize(3.5);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="relative w-full h-screen bg-black flex flex-col items-center justify-end overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        className="absolute inset-0 z-10 mt-14"
      >
        <Suspense fallback={null}>
          <HeroScene fontSize={fontSize} />
        </Suspense>
        <Preload all />
      </Canvas>

      <Image
        src={heroBackgroundImage}
        alt="Background character models"
        layout="fill"
        objectFit="cover"
        quality={90}
        className="absolute z-20"
        priority
      />

      <div className="absolute inset-0 bg-black/50 z-30 pointer-events-none modal-backdrop-blur"></div>

      <div className="relative z-50 flex flex-col items-center text-center p-4 pb-16">
        <motion.p
          className="text-white text-sm sm:text-base tracking-widest uppercase mb-4 opacity-70"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          YOUR AI COMPANION
        </motion.p>
        <motion.p
          className="max-w-xl mx-auto text-base sm:text-lg text-gray-300 mb-10 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Your personal, judgment-free companion. Here to help you practice
          conversations, explore ideas, and achieve your goals.
        </motion.p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <motion.button
            className="px-6 sm:px-10 py-3 sm:py-4 bg-transparent border border-white/20 text-white rounded-full font-bold text-base sm:text-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/40"
            style={{ boxShadow: "0 0 15px rgba(255, 255, 255, 0.1)" }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 25px rgba(255, 255, 255, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/chat/alex-english-tutor")}
          >
            Meet Your Assistant
          </motion.button>

          <motion.button
            className="px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-bold text-base sm:text-lg transition-all duration-300 hover:from-purple-500 hover:to-pink-400"
            style={{ boxShadow: "0 0 15px rgba(139, 92, 246, 0.5)" }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 25px rgba(236, 72, 153, 0.6)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
          >
            View Demo
          </motion.button>
        </div>
      </div>

      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoUrl={demoVideoUrl}
      />
    </section>
  );
}
