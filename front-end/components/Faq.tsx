"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const QA = [
  {
    q: "سؤالي هيتقرا فعلاً؟",
    a: "أيوه. كل طلب بيعدي على حد بيقراه بعينه. مش كله بيتنشر، ومش كله بيتردّ عليه — بس كله بيتقرا.",
  },
  {
    q: "ممكن أقدّم من غير اسم؟",
    a: "دي الحالة الافتراضية أصلاً. مش بنطلب إيميل ولا رقم ولا حاجة. اكتب وامشي.",
  },
  {
    q: "ليه طلبي مظهرش في الملف؟",
    a: "يا إما لسه تحت المراجعة، يا إما فيه حاجة مينفعش تتنشر. مش شخصي، والله.",
  },
  {
    q: "أقدّم أكتر من طلب؟",
    a: "آه. بس مش خمستاشر في الدقيقة — في حد بيقرا، ارحمه.",
  },
  {
    q: "هو الاسم مش «مع كامل احترامي»؟",
    a: "كان. بقى «احطياتي». حرف واحد اتغيّر والدنيا اتقلبت.",
  },
  {
    q: "البطة بتقول إيه بالظبط؟",
    a: "مش هنقول. عشان كده هي بطة من الأساس.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="px-5 py-14 sm:px-8">
      <div className="sheet fibers mx-auto max-w-3xl px-6 py-9 sm:px-11 sm:py-11">

        <div className="border-b-2 border-ink pb-4">
          <p className="font-display text-[10px] font-bold text-stamp">
            حاشية الملف
          </p>
          <h2 className="mt-2 font-display text-[clamp(1.6rem,4.5vw,2.5rem)] font-bold leading-tight text-ink">
            أسئلة عن الأسئلة
          </h2>
        </div>

        <div className="divide-y divide-dashed divide-[color:var(--color-rule)]">
          {QA.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-5 py-5 text-right"
                  >
                    <span className="flex gap-3 font-display text-[16px] font-bold text-ink sm:text-[18px]">
                      <span className="text-faint">
                        {["١", "٢", "٣", "٤", "٥", "٦"][i]}.
                      </span>
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      className={`grid h-7 w-7 shrink-0 place-items-center border text-muted transition-all duration-300 ${
                        isOpen
                          ? "rotate-45 border-ink bg-duck text-ink"
                          : "border-rule"
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pr-7 text-[15.5px] leading-[2] text-ink-2">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
