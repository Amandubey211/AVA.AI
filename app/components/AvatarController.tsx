// "use client";

// import { useGLTF, useAnimations } from "@react-three/drei";
// import { useFrame } from "@react-three/fiber";
// import { useControls } from "leva";
// import { useEffect, useMemo, useRef, useState } from "react";
// import {
//   AnimationMixer,
//   Group,
//   LoopRepeat,
//   SkinnedMesh,
//   MathUtils,
//   MeshStandardMaterial,
// } from "three";
// import { randInt } from "three/src/math/MathUtils.js";

// const ANIMATION_MAP = {
//   Idle: "Idle",
//   Thinking: "Thinking",
//   Talking: "Talking",
// };

// interface AvatarControllerProps {
//   modelUrl: string;
//   animationUrl: string;
// }

// export default function AvatarController({
//   modelUrl,
//   animationUrl,
// }: AvatarControllerProps) {
//   const modelRef = useRef<Group>(null!);
//   const { scene } = useGLTF(modelUrl);
//   const { animations } = useGLTF(animationUrl);

//   // --- Re-apply materials to prevent transparency issues ---
//   useEffect(() => {
//     scene.traverse((child) => {
//       if (
//         (child as SkinnedMesh).isSkinnedMesh &&
//         (child as SkinnedMesh).material
//       ) {
//         // This ensures materials are correctly applied, especially after loading
//         (child as SkinnedMesh).material = new MeshStandardMaterial({
//           map: ((child as SkinnedMesh).material as MeshStandardMaterial).map,
//         });
//       }
//     });
//   }, [scene]);

//   // --- GUI Controls for Debugging ---
//   const { bodyAnimation, lipSync, blink } = useControls("Avatar Animation", {
//     bodyAnimation: { options: Object.keys(ANIMATION_MAP) },
//     lipSync: false,
//     blink: false,
//   });

//   const mixer = useMemo(() => new AnimationMixer(scene), [scene]);
//   const { actions } = useAnimations(animations, modelRef);

//   // --- Procedural Blinking State ---
//   const [isBlinking, setIsBlinking] = useState(false);
//   useEffect(() => {
//     let blinkTimeout: NodeJS.Timeout;
//     const nextBlink = () => {
//       blinkTimeout = setTimeout(() => {
//         setIsBlinking(true);
//         setTimeout(() => {
//           setIsBlinking(false);
//           nextBlink();
//         }, 100);
//       }, randInt(1000, 5000));
//     };
//     nextBlink();
//     return () => clearTimeout(blinkTimeout);
//   }, []);

//   // --- Body Animation State Machine ---
//   useEffect(() => {
//     Object.values(actions).forEach((action) => action.fadeOut(0.5));
//     const currentAction = actions[bodyAnimation];
//     if (currentAction) {
//       currentAction.reset().fadeIn(0.5).setLoop(LoopRepeat, Infinity).play();
//     }
//   }, [bodyAnimation, actions]);

//   // --- THE DEFINITIVE ANIMATION FIX (from reference) ---
//   // A robust function to animate any morph target by name or index
//   const lerpMorphTarget = (
//     target: string | number,
//     value: number,
//     speed = 0.1
//   ) => {
//     scene.traverse((child) => {
//       if (
//         (child as SkinnedMesh).isSkinnedMesh &&
//         (child as SkinnedMesh).morphTargetDictionary
//       ) {
//         const mesh = child as SkinnedMesh;
//         const index =
//           typeof target === "string"
//             ? mesh.morphTargetDictionary[target]
//             : target;

//         if (index !== undefined && mesh.morphTargetInfluences) {
//           mesh.morphTargetInfluences[index] = MathUtils.lerp(
//             mesh.morphTargetInfluences[index],
//             value,
//             speed
//           );
//         }
//       }
//     });
//   };

//   useFrame((_state, delta) => {
//     mixer.update(delta); // Advance the main body animation

//     for (let i = 0; i <= 21; i++) {
//       lerpMorphTarget(i, 0, 0.1);
//     }

//     lerpMorphTarget("mouthSmile", 0.2, 0.5);

//     lerpMorphTarget("  ", lipSync ? 1 : 0, 0.2);

//     lerpMorphTarget("eye_close", isBlinking || blink ? 1 : 0, 0.5);
//   });

//   return (
//     <primitive
//       ref={modelRef}
//       object={scene}
//       scale={1.5}
//       position={[0, -1.7, 0]}
//     />
//   );
// }
