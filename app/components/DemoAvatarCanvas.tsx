// components/DemoAvatarCanvas.tsx
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
  //   MeshStandardMaterial,
} from "three";
import { useDemoStore } from "../store/demoStore"; // --- Uses the new demo store ---
import { ExpressionMapping } from "../lib/avatars";

// // Viseme mapping for lip-sync
// const VISEME_MAP: { [key: number]: string } = {
//   0: "viseme_sil",
//   1: "viseme_aa",
//   2: "viseme_ih",
//   3: "viseme_ou",
//   4: "viseme_E",
//   5: "viseme_uh",
//   6: "viseme_oh",
//   7: "viseme_FF",
//   8: "viseme_DD",
//   9: "viseme_kk",
//   10: "viseme_nn",
//   11: "viseme_RR",
//   12: "viseme_SS",
//   13: "viseme_CH",
//   14: "viseme_TH",
//   15: "viseme_pp",
//   16: "viseme_I",
//   17: "viseme_A",
//   18: "viseme_O",
//   19: "viseme_U",
//   20: "viseme_e",
//   21: "viseme_i",
// };

// Animation names must match the names inside your animation file
const ANIMATION_MAP = {
  Idle: "Idle",
  Talking: "Talking",
  Thinking: "Thinking",
  Talking2: "Talking2",
};

function Model({
  thinking, // This prop is for the "..." indicator
  modelUrl,
  expressions,
  idleAnimationUrl,
}: {
  thinking: boolean;
  modelUrl: string;
  expressions: ExpressionMapping;
  idleAnimationUrl: string;
}) {
  const { scene } = useGLTF(modelUrl);
  const { animations } = useGLTF(idleAnimationUrl);
  const modelRef = useRef<Group>(null!);

  const { isSpeaking, currentEmotion, currentVisemes, currentAudio, blink } =
    useDemoStore();
  const [animation, setAnimation] = useState(ANIMATION_MAP.Idle);
  const lastTalkAnimation = useRef<keyof typeof ANIMATION_MAP | null>(null);

  const mixer = useMemo(() => new AnimationMixer(scene), [scene]);
  const { actions } = useAnimations(animations, modelRef);

  useEffect(() => {
    if (thinking) {
      setAnimation(ANIMATION_MAP.Thinking);
    } else if (isSpeaking) {
      // --- THE TYPE-SAFE FIX ---
      // We explicitly define the type of the array from the start.
      const talkingAnimations: (keyof typeof ANIMATION_MAP)[] = [
        "Talking",
        "Talking2",
      ];

      const validTalkingAnims = talkingAnimations.filter(
        (anim) => actions[anim]
      );
      const availableAnimations = validTalkingAnims.filter(
        (anim) => anim !== lastTalkAnimation.current
      );
      const nextAnimation =
        availableAnimations.length > 0
          ? availableAnimations[
              Math.floor(Math.random() * availableAnimations.length)
            ]
          : validTalkingAnims[0]; // Fallback to the first valid one

      if (nextAnimation) {
        setAnimation(nextAnimation);
        lastTalkAnimation.current = nextAnimation;
      }
    } else {
      setAnimation(ANIMATION_MAP.Idle);
      lastTalkAnimation.current = null;
    }
  }, [isSpeaking, thinking, actions]);

  // Effect to play the chosen animation
  useEffect(() => {
    Object.values(actions).forEach((action) => action?.fadeOut(0.5));
    const currentAction = actions[animation];
    if (currentAction) {
      currentAction.reset().fadeIn(0.5).setLoop(LoopRepeat, Infinity).play();
    }
  }, [animation, actions]);

  const lerpMorphTarget = (
    target: string | number,
    value: number,
    speed = 0.1
  ) => {
    scene.traverse((child) => {
      if (
        (child as SkinnedMesh).isSkinnedMesh &&
        (child as SkinnedMesh).morphTargetDictionary
      ) {
        const mesh = child as SkinnedMesh;
        const index =
          typeof target === "string"
            ? (
                mesh.morphTargetDictionary as Record<string, number | undefined>
              )[target]
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

    // Reset all visemes and expressions
    for (let i = 0; i <= 21; i++) {
      lerpMorphTarget(i, 0, 0.1);
    }
    Object.values(expressions).forEach((e) =>
      e.morphTargets.forEach((name) => lerpMorphTarget(name, 0, 0.1))
    );
    lerpMorphTarget("mouthSmile", 0.2, 0.5);

    // Apply blinking
    lerpMorphTarget("eye_close", blink ? 1 : 0, 0.5);

    // Apply viseme-based lip-sync
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

    // Apply emotional expressions
    if (currentEmotion && expressions[currentEmotion]) {
      const { morphTargets, intensity } = expressions[currentEmotion];
      morphTargets.forEach((targetName) =>
        lerpMorphTarget(targetName, intensity, delta * 7)
      );
    }
  });

  return (
    <>
      {thinking && (
        <Html position-y={1.8}>
          <div className="flex justify-center items-center -translate-x-1/2 mt-24">
            <span className="relative flex h-8 w-8 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex items-center justify-center duration-75 rounded-full h-8 w-8 bg-white/80 text-gray-800 font-mono">
                ...
              </span>
            </span>
          </div>
        </Html>
      )}
      <primitive
        ref={modelRef}
        object={scene}
        scale={1.8}
        position={[0, -1.7, 0]}
      />
    </>
  );
}

interface DemoAvatarCanvasProps {
  thinking: boolean;
  modelUrl: string;
  expressions: ExpressionMapping;
  idleAnimationUrl: string;
  camera?: Partial<PerspectiveCameraProps>;
}

export default function DemoAvatarCanvas({
  thinking,
  modelUrl,
  expressions,
  idleAnimationUrl,
  camera,
}: DemoAvatarCanvasProps) {
  const cameraProps = camera || { position: [0, 0, 3], fov: 30 };
  return (
    <Canvas gl={{ alpha: true }} className="w-full h-full">
      <PerspectiveCamera makeDefault {...cameraProps} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 5, 2]} intensity={1} />
      <Environment preset="sunset" />
      <Suspense fallback={null}>
        <Model
          thinking={thinking}
          modelUrl={modelUrl}
          expressions={expressions}
          idleAnimationUrl={idleAnimationUrl}
        />
      </Suspense>
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.08}
        rotateSpeed={0.7}
        zoomSpeed={0.5}
        minPolarAngle={Math.PI / 2.2}
        maxPolarAngle={Math.PI / 2}
        minDistance={2}
        maxDistance={4}
      />
    </Canvas>
  );
}
