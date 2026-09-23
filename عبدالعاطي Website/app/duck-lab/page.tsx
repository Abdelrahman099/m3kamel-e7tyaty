"use client";

/**
 * صفحة تطوير — بتعرض بطة البرنامج من كذا زاوية ثابتة عشان نراجع الشكل.
 * مش مربوطة بأي لينك في الموقع.
 */
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import DuckCharacter, { DuckStudioLights } from "@/components/DuckCharacter";

type View = {
  label: string;
  pos: [number, number, number];
  gripped?: boolean;
  dark?: boolean;
};

const VIEWS: View[] = [
  { label: "قدام", pos: [6.4, 1.1, 0] },
  { label: "ثلاثة أرباع", pos: [4.8, 1.5, 4.2] },
  { label: "جنب — التاج", pos: [0.4, 1.0, 6.4] },
  { label: "ورا", pos: [-6.4, 1.3, 0] },
  { label: "من فوق — الكاب", pos: [3.4, 5.4, 2.2] },
  { label: "ماسك القضبان", pos: [6.2, 1.0, 1.2], gripped: true, dark: true },
];

export default function DuckLab() {
  // ?only=N بيعرض زاوية واحدة بحجم كبير — للمراجعة الدقيقة
  const [only, setOnly] = useState<number | null>(null);
  useEffect(() => {
    const n = new URLSearchParams(window.location.search).get("only");
    if (n !== null) setOnly(Number(n));
  }, []);

  const shown = only === null ? VIEWS : [VIEWS[only]].filter(Boolean);
  const big = only !== null;

  return (
    <main className="min-h-screen bg-manila p-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">
        معمل البطة
      </h1>
      <div className={big ? "grid" : "grid grid-cols-2 gap-4 lg:grid-cols-3"}>
        {shown.map((v) => (
          <div key={v.label} className="sheet overflow-hidden border border-rule">
            <div
              className={big ? "h-[78vh]" : "h-72"}
              style={{ background: v.dark ? "#1B1712" : "#F4EEDF" }}
            >
              <Canvas camera={{ position: v.pos, fov: 38 }} dpr={[1, 2]}>
                <DuckStudioLights dim={v.dark} />
                <group position={[-0.25, -0.45, 0]}>
                  <DuckCharacter
                    spin={false}
                    bob={false}
                    flapSpeed={0}
                    gripped={v.gripped}
                  />
                </group>
              </Canvas>
            </div>
            <p className="border-t border-rule px-4 py-2 text-center text-xs text-muted">
              {v.label}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
