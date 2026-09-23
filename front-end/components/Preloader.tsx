"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import DuckCharacter, { DuckStudioLights } from "./DuckCharacter";

/* الكاميرا z=7 و fov=45 → الارتفاع المرئي عند z=0 يساوي 5.8 وحدة. */
const VIEW_H = 5.8;
const FILL_MAX = 0.6;
const FLOAT_OFFSET = 0.55;

/** النقطة اللي الميّة بتنشف عندها والقضبان بتنزل */
const JAIL_AT = 62;

const BARS = 6;

/**
 * مشهدين في لودر واحد:
 *  ١ — بطة طايفة على ميّة بتتملي (المنسوب = نسبة التحميل)
 *  ٢ — الميّة بتنشف، القضبان بتنزل، والبطة بتمسك الحديد
 *
 * الاسم نفسه («احتياطي») هو النكتة — فاللودر بيحكيها.
 */
function StageDuck({ p, jailed, onFirstFrame }: {
  p: number;
  jailed: boolean;
  onFirstFrame: () => void;
}) {
  const rendered = useRef(false);
  const rig = useRef<THREE.Group>(null);
  const y = useRef(-VIEW_H / 2);
  const x = useRef(0);

  useFrame((state, delta) => {
    if (!rig.current) return;
    if (!rendered.current) {
      rendered.current = true;
      onFirstFrame();
    }
    const t = state.clock.elapsedTime;

    if (jailed) {
      // بتستقر في نص الزنزانة وبتواجه الناس
      y.current = THREE.MathUtils.damp(y.current, -0.5, 3, delta);
      x.current = THREE.MathUtils.damp(x.current, 0, 3, delta);
      rig.current.position.y = y.current + Math.sin(t * 1.1) * 0.035;
      rig.current.position.x = x.current;
      rig.current.rotation.z = Math.sin(t * 1.1) * 0.02;
      rig.current.rotation.y = THREE.MathUtils.damp(
        rig.current.rotation.y,
        -Math.PI / 2,
        3,
        delta
      );
    } else {
      // طايفة على السطح وبتطلع معاه
      const waterY = p * FILL_MAX * VIEW_H - VIEW_H / 2;
      y.current = THREE.MathUtils.damp(
        y.current,
        waterY + FLOAT_OFFSET,
        3.5,
        delta
      );
      x.current = THREE.MathUtils.damp(
        x.current,
        Math.sin(t * 0.8) * 0.16,
        3,
        delta
      );
      rig.current.position.y = y.current + Math.sin(t * 1.9) * 0.13;
      rig.current.position.x = x.current;
      rig.current.rotation.z = Math.sin(t * 1.9) * 0.1;
      rig.current.rotation.y = -Math.PI / 2 + 0.35 + Math.sin(t * 0.55) * 0.4;
    }
  });

  return (
    <group ref={rig}>
      <DuckCharacter
        flapSpeed={0}
        spin={false}
        bob={false}
        scale={0.68}
        gripped={jailed}
      />
    </group>
  );
}

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [stamped, setStamped] = useState(false);
  const [done, setDone] = useState(false);

  const sceneReady = useRef(false);

  useEffect(() => {
    const MIN_MS = 3400;
    const MAX_MS = 6800;
    const SCENE_WAIT_MS = 2500;
    const STAMP_MS = 1150;
    let pageReady = document.readyState === "complete";
    let previous = performance.now();
    let waiting = 0;
    let elapsed = 0;
    let stampedAt: number | null = null;
    let frame = 0;

    document.body.classList.add("is-loading");
    const onLoad = () => { pageReady = true; };
    const onVisibilityChange = () => { previous = performance.now(); };
    window.addEventListener("load", onLoad);
    document.addEventListener("visibilitychange", onVisibilityChange);

    const tick = (now: number) => {
      // Count visible animation time, not time spent hidden or blocked compiling WebGL.
      const delta = Math.max(0, Math.min(now - previous, 100));
      previous = now;
      if (!document.hidden) {
        if (!sceneReady.current && waiting < SCENE_WAIT_MS) {
          // Give the duck its first frame; still allow the CSS scene if initialization stalls.
          waiting += delta;
        } else {
          elapsed += delta;
          if (stampedAt !== null) {
            if (elapsed - stampedAt >= STAMP_MS) {
              setDone(true);
              return;
            }
          } else {
            const curve = 1 - Math.exp(-elapsed / 1300);
            const value = Math.min(pageReady ? 100 : 90, curve * 100);
            setProgress(value);
            if ((pageReady && elapsed >= MIN_MS && value >= 97) || elapsed >= MAX_MS) {
              setProgress(100);
              setStamped(true);
              stampedAt = elapsed;
            }
          }
        }
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("load", onLoad);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.body.classList.remove("is-loading");
    };
  }, []);

  const pct = Math.round(progress);
  const p = progress / 100;
  const jailed = progress >= JAIL_AT;
  const waterPct = jailed ? 0 : p * FILL_MAX * 100;

  return (
    <AnimatePresence onExitComplete={() => document.body.classList.remove("is-loading")}>
      {!done && (
        <motion.div
          key="preloader"
          className="preloader fibers inset-0 z-[80] flex flex-col items-center justify-center bg-manila px-5"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          role="status"
          aria-live="polite"
          aria-label={`جاري فتح الملف ${pct} بالمئة`}
        >
          {/* لسان الفولدر */}
          <div className="w-full max-w-md">
            <div className="flex justify-end pl-8">
              <div className="rounded-t-lg bg-manila-2 px-7 py-1.5">
                <span className="font-display text-[11px] font-bold text-ink">
                  ملف رقم ٠٠١
                </span>
              </div>
            </div>
          </div>

          {/* الورقة */}
          <div className="sheet fibers w-full max-w-md px-6 py-7">
            <div className="flex items-baseline justify-between border-b border-rule pb-3">
              <span className="font-display text-[10px] font-bold text-stamp">
                {jailed ? "حِرز ٣ — التحفّظ" : "حِرز ٣ — الأداة"}
              </span>
              <span className="font-display text-[10px] text-muted">
                {jailed ? "قيد التنفيذ" : "منسوب المراجعة"}
              </span>
            </div>

            {/* المشهد */}
            {/* حركة الميّة والقضبان بنفس انتقالات CSS الأصلية */}
            <div
              className="relative mt-5 h-[19rem] overflow-hidden border-2 border-ink transition-colors duration-700 ease-in-out sm:h-[21rem]"
              style={{ backgroundColor: jailed ? "#1B1712" : "#FBF7EC" }}
            >
              {/* تدريج المنسوب — بيختفي مع الزنزانة */}
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-y-0 right-0 z-[3] w-7 border-l border-dashed border-rule transition-opacity duration-500 ${jailed ? "opacity-0" : "opacity-100"
                  }`}
              >
                {[25, 50, 75].map((v) => (
                  <span
                    key={v}
                    className="absolute right-0 w-full text-center font-display text-[8px] text-faint"
                    style={{ bottom: `${v * FILL_MAX}%` }}
                  >
                    {v}
                  </span>
                ))}
              </div>

              {/* الميّة */}
              <div
                className="absolute inset-x-0 bottom-0 z-[1] transition-[height] ease-out"
                style={{
                  height: `${waterPct}%`,
                  transitionDuration: jailed ? "900ms" : "300ms",
                  display: jailed ? "none" : "block"
                }}
              >
                <svg
                  className="absolute -top-[11px] left-0 h-3 w-[200%]"
                  viewBox="0 0 120 12"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  style={{ animation: "wave 4s linear infinite" }}
                >
                  <path
                    d="M0 12 V6 Q7.5 0 15 6 T30 6 T45 6 T60 6 T75 6 T90 6 T105 6 T120 6 V12 Z"
                    fill="#4E7F7A"
                  />
                </svg>
                <div className="h-full w-full bg-gradient-to-b from-[#4E7F7A] to-[#3B6560]" />
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 14px)",
                  }}
                />
              </div>

              {/* ضوء الزنزانة من فوق */}
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 z-[1] transition-opacity duration-[900ms] delay-300 ${jailed ? "opacity-100" : "opacity-0"
                  }`}
                style={{
                  background:
                    "radial-gradient(ellipse 60% 45% at 50% 18%, rgba(255,206,62,0.18), transparent 70%)",
                }}
              />

              {/* البطة */}
              <div className="absolute inset-0 z-[2]">
                <Canvas
                  camera={{ position: [0, 0, 7], fov: 45 }}
                  gl={{ antialias: true, alpha: true }}
                  dpr={[1, 2]}
                >
                  <DuckStudioLights dim={jailed} />
                  <StageDuck p={p} jailed={jailed} onFirstFrame={() => { sceneReady.current = true; }} />
                </Canvas>
              </div>

              {/* القضبان — بتنزل واحد ورا التاني */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[3] flex justify-between px-6"
              >
                {Array.from({ length: BARS }).map((_, i) => (
                  <span
                    key={i}
                    className="block w-[9px] rounded-sm"
                    style={{
                      background:
                        "linear-gradient(90deg, #5E5A52, #B8B2A6 35%, #8A857B 62%, #46433D)",
                      boxShadow: "2px 0 7px rgba(0,0,0,0.5)",
                      transform: jailed ? "translateY(0)" : "translateY(-110%)",
                      transition: `transform 520ms cubic-bezier(0.4,1.5,0.6,1) ${jailed ? i * 70 : 0
                        }ms`,
                    }}
                  />
                ))}
              </div>

              {/* العارضة الأفقية */}
              <span
                aria-hidden
                className="absolute left-0 right-0 top-[36%] z-[4] h-[7px] origin-left"
                style={{
                  background:
                    "linear-gradient(180deg, #B8B2A6, #7A756C 55%, #46433D)",
                  boxShadow: "0 3px 7px rgba(0,0,0,0.5)",
                  transform: `scaleX(${jailed ? 1 : 0})`,
                  transition: `transform 450ms ease-out ${jailed ? 500 : 0}ms`,
                }}
              />

              <span
                aria-hidden
                className="absolute left-0 right-0 top-[10%] z-[4] h-[7px] origin-left"
                style={{
                  background:
                    "linear-gradient(180deg, #B8B2A6, #7A756C 55%, #46433D)",
                  boxShadow: "0 3px 7px rgba(0,0,0,0.5)",
                  transform: `scaleX(${jailed ? 1 : 0})`,
                  transition: `transform 450ms ease-out ${jailed ? 500 : 0}ms`,
                }}
              />



              <span
                aria-hidden
                className="absolute left-0 right-0 top-[75%] z-[4] h-[7px] origin-left"
                style={{
                  background:
                    "linear-gradient(180deg, #B8B2A6, #7A756C 55%, #46433D)",
                  boxShadow: "0 3px 7px rgba(0,0,0,0.5)",
                  transform: `scaleX(${jailed ? 1 : 0})`,
                  transition: `transform 450ms ease-out ${jailed ? 500 : 0}ms`,
                }}
              />


              <span
                aria-hidden
                className="absolute left-0 right-0 top-[95%] z-[4] h-[7px] origin-left"
                style={{
                  background:
                    "linear-gradient(180deg, #B8B2A6, #7A756C 55%, #46433D)",
                  boxShadow: "0 3px 7px rgba(0,0,0,0.5)",
                  transform: `scaleX(${jailed ? 1 : 0})`,
                  transition: `transform 450ms ease-out ${jailed ? 500 : 0}ms`,
                }}
              />

              {/* الختم */}
              <AnimatePresence>
                {stamped && (
                  <motion.div
                    initial={{ scale: 2.2, opacity: 0, rotate: -24 }}
                    animate={{ scale: 1, opacity: 1, rotate: -8 }}
                    transition={{ duration: 0.42, ease: [0.34, 1.56, 0.64, 1] }}
                    className="stamp absolute bottom-5 left-5 z-[5] bg-[#F4EEDF] text-[13px]"
                  >
                    حبس احتياطي
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* القراءة */}
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="font-display text-[10px] text-muted">
                  {jailed ? "تم التحفّظ على الأداة" : "جارٍ فتح الملف"}
                </p>
                <p className="mt-0.5 font-display text-base font-bold leading-tight text-ink">
                  مع كامل احطياتي
                </p>
              </div>
              <span className="tnum font-display text-3xl font-bold leading-none text-ink">
                {pct}
                <span className="text-stamp">%</span>
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
