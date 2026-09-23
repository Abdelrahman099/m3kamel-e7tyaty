"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { createDuckTextures } from "./duck/textures";
import { makeBeardGeometry } from "./duck/beard";

/**
 * بطة البرنامج الرسمية — نفس الشخصية اللي في البوستر:
 * بطة فينيل لامعة، كاب نيوزبوي بورجوندي، كمامة عليها بطط،
 * دقن كثيفة، ووشم «Hustler» على الصدر وتاج على الجناح.
 *
 * كلها primitives وخامات مرسومة وقت التشغيل — مفيش ملف موديل ولا صور.
 * نفس الـ props بتاعة Duck3D، فتتبدل مكانها على طول.
 *
 * الاتجاهات: البطة باصّة ناحية +X، والراس مركزها (0.72, 1.02, 0).
 */

type Props = {
  flapSpeed?: number;
  spin?: boolean;
  spinSpeed?: number;
  bob?: boolean;
  scale?: number;
  /** الجناحين مرفوعين على الجناب — وضعية الإمساك بالقضبان */
  gripped?: boolean;
};

const YELLOW = "#FFC628";
const YELLOW_DEEP = "#F4B11C";

/** نقطة على سطح الراس — للأستك بتاع الكمامة */
function onHead(x: number, y: number, z: number, r = 0.642) {
  return new THREE.Vector3(x, y, z).normalize().multiplyScalar(r);
}

function earLoopGeometry(side: 1 | -1) {
  const pts = [
    [0.45, 0.02, 0.62],
    [0.1, 0.12, 0.99],
    [-0.35, 0.1, 0.93],
    [-0.62, -0.12, 0.77],
    [-0.4, -0.34, 0.85],
    [0.05, -0.36, 0.93],
    [0.42, -0.34, 0.84],
  ].map(([x, y, z]) => onHead(x, y, z * side));
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 64, 0.013, 6, false);
}

// مكان العين: على سطح الراس بين الكمامة والكاب
const EYE_DIR = new THREE.Vector3(0.72, 0.28, 0.48).normalize();

