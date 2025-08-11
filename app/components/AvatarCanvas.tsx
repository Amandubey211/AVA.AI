// components/AvatarCanvas.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';

function Model({ modelUrl }: { modelUrl: string }) {
  const { scene } = useGLTF(modelUrl);
  return <primitive object={scene} scale={1.8} position={[0, -1.7, 0]} />;
}

export default function AvatarCanvas({ modelUrl }: { modelUrl: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 30 }} className="w-full h-full">
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 5, 2]} intensity={1} />
      <Environment preset="city" />
      <Suspense fallback={null}>
        <Model modelUrl={modelUrl} />
      </Suspense>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}