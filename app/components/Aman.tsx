// "use client";
// import { CameraControls, Environment, Gltf } from "@react-three/drei";
// import { Canvas } from "@react-three/fiber";

// export default function Aman() {
//   return (
//     <>
//       <Canvas camera={{ position: [0, 0, 0.00001] }}>
//         <CameraManager />
//         <Environment preset="sunset" />
//         <ambientLight intensity={0.8} color="pink" />
//         <Gltf src="/models/classroom_default.glb" position={[0.2, -1.7, -2]} />
//       </Canvas>
//     </>
//   );
// }

// const CameraManager = () => {
//   return (
//     <CameraControls
//       minZoom={1}
//       maxZoom={3}
//       polarRotateSpeed={-0.3}
//       azimuthRotateSpeed={-0.3}
//       mouseButtons={{
//         left: 1,
//         wheel: 16,
//       }}
//       touches={{ one: 32, two: 512 }}
//     />
//   );
// };
