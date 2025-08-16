// app/playground/page.tsx
"use client";

// import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Leva } from "leva"; // A simple GUI for testing
// import AvatarController from "../components/AvatarController";

export default function PlaygroundPage() {
  return (
    <main className="w-screen h-screen bg-gray-800">
      {/* Leva provides a simple GUI to control our animation states for testing */}
      <Leva collapsed />

      <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
        {/* <Suspense fallback={null}> */}
        <Environment preset="sunset" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 5, 5]} intensity={1} />

        {/* <AvatarController
          modelUrl="/models/Teacher_Nanami.glb"
          animationUrl="/models/animations_Nanami.glb"
        /> */}
        {/* </Suspense> */}
        <OrbitControls />
      </Canvas>
    </main>
  );
}
