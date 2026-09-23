"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CATEGORIES, type CategoryId } from "@/lib/types";
import { EXAMPLES } from "@/lib/examples";
import { Paperclip } from "./marks";
import { useQuack } from "./useQuack";

type Card = {
  id: string;
  body: string;
  category: CategoryId;
  name: string | null;
  city: string | null;
  isExample: boolean;
  topic?: string;
};

const FILTERS = [{ id: "all" as const, label: "الكل" }, ...CATEGORIES];

function label(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export default function QuestionWall({ real = [] }: { real?: Card[] }) {
  const [filter, setFilter] = useState<CategoryId | "all">("all");
  const quack = useQuack();

  const cards = useMemo<Card[]>(() => {
    const examples: Card[] = EXAMPLES.map((e) => ({ ...e, isExample: true }));
    return [...real, ...examples];
  }, [real]);

  const shown = cards.filter((c) => filter === "all" || c.category === filter);

  return (
    <section id="statements" className="scroll-mt-20 px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-6xl">

        {/* ترويسة القسم */}
        <div className="sheet fibers mb-7 px-6 py-6 sm:px-10">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <p className="font-display text-[10px] font-bold text-stamp">
                رابعاً — أقوال الواردين
              </p>
              <h2 className="mt-2 font-display text-[clamp(1.6rem,4.5vw,2.5rem)] font-bold leading-tight text-ink">
                اللي الناس بتسأله
              </h2>
              <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-muted">
                أُرفقت الأقوال التالية دون تحمّل مسؤولية اللي في دماغ أصحابها.
                النماذج مكتوبة للموقع. دوس على الشطب؛ البطة هترد.
              </p>
            </div>

            <div role="tablist" aria-label="فلترة الأقوال" className="flex flex-wrap gap-1.5">
              {FILTERS.map((f) => {
                const active = filter === f.id;
                return (
                  <button
                    key={f.id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(f.id as CategoryId | "all")}
                    className={`border px-3.5 py-1.5 font-display text-[12px] font-bold transition-all duration-200 ${
                      active
                        ? "border-ink bg-duck text-ink"
                        : "border-rule text-muted hover:border-faint hover:text-ink"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* الأقوال — ورق مكدّس */}
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {shown.map((q, i) => (
            <motion.article
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: (i % 6) * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`sheet fibers group relative mb-5 inline-block w-full break-inside-avoid px-5 pb-5 pt-7 transition-transform duration-300 hover:-translate-y-1 ${
                i % 3 === 0 ? "sheet-tilt-a" : i % 3 === 2 ? "sheet-tilt-b" : ""
              }`}
            >
              <Paperclip className="absolute -top-4 left-5 h-12 w-6" />

              <div className="mb-3 flex items-center justify-between gap-2 border-b border-dashed border-rule pb-2.5">
                <span className="font-display text-[10px] font-bold text-stamp">
                  {label(q.category)}{q.topic ? ` / ${q.topic}` : ""}
                </span>
                {q.isExample && (
                  <span className="border border-rule px-2 py-0.5 font-display text-[9px] text-faint">
                    نموذج
                  </span>
                )}
              </div>

              <p className="text-[15.5px] leading-[1.95] text-ink">
                {q.isExample ? q.body.split(/(\[\[.*?\]\])/g).map((part, index) =>
                  part.startsWith("[[") && part.endsWith("]]" ) ? (
                    <button
                      key={index}
                      type="button"
                      onClick={quack}
                      className="censored-word"
                      aria-label="لفظ مشطوب — اسمع البطة"
                    ><span aria-hidden="true">{part.slice(2, -2)}</span></button>
                  ) : part
                ) : q.body}
              </p>

              <footer className="mt-4 flex items-center justify-between border-t border-dashed border-rule pt-3 font-display text-[10px] text-muted">
                <span>{q.name ?? "مجهول"}{q.city ? ` — ${q.city}` : ""}</span>
                <span className="tnum">حِرز {(cards.findIndex((card) => card.id === q.id) + 2).toLocaleString("ar-EG", { minimumIntegerDigits: 2 })}</span>
              </footer>
            </motion.article>
          ))}
        </div>

        {shown.length === 0 && (
          <p className="sheet px-6 py-14 text-center text-muted">
            مفيش أقوال في القسم ده لسه. قدّم إنت أول طلب.
          </p>
        )}

        <div className="mt-8 text-center">
          <a
            href="#ask"
            className="inline-block border-2 border-ink px-8 py-4 font-display text-[15px] font-bold text-ink transition-colors hover:bg-duck"
          >
            ضيف قولك للملف
          </a>
        </div>
      </div>
    </section>
  );
}
