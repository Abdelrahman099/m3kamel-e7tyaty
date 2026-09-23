"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, type CategoryId } from "@/lib/types";
import { DuckOutline } from "./marks";

const MAX = 600;

export default function AskForm() {
  const [category, setCategory] = useState<CategoryId>("weird");
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [anon, setAnon] = useState(true);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const honey = useRef<HTMLInputElement>(null);

  const remaining = MAX - body.length;
  const tooShort = body.trim().length > 0 && body.trim().length < 10;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setError("");

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body,
          category,
          name: anon ? "" : name,
          city: anon ? "" : city,
          website: honey.current?.value ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "حصل خطأ");
      setState("done");
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "حصل خطأ، جرّب تاني");
      setState("error");
    }
  }

  return (
    <section id="ask" className="scroll-mt-20 px-5 py-14 sm:px-8">
      <div className="sheet fibers sheet-tilt-b mx-auto max-w-3xl px-6 py-9 sm:px-11 sm:py-11">

        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b-2 border-ink pb-4">
          <div>
            <p className="font-display text-[10px] font-bold text-stamp">
              ثالثاً — استمارة التقديم
            </p>
            <h2 className="mt-2 font-display text-[clamp(1.6rem,4.5vw,2.5rem)] font-bold leading-tight text-ink">
              استمارة ٥٠٠ — طلب سؤال
            </h2>
          </div>
          <span className="font-display text-[11px] text-muted">تُملأ بخط واضح</span>
        </div>

        <AnimatePresence mode="wait">
          {state === "done" ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center py-12 text-center"
            >
              <motion.div
                initial={{ scale: 2, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: -6 }}
                transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                className="stamp px-7 py-4"
              >
                <DuckOutline className="mx-auto h-12 w-16 text-stamp" />
                <span className="mt-1.5 block text-[15px]">قُيِّد</span>
              </motion.div>

              <h3 className="mt-7 font-display text-2xl font-bold text-ink">
                وصل. مع كامل احطياتي.
              </h3>
              <p className="mx-auto mt-3 max-w-md text-[15px] leading-[1.95] text-ink-2">
                سؤالك دخل الملف. بيتقرا الأول قبل ما يتنشر — ولو عبد العاطي
                شافه يستاهل، هتلاقيه في الحلقة الجاية.
              </p>
              <button
                onClick={() => setState("idle")}
                className="mt-7 border-2 border-ink px-6 py-3 font-display text-sm font-bold text-ink transition-colors hover:bg-duck"
              >
                قدّم طلب تاني
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={submit}
              className="relative pt-7"
            >
              {/* ١ — النوع */}
              <fieldset className="mb-7">
                <legend className="mb-3 font-display text-[10px] text-muted">
                  ١ — نوع الطلب
                </legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {CATEGORIES.map((c) => {
                    const active = category === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategory(c.id)}
                        aria-pressed={active}
                        className={`border px-3 py-3 text-center transition-all duration-200 ${
                          active
                            ? "border-ink bg-duck text-ink"
                            : "border-rule bg-[#FBF7EC] text-muted hover:border-faint hover:text-ink"
                        }`}
                      >
                        <span className="block font-display text-[13px] font-bold">
                          {c.label}
                        </span>
                        <span className="mt-0.5 block text-[10px] leading-tight opacity-75">
                          {c.hint}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* ٢ — النص */}
              <div className="mb-6">
                <label
                  htmlFor="q-body"
                  className="mb-2 block font-display text-[10px] text-muted"
                >
                  ٢ — نص الطلب
                </label>
                <textarea
                  id="q-body"
                  value={body}
                  onChange={(e) => setBody(e.target.value.slice(0, MAX))}
                  rows={5}
                  required
                    placeholder="مثلاً: لو الشركة عيلة زي ما الـHR بيقول، ينفع أطالب بنصيبي في الميراث؟"
                  className="field field-lined resize-none"
                />
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className={tooShort ? "text-stamp" : "text-faint"}>
                    {tooShort ? "كمّل شوية عشان نفهم قصدك" : " "}
                  </span>
                  <span className={`tnum ${remaining < 60 ? "text-stamp" : "text-faint"}`}>
                    {remaining}
                  </span>
                </div>
              </div>

              {/* ٣ — الهوية */}
              <div className="mb-6">
                <p className="mb-2 font-display text-[10px] text-muted">
                  ٣ — بيانات مقدّم الطلب
                </p>
                <label className="flex cursor-pointer items-start gap-3 border border-rule bg-[#FBF7EC] p-4 transition-colors hover:border-faint">
                  <input
                    type="checkbox"
                    checked={anon}
                    onChange={(e) => setAnon(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#A81E17]"
                  />
                  <span>
                    <span className="block font-display text-[14px] font-bold text-ink">
                      أقدّم الطلب بدون اسم
                    </span>
                    <span className="mt-0.5 block text-[12px] text-muted">
                      مش هنطلب إيميل ولا رقم. ولا حاجة.
                    </span>
                  </span>
                </label>
              </div>

              <AnimatePresence>
                {!anon && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 grid grid-cols-1 gap-3 overflow-hidden sm:grid-cols-2"
                  >
                    <div>
                      <label htmlFor="q-name" className="mb-2 block font-display text-[10px] text-muted">
                        الاسم (اختياري)
                      </label>
                      <input
                        id="q-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={40}
                        placeholder="——————"
                        className="field"
                      />
                    </div>
                    <div>
                      <label htmlFor="q-city" className="mb-2 block font-display text-[10px] text-muted">
                        الجهة (اختياري)
                      </label>
                      <input
                        id="q-city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        maxLength={40}
                        placeholder="——————"
                        className="field"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <input
                ref={honey}
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="pointer-events-none absolute h-0 w-0 opacity-0"
              />

              {error && (
                <p role="alert" className="mb-4 text-sm text-stamp">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={state === "sending" || body.trim().length < 10}
                className="w-full border-2 border-ink bg-duck py-4 font-display text-[15px] font-bold text-ink transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:border-rule disabled:bg-[#E9E1CB] disabled:text-faint disabled:hover:translate-y-0"
              >
                {state === "sending" ? "جارٍ التقييد..." : "قيّد الطلب في الملف"}
              </button>

              <p className="mt-4 border-t border-dashed border-rule pt-4 text-center font-display text-[10px] leading-[2] text-muted">
                كل طلب يُراجَع قبل النشر · لا تُحفَظ بياناتك · لا تُشارَك مع أحد
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
