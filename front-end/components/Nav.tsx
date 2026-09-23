"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LINKS = [
  { href: "#about", label: "أولاً: البيان" },
  { href: "#ask", label: "ثانياً: التقديم" },
  { href: "#statements", label: "ثالثاً: الأقوال" },
  { href: "#exhibits", label: "رابعاً: الأحراز" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-manila/95 shadow-[0_2px_0_rgba(60,45,20,0.18)] backdrop-blur" : ""
      }`}
    >
      <nav
        aria-label="أقسام الملف"
        className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8"
      >
        <a href="#main" className="group flex items-center gap-2.5">
          <img src="/images/duck-emblem.png" alt="" width={44} height={44} className="h-11 w-11 rounded-full border border-rule transition-transform duration-300 group-hover:-rotate-12" />
          <span className="font-display text-[15px] font-bold leading-none text-ink">
            مع كامل احطياتي
          </span>
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-display text-[12.5px] text-muted transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#ask"
              className="border-2 border-ink bg-duck px-4 py-2 font-display text-[12.5px] font-bold text-ink transition-transform duration-200 hover:-translate-y-0.5"
            >
              قيّد سؤالك
            </a>
          </li>
        </ul>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
        >
          <span className={`block h-0.5 w-5 bg-ink transition-transform duration-300 ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-5 bg-ink transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-ink transition-transform duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </nav>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden border-t border-rule bg-manila lg:hidden"
      >
        <ul className="flex flex-col px-5 py-4 sm:px-8">
          {LINKS.map((l) => (
            <li key={l.href} className="border-b border-dashed border-rule last:border-0">
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3.5 font-display text-base font-bold text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="pt-4">
            <a
              href="#ask"
              onClick={() => setOpen(false)}
              className="block border-2 border-ink bg-duck py-3 text-center font-display font-bold text-ink"
            >
              قيّد سؤالك
            </a>
          </li>
        </ul>
      </motion.div>
    </motion.header>
  );
}
