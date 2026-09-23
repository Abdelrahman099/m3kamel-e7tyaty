"use client";

import { motion } from "framer-motion";
import Portrait from "./Portrait";
import { Paperclip } from "./marks";
import { useQuack } from "./useQuack";

const up = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.09,
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function Hero() {
  const quack = useQuack();
  return (
    <section id="main" className="relative px-5 pb-16 pt-20 sm:px-8 sm:pt-24">
      {/* لسان الفولدر */}
      <div className="mx-auto max-w-6xl">
        <div className="flex justify-end pr-8 sm:pr-16">
          <motion.div
            initial={{ y: -14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-t-xl bg-manila-2 px-9 py-2"
          >
            <span className="font-display text-xs font-bold text-ink">
              ملف رقم ٠٠١
            </span>
          </motion.div>
        </div>
      </div>

      {/* الورقة الكبيرة */}
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="sheet fibers mx-auto max-w-6xl px-6 py-9 sm:px-12 sm:py-12"
      >
        {/* ترويسة */}
        <div className="flex flex-wrap items-start justify-between gap-5 border-b-2 border-ink pb-5">
          <div>
            <p className="font-display text-[10px] font-bold text-muted">
              محضر استماع
            </p>
            <h1 className="mt-2 font-display text-[clamp(2.1rem,6.5vw,4.25rem)] font-bold leading-[1.05] text-ink">
              مع كامل احطياتي
            </h1>
          </div>
          <dl className="font-display text-[11px] leading-[2.1] text-muted sm:text-left">
            <div className="flex gap-2 sm:justify-end">
              <dt>الموضوع:</dt>
              <dd className="text-ink">أسئلة واردة من الجمهور</dd>
            </div>
            <div className="flex gap-2 sm:justify-end">
              <dt>الحالة:</dt>
              <dd className="text-stamp">تحت المراجعة</dd>
            </div>
            <div className="flex gap-2 sm:justify-end">
              <dt>المحرّر:</dt>
              <dd className="text-ink">محمد عبد العاطي</dd>
            </div>
          </dl>
        </div>

        {/* الجسم */}
        <div className="grid gap-10 pt-9 lg:grid-cols-[1fr_320px]">
          {/* المتن */}
          <div className="flex flex-col gap-6">
            <motion.p
              custom={0}
              variants={up}
              initial="hidden"
              animate="show"
              className="font-display text-[11px] font-bold text-stamp"
            >
              أولاً — بيان الاسم
            </motion.p>

            <motion.h2
              custom={1}
              variants={up}
              initial="hidden"
              animate="show"
              className="font-display text-[clamp(1.5rem,4.2vw,2.6rem)] font-bold leading-[1.45] text-ink"
            >
              الاسم السابق:{" "}
              <span className="struck">«مع كامل احترامي»</span>
              <br />
              الاسم الحالي:{" "}
              <span className="border-b-[3px] border-stamp">
                «مع كامل احطياتي»
              </span>
            </motion.h2>

            <motion.p
              custom={2}
              variants={up}
              initial="hidden"
              animate="show"
              className="max-w-xl text-[17px] leading-[2] text-ink-2"
            >
              بعد الاطّلاع على الهبد الوارد، وسماع أقوال البطة، تقرر فتح باب الأسئلة.
              قول اللي في دماغك؛ الكلام الـ{" "}
              <span className="redact font-semibold">
                <span>قليل الأدب</span>
              </span>{" "}
              البطة تتصرف فيه. وإحنا نثبت أقوالك في المحضر.
            </motion.p>

            {/* البنود */}
            <motion.ol
              custom={3}
              variants={up}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-2.5 text-[16px] leading-[1.8]"
            >
              {[
                "السؤال الغريب مقبول.",
                "الاسم اختياري. وغالبًا مش هتقوله.",
                "البطة تتولى ما لا يُقال.",
              ].map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className="font-display font-bold text-stamp">
                    {["١", "٢", "٣"][i]} —
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </motion.ol>

            <motion.div
              custom={4}
              variants={up}
              initial="hidden"
              animate="show"
              className="mt-2 flex flex-wrap items-center gap-4"
            >
              <a
                href="#ask"
                className="border-2 border-ink bg-duck px-8 py-4 font-display text-[15px] font-bold text-ink transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                قيّد سؤالك في الملف
              </a>
              <span className="font-display text-[11px] text-faint">
                التقييد لا يعني النشر
              </span>
            </motion.div>
          </div>

          {/* عمود الحِرز */}
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5"
          >
            <div className="relative">
              <div className="relative border border-faint bg-paper p-2 shadow-[5px_6px_0_rgba(60,45,20,0.12)] -rotate-2">
                <span className="absolute top-4 right-4 z-10 font-display text-[9px] text-muted">مرفق أ / صورة صاحب الأقوال</span>
                <Portrait ratio="3/4" bg="#DED5BE" />
                <span className="stamp absolute bottom-7 -left-3 rotate-[-12deg] px-3 py-1 text-[13px]">حاضر بأقواله</span>
              </div>
              <Paperclip className="absolute -top-5 right-6 h-16 w-8" />
              <p className="mt-2.5 text-center font-display text-[10px] text-muted">
                حِرز ١ — المتحدث
              </p>
            </div>

            {/* ختم البطة */}
            <div className="flex justify-center">
              <button type="button" onClick={quack} aria-label="اسمع كواكة بطة الرقابة" className="flex items-center gap-3 border-2 border-dashed border-stamp px-4 py-2 -rotate-3 transition-transform hover:rotate-0 focus-visible:outline-2 focus-visible:outline-ink">
                <img src="/images/duck-emblem.png" alt="بطة اللودر بالكاب والدقن" width={72} height={72} className="h-[72px] w-[72px] rounded-full" />
                <span className="text-right font-display text-stamp"><span className="block text-[13px] font-bold">مأمور الرقابة</span><span className="text-[10px]">دوس… والباقي كواك.</span></span>
              </button>
            </div>

            <div className="mt-auto border-t border-dashed border-rule pt-4 font-display text-[10px] leading-[2] text-muted">
              توقيع المراجع: <span className="dotline inline-block w-20" />
              <br />
              التاريخ: <span className="dotline inline-block w-24" />
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </section>
  );
}
