"use client";
import React, { Suspense } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// React Three Fiber Imports
import { Canvas } from "@react-three/fiber";
import { Text, Environment, Preload } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing"; // Needed for Bloom's kernelSize
import { Color } from "three"; // Import Color for light

// Import the background image. Ensure the path is correct for your project.
import heroBackgroundImage from "@/public/images/ui/home/heroimage.png";

// Component for the 3D scene (Text and Post-processing effects)
function HeroScene() {
  // Define the vibrant purple color for the light
  const purpleLightColor = new Color("#8A2BE2"); // BlueViolet

  return (
    <>
      {/* Environment for basic global lighting/mood */}
      <Environment preset="night" />

      {/* SpotLight to illuminate the text and create the purple glow */}
      <spotLight
        position={[0, 0, 5]} // Positioned slightly in front of the text to hit it
        intensity={200} // Increased intensity for a stronger light
        angle={Math.PI / 8} // Narrower cone for more focused light
        penumbra={1} // Soft edges for the light cone
        color={purpleLightColor} // The purple color for the glow
        castShadow // Enable shadows if other objects are added later
      />

      {/* 3D Text: "AI That Understands You" */}
      <Text
        font="/fonts/Anton-Regular.ttf" // Ensure this font path is correct in your public/fonts directory
        fontSize={3.5} // Adjusted font size to fit well on screen
        position={[0, 0, 0]} // Keep text at Z=0 for easy light targeting
        textAlign="center"
        color="white" // Text itself is white, bloom makes it purple
        anchorX="center"
        anchorY="middle"
      >
        AI That Understands You
      </Text>

      {/* Post-processing Effects for the strong bloom */}
      <EffectComposer>
        <Bloom
          kernelSize={KernelSize.LARGE} // Adjust KernelSize (SMALL, MEDIUM, LARGE, VERY_LARGE)
          luminanceThreshold={0.001} // Very low threshold to make almost everything bloom
          luminanceSmoothing={0.7} // Higher smoothing for a more uniform, diffused bloom
          intensity={3.0} // High intensity for a super strong glow
          mipmapBlur={true} // Smoother bloom effect
        />
        <Vignette eskil={false} offset={0.1} darkness={1.8} />
      </EffectComposer>
    </>
  );
}

export default function Hero() {
  return (
    <section className="relative w-full h-screen bg-black flex flex-col items-center justify-end overflow-hidden">
      {/* 1. React Three Fiber Canvas (for 3D text and bloom) - positioned at z-10 (lowest layer) */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }} // Camera setup for responsiveness and framing
        dpr={[1, 1.5]}
        className="absolute inset-0 z-10 mt-14" // Crucial: R3F Canvas is the bottom-most layer (excluding pure black bg)
      >
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
        <Preload all />
      </Canvas>

      {/* 2. Background Image (Character models) - positioned at z-20, ABOVE the R3F Canvas */}
      <Image
        src={heroBackgroundImage}
        alt="Background character models"
        layout="fill"
        objectFit="cover"
        quality={90}
        className="absolute z-20" // Characters sit in front of the 3D text
        priority
      />

      {/* 3. Dark Overlay (to make the background darker and text pop) - positioned at z-30, above the image */}
      <div className="absolute inset-0 bg-black/50 z-30 pointer-events-none"></div>

      {/* 4. Scattered White Dots (Stars) - positioned at z-40, above the dark overlay */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 15% 25%, rgba(255,255,255,0.4) 1px, transparent 1px),
              radial-gradient(circle at 85% 70%, rgba(255,255,255,0.3) 1px, transparent 1px),
              radial-gradient(circle at 40% 55%, rgba(255,255,255,0.5) 1px, transparent 1px),
              radial-gradient(circle at 60% 10%, rgba(255,255,255,0.2) 1px, transparent 1px),
              radial-gradient(circle at 25% 90%, rgba(255,255,255,0.4) 1px, transparent 1px),
              radial-gradient(circle at 75% 30%, rgba(255,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "200px 200px",
            opacity: 0.8,
          }}
        />
      </div>

      {/* 5. Main Content Container (Foreground HTML: "YOUR AI COMPANION" text, Paragraph, and Button) */}
      {/* Positioned at z-50, ensuring it's on top of ALL background elements */}
      <div className="relative z-50 flex flex-col items-center text-center p-4 pb-16">
        {" "}
        {/* Adjusted padding for lower placement */}
        {/* "YOUR AI COMPANION" text at the top (corresponds to "AVATARS THAT GO") */}
        <motion.p
          className="text-white text-sm sm:text-base tracking-widest uppercase mb-4 opacity-70"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          YOUR AI COMPANION
        </motion.p>
        {/* Paragraph: "Your personal, judgment-free companion..." */}
        <motion.p
          className="max-w-xl mx-auto text-base sm:text-lg text-gray-300 mb-10 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Your personal, judgment-free companion. Here to help you practice
          conversations, explore ideas, and achieve your goals.
        </motion.p>
        {/* Call to Action Button: "Meet Your Assistant" */}
        <motion.button
          className="px-10 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold text-lg backdrop-blur-sm transition-all duration-300"
          style={{
            boxShadow: "0 0 15px rgba(255, 255, 255, 0.1)",
          }}
          whileHover={{
            scale: 1.05,
            borderColor: "rgba(255, 255, 255, 0.4)",
            boxShadow: "0 0 25px rgba(255, 255, 255, 0.2)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          Meet Your Assistant
        </motion.button>
      </div>
    </section>
  );
}
