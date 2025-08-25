// components/Hero.tsx
"use client";

import React, { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

// React Three Fiber Imports
import { Canvas } from "@react-three/fiber";
import { Text, Environment, Preload } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { Color } from "three";

import heroBackgroundImage from "@/public/images/ui/home/heroimage.png";
import { useAvatarStore } from "../store/avatarStore";

// The 3D scene component for the text and lighting. This is self-contained and correct.
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

// The main Hero component
export default function Hero() {
  const router = useRouter();
  const [fontSize, setFontSize] = useState(3.5);

  // --- Get the `openModal` action from our global Zustand store ---
  const openModal = useAvatarStore((state) => state.openModal);

  // The state for the modal (`isModalOpen`) is now REMOVED from this component.

  const videoId = "bUw9OxeBJhI";
  const demoVideoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&mute=1&showinfo=0&rel=0`;

  // Effect for responsive font size
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

  // Note: The Escape key handler for the modal now lives inside the VideoModal component itself.

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

      <div className="absolute inset-0  z-30 pointer-events-none modal-backdrop-blur"></div>

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
            // The onClick handler now calls the global action from the store
            onClick={() => openModal(demoVideoUrl)}
          >
            View Demo
          </motion.button>
        </div>
      </div>
      {/* The VideoModal component is no longer rendered here. It lives in the root layout. */}
    </section>
  );
}
