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
  MeshStandardMaterial,
} from "three";
import { useAvatarStore } from "../store/avatarStore";
import { ExpressionMapping } from "../lib/avatars";

const ANIMATION_MAP = {
  Idle: "Idle",
  Thinking: "Thinking",
  Talking: "Talking",
  Talking2: "Talking2",
};

function Model({
  modelUrl,

  idleAnimationUrl,
}: {
  modelUrl: string;
  expressions: ExpressionMapping;
  idleAnimationUrl: string;
}) {
  const { scene } = useGLTF(modelUrl);
  const { animations } = useGLTF(idleAnimationUrl);

  const modelRef = useRef<Group>(null!);

  // Get ALL state, including visemes and the current audio player
  const {
    // isSpeaking,
    // currentEmotion,
    chatStatus,
    isAudioPlaying,
    blink,
    currentVisemes,
    currentAudio,
  } = useAvatarStore();
  const [animation, setAnimation] = useState("Idle");
  const [thinkingText, setThinkingText] = useState(".");

  const mixer = useMemo(() => new AnimationMixer(scene), [scene]);
  const { actions } = useAnimations(animations, modelRef);

  // Re-apply materials to prevent transparency issues, as seen in the reference
  useEffect(() => {
    scene.traverse((child) => {
      if (
        (child as SkinnedMesh).isSkinnedMesh &&
        (child as SkinnedMesh).material
      ) {
        (child as SkinnedMesh).material = new MeshStandardMaterial({
          map: ((child as SkinnedMesh).material as MeshStandardMaterial).map,
        });
      }
    });
  }, [scene]);

  useEffect(() => {
    if (chatStatus === "submitted") {
      setAnimation(ANIMATION_MAP.Thinking);
    } else if (isAudioPlaying) {
      const availableAnims = [
        ANIMATION_MAP.Talking,
        ANIMATION_MAP.Talking2,
      ].filter((a) => actions[a]);
      setAnimation(
        availableAnims[Math.floor(Math.random() * availableAnims.length)] ||
          "Talking"
      );
    } else {
      setAnimation(ANIMATION_MAP.Idle);
    }
  }, [chatStatus, isAudioPlaying, actions]);

  useEffect(() => {
    Object.values(actions).forEach((action) => action?.fadeOut(0.5));
    const currentAction = actions[animation];
    if (currentAction) {
      currentAction.reset().fadeIn(0.5).setLoop(LoopRepeat, Infinity).play();
    }
  }, [animation, actions]);

  useEffect(() => {
    if (chatStatus === "submitted") {
      const interval = setInterval(() => {
        setThinkingText((text) => (text.length >= 3 ? "." : text + "."));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [chatStatus]);

  // --- THE DEFINITIVE ANIMATION LOOP ---
  const lerpMorphTarget = (
    target: string | number,
    value: number,
    speed = 0.1
  ) => {
    scene.traverse((child) => {
      const mesh = child as SkinnedMesh;
      if (mesh.isSkinnedMesh && mesh.morphTargetDictionary != null) {
        const index =
          typeof target === "string"
            ? mesh.morphTargetDictionary![target]
            : target;
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

  useFrame((_state, delta) => {
    mixer.update(delta);
    lerpMorphTarget("mouthSmile", 0.2, 0.5);
    // Blinking (driven by global store)
    lerpMorphTarget("eye_close", blink ? 1 : 0, 0.5);

    // --- Reset all viseme morph targets (as per reference) ---
    for (let i = 0; i <= 21; i++) {
      lerpMorphTarget(i, 0, 0.1);
    }

    // --- High-fidelity lip-sync using viseme data (as per reference) ---
    if (currentAudio && currentVisemes.length > 0) {
      const currentTimeMs = currentAudio.currentTime * 1000;
      let currentVisemeId = 0;
      for (const [time, visemeId] of currentVisemes) {
        if (currentTimeMs >= time) {
          currentVisemeId = visemeId;
        } else {
          break;
        }
      }
      lerpMorphTarget(currentVisemeId, 1, 0.2);
    }
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
