"use client";

import * as THREE from "three";
import { forwardRef, useMemo } from "react";

export const Spacecraft = forwardRef<THREE.Group, { baseColor?: number; emissiveColor?: number; scale?: number }>(
  ({ baseColor = 0xffffff, emissiveColor = 0x44ccff, scale = 1 }, ref
) => {
  const hullMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(baseColor), metalness: 0.6, roughness: 0.35 }), [baseColor]);
  const noseMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(baseColor).multiplyScalar(1.1), metalness: 0.7, roughness: 0.25 }), [baseColor]);
  const wingMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(baseColor).multiplyScalar(0.9), metalness: 0.4, roughness: 0.5 }), [baseColor]);
  const glowMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(emissiveColor), emissive: new THREE.Color(emissiveColor), emissiveIntensity: 2, metalness: 0.1, roughness: 0.2 }), [emissiveColor]);

  const s = scale;

  return (
    <group ref={ref as any} scale={[s, s, s]}>
      {/* Fuselage */}
      <mesh material={hullMat} position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.8, 4.2, 16]} />
      </mesh>

      {/* Nose cone */}
      <mesh material={noseMat} position={[0, 0, -2.6]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.6, 1.2, 16]} />
      </mesh>

      {/* Engine cone (back) */}
      <mesh material={glowMat} position={[0, 0, 2.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.55, 1.4, 16]} />
      </mesh>

      {/* Wings */}
      <mesh material={wingMat} position={[0.95, -0.1, 0]} rotation={[0, 0, -0.25]}>
        <boxGeometry args={[1.8, 0.08, 2.4]} />
      </mesh>
      <mesh material={wingMat} position={[-0.95, -0.1, 0]} rotation={[0, 0, 0.25]}>
        <boxGeometry args={[1.8, 0.08, 2.4]} />
      </mesh>

      {/* Fins */}
      <mesh material={wingMat} position={[0.5, 0.7, -0.6]} rotation={[0.15, 0, 0.2]}>
        <boxGeometry args={[0.9, 0.06, 1.1]} />
      </mesh>
      <mesh material={wingMat} position={[-0.5, 0.7, -0.6]} rotation={[0.15, 0, -0.2]}>
        <boxGeometry args={[0.9, 0.06, 1.1]} />
      </mesh>

      {/* Cockpit glow strip */}
      <mesh position={[0, 0.35, -1.2]}
        material={new THREE.MeshStandardMaterial({ color: new THREE.Color(0xffffff), emissive: new THREE.Color(emissiveColor), emissiveIntensity: 1.6, metalness: 0.2, roughness: 0.1 })}>
        <boxGeometry args={[0.8, 0.08, 1.0]} />
      </mesh>
    </group>
  );
});
Spacecraft.displayName = "Spacecraft";
