"use client";

import { motion } from "framer-motion";
import { EPISODES, CHANNEL_URL } from "@/lib/episodes";

export default function Episodes() {
  return (
    <section id="exhibits" className="scroll-mt-20 px-5 py-14 sm:px-8">
      <div className="sheet fibers mx-auto max-w-6xl px-6 py-9 sm:px-12 sm:py-11">

        <div className="flex flex-wrap items-end justify-between gap-5 border-b-2 border-ink pb-4">
          <div>
            <p className="font-display text-[10px] font-bold text-stamp">
              سادساً — الأحراز المرفقة
            </p>
            <h2 className="mt-2 font-display text-[clamp(1.6rem,4.5vw,2.5rem)] font-bold leading-tight text-ink">
              حلقات فاتت
            </h2>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">
              لو لسه متعرفوش، ابدأ من هنا. ولو عارفه، اتفرج تاني — هتلاقي حاجة
              فاتتك.
            </p>
          </div>
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-ink px-6 py-3 font-display text-[13px] font-bold text-ink transition-colors hover:bg-duck"
          >
            الأرشيف كامل ↗
          </a>
        </div>

        <ol className="divide-y divide-dashed divide-[color:var(--color-rule)] pt-3">
          {EPISODES.map((ep, i) => (
            <motion.li
              key={ep.url}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.45,
                delay: Math.min(i, 5) * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <a
                href={ep.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-5 py-4 transition-colors hover:bg-[#EDE5D2]"
              >
                <span className="tnum w-10 shrink-0 font-display text-[13px] text-faint">
                  {(i + 1).toLocaleString("ar-EG", { minimumIntegerDigits: 2 })}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[17px] font-bold leading-snug text-ink transition-colors group-hover:text-stamp sm:text-[19px]">
                    {ep.title}
                  </span>
                  <span className="mt-0.5 block font-display text-[10px] text-muted">
                    {ep.kind === "short" ? "مقطع قصير" : "حلقة كاملة"}
                    {ep.views && (
                      <>
                        {" · "}
                        <span className="tnum">{ep.views}</span> مشاهدة
                      </>
                    )}
                  </span>
                </span>

                <span
                  aria-hidden
                  className="grid h-9 w-9 shrink-0 place-items-center border border-rule text-muted transition-all duration-200 group-hover:border-ink group-hover:bg-duck group-hover:text-ink"
                >
                  ↖
                </span>
              </a>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
