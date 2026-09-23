"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { motion } from "framer-motion";
import DuckCharacter, { DuckStudioLights } from "./DuckCharacter";
import { useQuack } from "./useQuack";

const LINES = [
  { before: "قاللي إحنا في الشغل عيلة. يا ", word: "ابن اللذينة", after: "، طب اكتبلي نصيبي في الشركة." },
  { before: "الإكس قالتلي إنت تستاهل واحدة أحسن مني. ", word: "أحا", after: "، طب ابعتيلي رقمها بدل خطاب التوصية ده." },
];

export default function DuckLore() {
  const quack = useQuack();
  const [open, setOpen] = useState<number[]>([]);
  const [quacks, setQuacks] = useState(0);

  const toggle = (i: number) => {
    quack();
    setOpen((r) => (r.includes(i) ? r.filter((x) => x !== i) : [...r, i]));
  };

  return (
    <section id="duck" className="scroll-mt-20 px-5 py-14 sm:px-8">
      <div className="sheet fibers mx-auto max-w-6xl px-6 py-9 sm:px-12 sm:py-11">

        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b-2 border-ink pb-4">
          <div>
            <p className="font-display text-[10px] font-bold text-stamp">
              خامساً — الأداة المستخدمة
            </p>
            <h2 className="mt-2 font-display text-[clamp(1.6rem,4.5vw,2.5rem)] font-bold leading-tight text-ink">
              ليه بطة؟
            </h2>
          </div>
          <span className="font-display text-[11px] text-muted">مرفق فني</span>
        </div>

        <div className="grid grid-cols-1 items-center gap-10 pt-8 lg:grid-cols-2">
          {/* البطة */}
          <div className="order-2 min-w-0 lg:order-1">
            <div className="sheet-2 relative border border-rule">
              <div className="h-[19rem] sm:h-[22rem]">
                <Canvas
                  camera={{ position: [0, 0.4, 7], fov: 42 }}
                  gl={{ antialias: true, alpha: true }}
                  dpr={[1, 2]}
                >
                  <Suspense fallback={null}>
                    <DuckStudioLights />
                    <Float speed={1.9} rotationIntensity={0.45} floatIntensity={1}>
                      <DuckCharacter flapSpeed={5} spin spinSpeed={0.15} bob scale={0.95} />
                    </Float>
                  </Suspense>
                </Canvas>
              </div>

              <div className="border-t border-rule px-4 py-3 text-center">
                <button
                  onClick={() => {
                    quack();
                    setQuacks((n) => n + 1);
                  }}
                  className="border-2 border-ink bg-duck px-6 py-2.5 font-display text-[13px] font-bold text-ink transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  دوس عشان تسمعها
                </button>
                <p className="mt-2 font-display text-[10px] text-muted">
                  {quacks > 0 ? (
                    <>
                      <span className="tnum">{quacks}</span> كواكة
                      {quacks > 9 ? " — خلاص كده، فهمنا" : ""}
                    </>
                  ) : (
                    "حِرز ٣ — الأداة"
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* الشرح */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 flex min-w-0 flex-col gap-5 lg:order-2"
          >
            <p className="text-[17px] leading-[2.05] text-ink-2">
              في كل حلقة، ساعة ما الكلام يوصل للحتة اللي مينفعش تتقال — بتيجي
              البطة. مش بتسكّت الجملة، بتغطيها. وإنت قاعد فاهم كل حاجة.
            </p>
            <p className="text-[17px] leading-[2.05] text-ink-2">
              البطة بقت هي العلامة. الناس بقت تستنى الكواكة أكتر ما بتستنى
              الجملة نفسها.
            </p>

            <div className="sheet-2 border border-rule p-5">
              <p className="mb-4 font-display text-[10px] text-muted">
                بيان عملي — دوس على المُغطّى
              </p>
              <div className="flex flex-col gap-3.5">
                {LINES.map((line, i) => (
                  <p key={i} className="text-[16px] leading-[2] text-ink">
                    {line.before}
                    <button
                      onClick={() => toggle(i)}
                      data-open={open.includes(i)}
                      className="redact font-semibold"
                      aria-label="اكشف الكلمة المغطاة"
                    >
                      <span>{line.word}</span>
                    </button>
                    {line.after}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
