// components/ModelPreviewModal.tsx
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, OrbitControls } from "@react-three/drei";
import { Group } from "three";
import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { FocusOn } from "react-focus-on"; // For accessibility

// 3D Model component for the modal
function ModalAvatar({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<Group>(null!);

  useFrame((_state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.3; // Constant slow rotation
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={1.8}
      position={[0, -1.8, 0]}
    />
  );
}

interface ModelPreviewModalProps {
  modelUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ModelPreviewModal({
  modelUrl,
  isOpen,
  onClose,
}: ModelPreviewModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Prevent closing when clicking on the modal content */}
          <FocusOn>
            {" "}
            {/* Focus Trap */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative w-full h-full max-w-3xl max-h-[80vh] bg-gray-900 rounded-2xl shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full text-white bg-black/50 hover:bg-black z-50"
                aria-label="Close 3D preview"
              >
                <X />
              </button>

              <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                <Environment preset="city" />
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, -5]} intensity={1.5} />
                <ModalAvatar url={modelUrl} />
                <OrbitControls enableZoom autoRotate autoRotateSpeed={0.5} />
              </Canvas>
            </motion.div>
          </FocusOn>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
