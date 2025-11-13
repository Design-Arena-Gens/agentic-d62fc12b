"use client";

import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { Suspense, useCallback, useRef, useState } from "react";
import { ChaseScene } from "./chase/ChaseScene";

export default function SceneCanvas() {
  const [key, setKey] = useState(0);
  const onReplay = useCallback(() => setKey((k) => k + 1), []);
  const pausedRef = useRef(false);

  return (
    <div id="scene-root" className="canvas-wrap">
      <Canvas key={key} dpr={[1, 2]} gl={{ antialias: true }} camera={{ position: [0, 8, 22], fov: 50 }}>
        <color attach="background" args={[0x000000]} />
        <fog attach="fog" args={["#02040a", 60, 240]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 20, 10]} intensity={1.1} />
        <directionalLight position={[-10, -5, -10]} intensity={0.3} color="#66aaff" />

        <Suspense fallback={null}>
          <Stars radius={300} depth={80} count={8000} factor={3} saturation={0} fade speed={0.5} />
          <ChaseScene onComplete={() => (pausedRef.current = true)} />
        </Suspense>
        {/* <OrbitControls enablePan={false} /> */}
      </Canvas>

      <div className="overlay">
        <button className="button" onClick={onReplay}>Replay</button>
      </div>
    </div>
  );
}
