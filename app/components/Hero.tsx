// components/Hero.tsx
"use client";
import React, { Suspense } from "react";
import { JSX } from "react/jsx-runtime";

import { Canvas } from "@react-three/fiber";
import {
  useGLTF,
  Text,
  Html,
  Environment,
  Float,
  ContactShadows,
  Preload,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import { KernelSize } from "postprocessing"; // --- OPTIMIZATION: For tuning Bloom

// Reusable Model Component
function Model({
  url,
  ...props
}: { url: string } & JSX.IntrinsicElements["group"]) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} {...props} />;
}

// The Main 3D Scene (Optimized)
function HeroScene() {
  useGLTF.preload("/models/Alexa.glb");
  useGLTF.preload("/models/banker-lisa.glb");
  useGLTF.preload("/models/historian-david.glb");

  return (
    <>
      {/* Lighting Rig is generally okay, no major changes needed */}
      <Environment preset="night" />
      <ambientLight intensity={0.2} />
      <spotLight
        position={[0, 2, -15]}
        intensity={150}
        angle={0.5}
        penumbra={1}
        color="#8A2BE2"
      />
      <directionalLight position={[0, 10, 0]} intensity={0.3} color="white" />

      {/* RE-COMPOSED SCENE */}
      <group position={[0, 0, 0]}>
        <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
          <Model
            url="/models/banker-lisa.glb"
            position={[0, -2.4, 0]}
            rotation={[0, -0.2, 0]}
            scale={2.7}
          />
          <Model
            url="/models/Alexa.glb"
            position={[-2.2, -2.4, 0.5]}
            rotation={[0, 0.4, 0]}
            scale={2.7}
          />
          <Model
            url="/models/historian-david.glb"
            position={[2.2, -2.4, 0.5]}
            rotation={[0, -0.4, 0]}
            scale={2.7}
          />
        </Float>

        <ContactShadows
          position={[0, -2.45, 0]}
          opacity={0.7}
          scale={15}
          blur={2.5}
          far={2.5}
          frames={1}
        />
      </group>

      <group position={[0, 3, -8]}>
        <Text
          font="/fonts/Anton-Regular.ttf"
          fontSize={2}
          textAlign="center"
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          AI That Understands You
        </Text>
      </group>

      {/* HTML UI */}
      <Html fullscreen>
        <div className="flex flex-col items-center justify-end h-full pb-20 pointer-events-none">
          <motion.div
            className="text-center pointer-events-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <p className="max-w-xl mx-auto text-lg text-gray-300 mb-8">
              Your personal, judgment-free companion. Here to help you practice
              conversations, explore ideas, and achieve your goals.
            </p>
            <motion.button
              className="px-8 py-3 bg-white/10 border border-purple-400 text-white rounded-full font-bold text-lg backdrop-blur-sm hover:bg-white/20 transition-colors"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 35px rgba(138, 43, 226, 0.8)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Meet Your Assistant
            </motion.button>
          </motion.div>
        </div>
      </Html>

      {/* POST-PROCESSING */}
      <EffectComposer>
        <Bloom
          kernelSize={KernelSize.SMALL}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.025}
          intensity={1.2}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
}

// The Exported Hero Component
export default function Hero() {
  return (
    <section className="relative w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
        <Preload all />
      </Canvas>
      <div className="absolute inset-0 shadow-[inset_0_0_100px_50px_rgba(0,0,0,0.9)] pointer-events-none"></div>
    </section>
  );
}
