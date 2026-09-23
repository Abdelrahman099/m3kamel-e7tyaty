"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const DUCK_YELLOW = "#FFCE3E";
export const DUCK_SHADE = "#EDB01C";
export const DUCK_BEAK = "#FF8A1F";
export const DUCK_BEAK_DARK = "#E2690F";
export const DUCK_DARK = "#17130B";

type DuckProps = {
  flapSpeed?: number;
  spin?: boolean;
  /** عدد اللفات الكاملة في الثانية */
  spinSpeed?: number;
  bob?: boolean;
  scale?: number;
  /** الجناحين مرفوعين لفوق وثابتين — وضعية الإمساك بالقضبان */
  gripped?: boolean;
};

/**
 * بطة الحمّام الكلاسيكية — مبنية من primitives، من غير أي ملف موديل.
 *
 * قواعد الشكل اللي بتخليها تتقري كبطة من أي زاوية:
 *  1. راس كبيرة قاعدة على الجسم على طول من غير رقبة
 *  2. منقار عريض مفلطح (مش مخروط)
 *  3. عيون كبيرة بارزة بره سطح الراس — بيضا وسودا، واضحة من بعيد
 *  4. ديل صغير مرفوع لفوق
 */
export default function Duck3D({
  flapSpeed = 9,
  spin = true,
  spinSpeed = 0.55,
  bob = true,
  scale = 1,
  gripped = false,
}: DuckProps) {
  const root = useRef<THREE.Group>(null);
  const wingL = useRef<THREE.Group>(null);
  const wingR = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (root.current) {
      if (spin) root.current.rotation.y = t * spinSpeed * Math.PI * 2;
      if (bob) {
        root.current.position.y = Math.sin(t * 1.5) * 0.16;
        root.current.rotation.z = Math.sin(t * 1.5) * 0.05;
      }
    }

    // في وضعية الإمساك الجناحين بيتثبتوا مرفوعين لفوق مع رعشة خفيفة.
    // غير كده بيرتاحوا مايلين لتحت والرفرفة بتتحرك حوالين الوضع ده.
    const flap = Math.sin(t * flapSpeed);
    const targetL = gripped ? -1.18 + Math.sin(t * 3.1) * 0.05 : 0.42 - flap * 0.75;
    const targetR = gripped ? 1.18 - Math.sin(t * 3.1) * 0.05 : -0.42 + flap * 0.75;

    if (wingL.current) {
      wingL.current.rotation.x = THREE.MathUtils.damp(
        wingL.current.rotation.x, targetL, 6, delta
      );
    }
    if (wingR.current) {
      wingR.current.rotation.x = THREE.MathUtils.damp(
        wingR.current.rotation.x, targetR, 6, delta
      );
    }

    if (head.current) {
      // محبوسة: بتبص يمين وشمال ببطء. حرة: حركة عادية.
      const speed = gripped ? 0.9 : 1.4;
      head.current.rotation.z = Math.sin(t * 2.2) * (gripped ? 0.03 : 0.06);
      head.current.rotation.y = Math.sin(t * speed) * (gripped ? 0.22 : 0.1);
    }
  });

  return (
    <group ref={root} scale={scale} dispose={null}>
      {/* ========== الجسم ========== */}
      <mesh castShadow receiveShadow scale={[1.22, 0.96, 1.0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color={DUCK_YELLOW}
          roughness={0.38}
          metalness={0.02}
        />
      </mesh>

      {/* ========== الديل — صغير ومسحوب لورا، مش سنّة واقفة ========== */}
      <group position={[-1.14, 0.34, 0]} rotation={[0, 0, 2.05]}>
        <mesh scale={[1, 1, 0.8]} castShadow>
          <coneGeometry args={[0.3, 0.48, 24]} />
          <meshStandardMaterial color={DUCK_SHADE} roughness={0.5} />
        </mesh>
      </group>

      {/* ========== الراس ========== */}
      <group ref={head} position={[0.72, 1.02, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.62, 48, 48]} />
          <meshStandardMaterial
            color={DUCK_YELLOW}
            roughness={0.36}
            metalness={0.02}
          />
        </mesh>

        {/* ---- المنقار: عريض ومفلطح ---- */}
        <group position={[0.5, -0.1, 0]} rotation={[0, 0, -0.16]}>
          <mesh scale={[0.42, 0.13, 0.31]} castShadow>
            <sphereGeometry args={[1, 40, 28]} />
            <meshStandardMaterial
              color={DUCK_BEAK}
              roughness={0.32}
              metalness={0.03}
            />
          </mesh>
          {/* الفك السفلي */}
          <mesh position={[-0.04, -0.105, 0]} scale={[0.34, 0.075, 0.25]}>
            <sphereGeometry args={[1, 32, 24]} />
            <meshStandardMaterial color={DUCK_BEAK_DARK} roughness={0.42} />
          </mesh>
          {/* المنخار */}
          {[0.085, -0.085].map((z) => (
            <mesh key={z} position={[0.14, 0.075, z]}>
              <sphereGeometry args={[0.02, 10, 10]} />
              <meshBasicMaterial color="#9C400A" />
            </mesh>
          ))}
        </group>

        {/* ---- العيون: كبيرة وبارزة ---- */}
        {[1, -1].map((side) => {
          const ex = 0.45;
          const ey = 0.22;
          const ez = 0.32 * side;
          const dir = new THREE.Vector3(ex, ey, ez).normalize();
          const pupil = dir.clone().multiplyScalar(0.085);
          const spark = dir.clone().multiplyScalar(0.14);
          return (
            <group key={side} position={[ex, ey, ez]}>
              {/* بياض العين */}
              <mesh>
                <sphereGeometry args={[0.165, 28, 28]} />
                <meshStandardMaterial
                  color="#FFFFFF"
                  roughness={0.18}
                  metalness={0}
                />
              </mesh>
              {/* البؤبؤ */}
              <mesh position={[pupil.x, pupil.y, pupil.z]}>
                <sphereGeometry args={[0.105, 24, 24]} />
                <meshStandardMaterial color={DUCK_DARK} roughness={0.1} />
              </mesh>
              {/* لمعة */}
              <mesh
                position={[spark.x, spark.y + 0.045, spark.z]}
                scale={[1, 1, 1]}
              >
                <sphereGeometry args={[0.042, 14, 14]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ========== الجناحين — ملزوقين في جنب الجسم ومسحوبين لورا ========== */}
      <group ref={wingL} position={[0.24, 0.24, 0.66]}>
        <mesh
          position={[-0.3, -0.12, 0.08]}
          rotation={[0, -0.3, -0.16]}
          scale={[0.6, 0.14, 0.3]}
          castShadow
        >
          <sphereGeometry args={[1, 36, 24]} />
          <meshStandardMaterial color={DUCK_SHADE} roughness={0.46} />
        </mesh>
      </group>
      <group ref={wingR} position={[0.24, 0.24, -0.66]}>
        <mesh
          position={[-0.3, -0.12, -0.08]}
          rotation={[0, 0.3, -0.16]}
          scale={[0.6, 0.14, 0.3]}
          castShadow
        >
          <sphereGeometry args={[1, 36, 24]} />
          <meshStandardMaterial color={DUCK_SHADE} roughness={0.46} />
        </mesh>
      </group>
    </group>
  );
}