export default function DuckCharacter({
  flapSpeed = 9,
  spin = true,
  spinSpeed = 0.55,
  bob = true,
  scale = 1,
  gripped = false,
}: Props) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const wingL = useRef<THREE.Group>(null);
  const wingR = useRef<THREE.Group>(null);

  /* ---------- الخامات والأشكال — بتتعمل مرة واحدة ---------- */

  const tex = useMemo(() => createDuckTextures(), []);
  const beard = useMemo(() => makeBeardGeometry(0.37), []);
  const loops = useMemo(() => [earLoopGeometry(1), earLoopGeometry(-1)], []);

  const mats = useMemo(() => {
    const vinyl = {
      roughness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
    };
    return {
      body: new THREE.MeshPhysicalMaterial({ map: tex.body, ...vinyl }),
      wing: new THREE.MeshPhysicalMaterial({ map: tex.wing, ...vinyl, roughness: 0.34 }),
      head: new THREE.MeshPhysicalMaterial({ color: YELLOW, ...vinyl }),
      tail: new THREE.MeshPhysicalMaterial({ color: YELLOW_DEEP, ...vinyl, roughness: 0.36 }),
      eye: new THREE.MeshPhysicalMaterial({
        color: "#0B0907",
        roughness: 0.06,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
      }),
      glint: new THREE.MeshBasicMaterial({ color: "#FFFFFF" }),
      mask: new THREE.MeshStandardMaterial({ map: tex.mask, roughness: 0.92 }),
      loop: new THREE.MeshStandardMaterial({ color: "#ECE8DF", roughness: 0.85 }),
      cap: new THREE.MeshStandardMaterial({ map: tex.cap, roughness: 0.96 }),
      // نفس القماش بس أغمق — الـ color بيضرب في الـ map
      brim: new THREE.MeshStandardMaterial({ map: tex.cap, color: "#A88890", roughness: 0.9 }),
      button: new THREE.MeshStandardMaterial({ color: "#521520", roughness: 0.85 }),
      beard: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }),
    };
  }, [tex]);

  // الوشم بيترسم بخط احتياطي، وأول ما الـ blackletter يتحمّل بيترسم تاني
  useEffect(() => {
    let cancelled = false;
    const family = getComputedStyle(document.documentElement)
      .getPropertyValue("--font-blackletter")
      .trim();
    if (!family) return;
    document.fonts
      .load(`120px ${family}`)
      .then(() => {
        if (!cancelled) tex.paintTattoos(family);
      })
      .catch(() => {
        /* الخط الاحتياطي كفاية */
      });
    return () => {
      cancelled = true;
    };
  }, [tex]);

  useEffect(
    () => () => {
      tex.dispose();
      beard.dispose();
      loops.forEach((g) => g.dispose());
      Object.values(mats).forEach((m) => m.dispose());
    },
    [tex, beard, loops, mats]
  );

  /* ---------- الحركة ---------- */

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (root.current) {
      if (spin) root.current.rotation.y = t * spinSpeed * Math.PI * 2;
      if (bob) {
        root.current.position.y = Math.sin(t * 1.5) * 0.16;
        root.current.rotation.z = Math.sin(t * 1.5) * 0.05;
      }
    }

    // الجناح مثبّت من الكتف وممدود لورا. الإمساك = نرفعه لفوق حوالين Z
    // ونميّله لبرّه حوالين Y. غير كده رفرفة خفيفة حوالين الوضع العادي.
    const flap = flapSpeed > 0 ? Math.sin(t * flapSpeed) * 0.32 : 0;
    const shake = gripped ? Math.sin(t * 3.1) * 0.04 : 0;
    const liftZ = gripped ? -1.22 + shake : -flap;
    const tiltY = gripped ? 0.45 : 0;

    const k = 1 - Math.exp(-6 * delta);
    for (const [wing, side] of [
      [wingL.current, 1],
      [wingR.current, -1],
    ] as const) {
      if (!wing) continue;
      wing.rotation.z += (liftZ - wing.rotation.z) * k;
      wing.rotation.y += (tiltY * side - wing.rotation.y) * k;
    }

    if (head.current) {
      const speed = gripped ? 0.9 : 1.4;
      head.current.rotation.z = Math.sin(t * 2.2) * (gripped ? 0.03 : 0.05);
      head.current.rotation.y = Math.sin(t * speed) * (gripped ? 0.2 : 0.09);
    }
  });

  return (
    <group ref={root} scale={scale} dispose={null}>
      {/* ================= الجسم ================= */}
      <mesh material={mats.body} scale={[1.22, 0.96, 1.0]}>
        <sphereGeometry args={[1, 96, 64]} />
      </mesh>

      {/* الديل */}
      <group position={[-1.14, 0.34, 0]} rotation={[0, 0, 2.05]}>
        <mesh material={mats.tail} scale={[1, 1, 0.8]}>
          <coneGeometry args={[0.3, 0.48, 32]} />
        </mesh>
      </group>

      {/* ================= الجناحين — نحت على الجناب، والتاج عليهم ================= */}
      {([1, -1] as const).map((side) => (
        <group
          key={side}
          ref={side === 1 ? wingL : wingR}
          position={[0.32, 0.34, 0.86 * side]}
        >
          <mesh
            material={mats.wing}
            position={[-0.46, -0.1, 0.05 * side]}
            rotation={[0, 0, 0.14]}
            scale={[0.6, 0.34, 0.12]}
          >
            <sphereGeometry args={[1, 48, 32]} />
          </mesh>
        </group>
      ))}

      {/* ================= الراس ================= */}
      <group ref={head} position={[0.72, 1.02, 0]} scale={1.08}>
        <mesh material={mats.head}>
          <sphereGeometry args={[0.62, 72, 56]} />
        </mesh>

        {/* العينين — أسود لامع زي بطة الحمّام الحقيقية */}
        {([1, -1] as const).map((side) => {
          const c = EYE_DIR.clone().setZ(EYE_DIR.z * side).multiplyScalar(0.6);
          return (
            <group key={side} position={c}>
              <mesh material={mats.eye}>
                <sphereGeometry args={[0.092, 24, 24]} />
              </mesh>
              <mesh material={mats.glint} position={[0.055, 0.04, 0.03 * side]}>
                <sphereGeometry args={[0.022, 12, 12]} />
              </mesh>
            </group>
          );
        })}

        {/* ---- الدقن: كتلة كبيرة تحت الكمامة + خدود على الجناب ---- */}
        <mesh
          geometry={beard}
          material={mats.beard}
          position={[0.36, -0.54, 0]}
          scale={[0.37, 0.48, 0.55]}
        />
        {([1, -1] as const).map((side) => (
          <mesh
            key={side}
            geometry={beard}
            material={mats.beard}
            position={[0.2, -0.31, 0.42 * side]}
            scale={[0.23, 0.3, 0.17]}
          />
        ))}

        {/* ---- الكمامة: بتغطي المنقار وبتبرز لقدام مكانه ---- */}
        <mesh
          material={mats.mask}
          position={[0.4, -0.16, 0]}
          scale={[0.46, 0.25, 0.52]}
        >
          <sphereGeometry args={[1, 64, 48]} />
        </mesh>
        {loops.map((g, i) => (
          <mesh key={i} geometry={g} material={mats.loop} />
        ))}

        {/* ---- الكاب النيوزبوي ---- */}
        <mesh
          material={mats.cap}
          position={[0, 0.5, 0]}
          rotation={[0, 0, -0.14]}
          scale={[0.72, 0.3, 0.68]}
        >
          <sphereGeometry args={[1, 64, 40]} />
        </mesh>
        {/* الحافة */}
        <mesh
          material={mats.brim}
          position={[0.62, 0.4, 0]}
          rotation={[0, 0, -0.24]}
          scale={[0.36, 0.05, 0.5]}
        >
          <sphereGeometry args={[1, 48, 24]} />
        </mesh>
        {/* الزرار فوق */}
        <mesh
          material={mats.button}
          position={[0.042, 0.797, 0]}
          scale={[0.07, 0.04, 0.07]}
        >
          <sphereGeometry args={[1, 20, 12]} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * إضاءة استوديو — Lightformers بدل ملف HDR، فمفيش أي تحميل من النت.
 * اللمعة اللي على الفينيل والـ clearcoat بتيجي من هنا.
 */
export function DuckStudioLights({ dim = false }: { dim?: boolean }) {
  return (
    <>
      <ambientLight intensity={dim ? 0.35 : 0.6} />
      <directionalLight position={[3, 6, 5]} intensity={dim ? 1.9 : 1.6} />
      <directionalLight position={[-5, 1, -3]} intensity={0.5} color="#FFB36B" />
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={2.4} position={[0, 4, 6]} scale={[9, 3, 1]} />
        <Lightformer
          intensity={1.4}
          color="#FFE0B0"
          position={[-6, 1, 2]}
          rotation-y={Math.PI / 2}
          scale={[5, 4, 1]}
        />
        <Lightformer
          intensity={0.9}
          color="#C9D6FF"
          position={[6, 2, -3]}
          rotation-y={-Math.PI / 2}
          scale={[4, 4, 1]}
        />
        <Lightformer form="ring" intensity={1.6} position={[2, 3, 4]} scale={1.4} />
      </Environment>
    </>
  );
}
