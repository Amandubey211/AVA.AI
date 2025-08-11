// components/AvatarCanvas.tsx
"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  OrbitControls,
  Environment,
  PerspectiveCameraProps,
  PerspectiveCamera,
} from "@react-three/drei";
import { Group, SkinnedMesh, MathUtils } from "three";

// Model component remains unchanged
function Model({
  modelUrl,
  isSpeaking,
}: {
  modelUrl: string;
  isSpeaking: boolean;
}) {
  const { scene } = useGLTF(modelUrl);
  const modelRef = useRef<Group>(null!);
  useFrame((_state, delta) => {
    if (!modelRef.current) return;
    const mouthMesh =
      (modelRef.current.getObjectByName("mouth") as SkinnedMesh) ||
      (modelRef.current.getObjectByName("jaw") as SkinnedMesh);
    if (mouthMesh?.isSkinnedMesh && mouthMesh.morphTargetInfluences) {
      const targetInfluence = isSpeaking ? 1 : 0;
      const firstInfluence = mouthMesh.morphTargetInfluences[0];
      if (firstInfluence !== undefined) {
        mouthMesh.morphTargetInfluences[0] = MathUtils.lerp(
          firstInfluence,
          targetInfluence,
          delta * 15
        );
      }
    }
  });
  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={1.8}
      position={[0, -1.7, 0]}
    />
  );
}

interface AvatarCanvasProps {
  modelUrl: string;
  isSpeaking: boolean;
  camera?: Partial<PerspectiveCameraProps>;
}

export default function AvatarCanvas({
  modelUrl,
  isSpeaking,
  camera,
}: AvatarCanvasProps) {
  const cameraProps = camera || { position: [0, 0, 3], fov: 30 };

  return (
    // --- STEP 2: Remove the `camera` prop from the Canvas ---
    <Canvas className="w-full h-full">
      <PerspectiveCamera makeDefault {...cameraProps} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 5, 2]} intensity={1} />
      <Environment preset="city" />
      <Suspense fallback={null}>
        <Model modelUrl={modelUrl} isSpeaking={isSpeaking} />
      </Suspense>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.2}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}
