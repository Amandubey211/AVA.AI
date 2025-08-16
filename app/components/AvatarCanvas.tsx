// components/AvatarCanvas.tsx
"use client";

import React, { Suspense, useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  OrbitControls,
  Environment,
  PerspectiveCamera,
  useAnimations,
  Html,
} from "@react-three/drei";
import type { PerspectiveCameraProps } from "@react-three/drei";
import {
  Group,
  SkinnedMesh,
  MathUtils,
  AnimationMixer,
  LoopRepeat,
} from "three";
import { useAvatarStore } from "../store/avatarStore";
import { ExpressionMapping } from "../lib/avatars";

const ANIMATION_MAP = {
  Idle: "Idle",
  Thinking: "Thinking",
  Talking: "Talking",
};

function Model({
  modelUrl,
  expressions,
  idleAnimationUrl,
}: {
  modelUrl: string;
  expressions: ExpressionMapping;
  idleAnimationUrl: string;
}) {
  const { scene } = useGLTF(modelUrl);
  const { animations } = useGLTF(idleAnimationUrl);

  const modelRef = useRef<Group>(null!);
  const { isSpeaking, currentEmotion, chatStatus, isAudioPlaying, blink } =
    useAvatarStore();
  const [animation, setAnimation] = useState("Idle");
  const [thinkingText, setThinkingText] = useState(".");

  const mixer = useMemo(() => new AnimationMixer(scene), [scene]);
  const { actions } = useAnimations(animations, modelRef);

  // Animation State Machine
  useEffect(() => {
    if (chatStatus === "submitted") {
      setAnimation(ANIMATION_MAP.Thinking);
    } else if (isAudioPlaying) {
      setAnimation(ANIMATION_MAP.Talking);
    } else {
      setAnimation(ANIMATION_MAP.Idle);
    }
  }, [chatStatus, isAudioPlaying]);

  useEffect(() => {
    Object.values(actions).forEach((action) => action?.fadeOut(0.5));
    const currentAction = actions[animation];
    if (currentAction) {
      currentAction.reset().fadeIn(0.5).setLoop(LoopRepeat, Infinity).play();
    }
  }, [animation, actions]);

  // "Thinking..." text animation for the indicator
  useEffect(() => {
    if (chatStatus === "submitted") {
      const interval = setInterval(() => {
        setThinkingText((text) => (text.length >= 3 ? "." : text + "."));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [chatStatus]);

  useFrame((_state, delta) => {
    mixer.update(delta);
    if (!modelRef.current) return;

    // A robust function to animate any morph target, inspired by the reference
    const lerpMorphTarget = (
      targetName: string,
      value: number,
      speed = 0.1
    ) => {
      scene.traverse((child) => {
        if (
          (child as SkinnedMesh).isSkinnedMesh &&
          (child as SkinnedMesh).morphTargetDictionary
        ) {
          const mesh = child as SkinnedMesh;
          const index = mesh.morphTargetDictionary?.[targetName];
          if (index !== undefined && mesh.morphTargetInfluences) {
            mesh.morphTargetInfluences[index] = MathUtils.lerp(
              mesh.morphTargetInfluences[index],
              value,
              speed
            );
          }
        }
      });
    };

    // First, reset all expression morph targets to 0
    Object.values(expressions).forEach((expr) => {
      expr.morphTargets.forEach((targetName) =>
        lerpMorphTarget(targetName, 0, delta * 10)
      );
    });

    // Then, apply the current emotion
    if (currentEmotion && expressions[currentEmotion]) {
      const { morphTargets, intensity } = expressions[currentEmotion];
      morphTargets.forEach((targetName) =>
        lerpMorphTarget(targetName, intensity, delta * 7)
      );
    }

    // --- THE DEFINITIVE BLINKING FIX ---
    // Apply blinking using the correct morph target name from the reference.
    lerpMorphTarget("eye_close", blink ? 1 : 0, delta * 20);

    // Apply lip-sync on top of everything else
    lerpMorphTarget("jawOpen", isSpeaking ? 1 : 0, delta * 20);
  });

  return (
    <group ref={modelRef}>
      {chatStatus === "submitted" && (
        <Html position-y={1.8}>
          <div className="flex justify-center items-center -translate-x-1/2 mt-24">
            <span className="relative flex h-8 w-8 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex items-center justify-center duration-75 rounded-full h-8 w-8 bg-white/80 text-gray-800 font-mono">
                {thinkingText}
              </span>
            </span>
          </div>
        </Html>
      )}
      <primitive object={scene} scale={1.8} position={[0, -1.7, 0]} />
    </group>
  );
}

// ... (Rest of AvatarCanvas component is unchanged)
interface AvatarCanvasProps {
  modelUrl: string;
  expressions: ExpressionMapping;
  idleAnimationUrl: string;
  camera?: Partial<PerspectiveCameraProps>;
}
export default function AvatarCanvas({
  modelUrl,
  expressions,
  idleAnimationUrl,
  camera,
}: AvatarCanvasProps) {
  const cameraProps = camera || { position: [0, 0, 3], fov: 30 };
  return (
    <Canvas gl={{ alpha: true }} className="w-full h-full">
      <PerspectiveCamera makeDefault {...cameraProps} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 5, 2]} intensity={1} />
      <Environment preset="sunset" />
      <Suspense fallback={null}>
        <Model
          modelUrl={modelUrl}
          expressions={expressions}
          idleAnimationUrl={idleAnimationUrl}
        />
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
