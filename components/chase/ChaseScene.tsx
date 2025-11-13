"use client";

import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Trail } from "@react-three/drei";
import { Spacecraft } from "./Spacecraft";

export function ChaseScene({ onComplete }: { onComplete?: () => void }) {
  const chaserRef = useRef<THREE.Group>(null);
  const targetRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const DURATION = 20; // seconds
  const startTimeRef = useRef<number>(0);
  const tempVec = useMemo(() => new THREE.Vector3(), []);
  const tempVec2 = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  useEffect(() => {
    startTimeRef.current = performance.now() / 1000;
  }, []);

  function targetPositionAt(t: number): THREE.Vector3 {
    // t: seconds
    const s = THREE.MathUtils.clamp(t / DURATION, 0, 1);
    const R = 60;
    const x = Math.cos(s * Math.PI * 2) * R;
    const y = Math.sin(s * Math.PI * 4) * 8 + Math.sin(s * Math.PI * 1.5) * 5;
    const z = -s * 240 + Math.sin(s * Math.PI * 2) * 20;
    return new THREE.Vector3(x, y, z);
  }

  useFrame((state, delta) => {
    const now = performance.now() / 1000;
    const t = now - startTimeRef.current;
    const clamped = Math.min(t, DURATION);

    const tgtPos = targetPositionAt(clamped);
    const tgtPrev = targetPositionAt(Math.max(0, clamped - 0.05));
    const tgtDir = tempVec.copy(tgtPos).sub(tgtPrev).normalize();

    const chaser = chaserRef.current!;
    const target = targetRef.current!;

    // Update target transform
    target.position.copy(tgtPos);
    tempVec2.copy(tgtPos).addScaledVector(tgtDir, 10);
    target.lookAt(tempVec2);

    // Chaser pursues with a behind offset
    if (!chaser.position.lengthSq()) {
      chaser.position.copy(tgtPos).addScaledVector(tgtDir, -20).add(new THREE.Vector3(4, 2, 0));
    }
    const desiredBehindOffset = -14;
    const sideOffset = 4 * Math.sin(clamped * 0.8);
    const upOffset = 2 * Math.cos(clamped * 0.6);

    const desired = tempVec.copy(tgtPos)
      .addScaledVector(tgtDir, desiredBehindOffset)
      .add(new THREE.Vector3(sideOffset, upOffset, 0));

    // Smooth pursuit behavior
    chaser.position.lerp(desired, 1 - Math.exp(-delta * 2.5));

    // Chaser orientation faces ahead towards target lead
    const leadPoint = tempVec2.copy(tgtPos).addScaledVector(tgtDir, 6);
    chaser.lookAt(leadPoint);

    // Cinematic camera rig
    const midPoint = tempVec.copy(chaser.position).lerp(target.position, 0.5);
    const chaserForward = tempVec2.copy(leadPoint).sub(chaser.position).normalize();
    const right = new THREE.Vector3().crossVectors(chaserForward, up).normalize();
    const chaserUp = new THREE.Vector3().crossVectors(right, chaserForward).normalize();

    const s1 = smoothWindow(clamped, 0, 5);
    const s2 = smoothWindow(clamped, 5, 12);
    const s3 = smoothWindow(clamped, 12, 16);
    const s4 = smoothWindow(clamped, 16, 20);

    const camPos1 = new THREE.Vector3(0, 30, 80);
    const camPos2 = new THREE.Vector3().copy(chaser.position)
      .addScaledVector(chaserForward, -18)
      .addScaledVector(chaserUp, 6);
    const camPos3 = new THREE.Vector3().copy(chaser.position)
      .addScaledVector(right, 16)
      .addScaledVector(chaserUp, 3);
    const camPos4 = new THREE.Vector3().copy(target.position)
      .addScaledVector(tgtDir, -12)
      .add(new THREE.Vector3(0, 2, 0));

    const desiredCam = new THREE.Vector3();
    desiredCam.addScaledVector(camPos1, s1);
    desiredCam.addScaledVector(camPos2, s2);
    desiredCam.addScaledVector(camPos3, s3);
    desiredCam.addScaledVector(camPos4, s4);

    if (desiredCam.lengthSq() === 0) desiredCam.copy(camPos1);

    camera.position.lerp(desiredCam, 1 - Math.exp(-delta * 3));

    const lookTarget = midPoint;
    camera.lookAt(lookTarget);

    if (t >= DURATION && onComplete) onComplete();
  });

  return (
    <group>
      <group ref={targetRef}>
        <Spacecraft baseColor={0x66b3ff} emissiveColor={0x1188ff} scale={0.9} />
        <Trail width={0.8} color={new THREE.Color(0x66b3ff)} length={18} decay={2} local attenuation>
          <mesh />
        </Trail>
        <pointLight intensity={1.4} distance={20} color={0x1188ff} position={[0, 0, 3]} />
      </group>

      <group ref={chaserRef}>
        <Spacecraft baseColor={0xff6666} emissiveColor={0xff2222} scale={1.05} />
        <Trail width={1.0} color={new THREE.Color(0xff6666)} length={20} decay={2} local attenuation>
          <mesh />
        </Trail>
        <pointLight intensity={1.6} distance={22} color={0xff3333} position={[0, 0, 3]} />
      </group>
    </group>
  );
}

function smoothWindow(t: number, a: number, b: number) {
  if (t <= a || t >= b) return 0;
  const u = (t - a) / (b - a);
  return u * u * (3 - 2 * u);
}
