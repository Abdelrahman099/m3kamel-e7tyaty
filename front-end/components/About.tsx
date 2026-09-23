"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { DuckOutline } from "./marks";

function Counter({
  to,
  suffix = "",
  decimals = 0,
}: {
  to: number;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1300);
      setN(to * (p === 1 ? 1 : 1 - Math.pow(2, -10 * p)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref} className="tnum">
      {n.toFixed(decimals)}
      {suffix}
    </span>
  );
}

const RECORD = [
  { k: "الاسم", v: "محمد محمد عبد العاطي طه" },
  { k: "المهنة", v: "بيقول اللي الناس بتقوله في سرها" },
  { k: "علامة مميزة", v: "صلعة، دقن، تخين ❤️، مايك، وقليل الأدب" },
  { k: "الأداة", v: "بطة" },
  { k: "عاد للعمل", v: "يونيو ٢٠٢٦ — أول ضيف: هشام ماجد" },
];

const STATS = [
  { value: 1.6, suffix: " م", decimals: 1, label: "متابع", note: "ومش فاهمين ليه" },
  { value: 98, suffix: " م", decimals: 0, label: "مشاهدة", note: "نص الأمة" },
  { value: 1, suffix: "", decimals: 0, label: "بطة", note: "بس شغّالة بجد" },
  { value: 0, suffix: "", decimals: 0, label: "اعتذار", note: "مع كامل احطياتي" },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-20 px-5 py-14 sm:px-8">
      <div className="sheet fibers sheet-tilt-a mx-auto max-w-6xl px-6 py-9 sm:px-12 sm:py-11">

        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b-2 border-ink pb-4">
          <div>
            <p className="font-display text-[10px] font-bold text-stamp">
              ثانياً — ملف المتحدث
            </p>
            <h2 className="mt-2 font-display text-[clamp(1.6rem,4.5vw,2.75rem)] font-bold leading-tight text-ink">
              إثبات شخصية وسماع أقوال
            </h2>
          </div>
          <span className="font-display text-[11px] text-muted">صفحة ٢ من الملف</span>
        </div>

        <div className="grid gap-9 pt-8 lg:grid-cols-[1.35fr_1fr]">
          {/* السرد */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5 text-[17px] leading-[2.05] text-ink-2"
          >
            <p className="font-display text-[10px] text-muted">محضر هزلي — صياغة للموقع، مش أقوال حقيقية</p>
            <p className="border-b border-dashed border-rule pb-4">
              أُثبت حضور المذكور، وبحوزته مايك وبطة. وبسؤاله عمّا يصدر عنه، جرى الآتي:
            </p>
            <dl className="space-y-5">
              <div>
                <dt className="font-bold text-ink"><span className="text-stamp">س:</span> طبيعة شغلك إيه؟</dt>
                <dd><span className="font-bold text-stamp">ج:</span> بتكلم في المايك. لو الكلام عجب الناس يبقى محتوى، لو معجبهمش يبقى أقوال.</dd>
              </div>
              <div>
                <dt className="font-bold text-ink"><span className="text-stamp">س:</span> والبطة دي بتعمل إيه؟</dt>
                <dd><span className="font-bold text-stamp">ج:</span> بتشتم بدالي. أنا بقبض وهي بتشيل الليلة.</dd>
              </div>
              <div>
                <dt className="font-bold text-ink"><span className="text-stamp">س:</span> اسم البرنامج؟</dt>
                <dd><span className="font-bold text-stamp">ج:</span> مع كامل احطياتي. والاسم القديم موجود عند حضراتكم في الورق.</dd>
              </div>
              <div>
                <dt className="font-bold text-ink"><span className="text-stamp">س:</span> عندك أقوال تانية؟</dt>
                <dd><span className="font-bold text-stamp">ج:</span> عندي، بس نستنى البطة ترجع من الحمّام.</dd>
              </div>
            </dl>
            <p className="border-t border-dashed border-rule pt-4 font-display text-[11px] text-stamp">تم إثبات ما سبق. امتنعت البطة عن التوقيع.</p>

            {/* الأرقام */}
            <div className="mt-3 grid grid-cols-2 gap-5 border-t border-dashed border-rule pt-6 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-[26px] font-bold leading-none text-ink">
                    <Counter to={s.value} suffix={s.suffix} decimals={s.decimals} />
                  </p>
                  <p className="mt-1.5 font-display text-[13px] font-bold text-ink-2">
                    {s.label}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-tight text-faint">
                    {s.note}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* بيانات الحرز */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="sheet-2 border border-rule p-6"
          >
            <p className="font-display text-[10px] font-bold text-stamp">
              بيانات مستخرجة
            </p>

            <dl className="mt-4 divide-y divide-dashed divide-[color:var(--color-rule)]">
              {RECORD.map((r) => (
                <div key={r.k} className="py-3">
                  <dt className="font-display text-[10px] text-muted">
                    {r.k}
                  </dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-ink">
                    {r.v}
                  </dd>
                </div>
              ))}
              <div className="py-3">
                <dt className="font-display text-[10px] text-muted">
                  سبب تغيير الاسم
                </dt>
                <dd className="mt-1">
                  <span className="redact text-[15px] font-semibold">
                    <span>معروف للجميع</span>
                  </span>
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex items-center gap-3 border-t border-rule pt-5">
              <DuckOutline className="h-9 w-11 shrink-0 text-ink" weight={12} />
              <p className="text-[13px] leading-relaxed text-muted">
                الأداة المستخدمة في التغطية — مرفقة بالملف
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
