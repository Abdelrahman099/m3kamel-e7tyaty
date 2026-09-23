import { CHANNEL_URL, TIKTOK_URL } from "@/lib/episodes";
import { DuckOutline } from "./marks";

const SOCIALS = [
  { label: "يوتيوب", href: CHANNEL_URL },
  { label: "تيك توك", href: TIKTOK_URL },
];

export default function Footer() {
  return (
    <footer className="px-5 pb-10 sm:px-8">
      <div className="sheet fibers mx-auto max-w-6xl px-6 py-8 sm:px-12">

        {/* سطر الإغلاق */}
        <div className="flex flex-wrap items-end justify-between gap-6 border-b-2 border-ink pb-6">
          <div className="flex items-center gap-3">
            <DuckOutline className="h-10 w-12 text-ink" weight={11} />
            <div>
              <p className="font-display text-lg font-bold leading-tight text-ink">
                مع كامل احطياتي
              </p>
              <p className="mt-0.5 font-display text-[11px] text-muted">
                محمد عبد العاطي
              </p>
            </div>
          </div>

          <nav aria-label="حسابات التواصل">
            <ul className="flex items-center gap-2">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border border-rule px-5 py-2.5 font-display text-[12.5px] text-muted transition-colors hover:border-ink hover:bg-duck hover:text-ink"
                  >
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* خانة التوقيع */}
        <div className="grid gap-6 pt-6 sm:grid-cols-3">
          <div className="font-display text-[10px] leading-[2.4] text-muted">
            توقيع المراجع: <span className="dotline inline-block w-24" />
            <br />
            التاريخ: <span className="dotline inline-block w-28" />
          </div>
          <p className="font-display text-[10px] leading-[2] text-muted sm:text-center">
            كل طلب يُراجَع قبل النشر.
            <br />
            واللي اتشطب، اتشطب لسبب.
          </p>
          <p className="font-display text-[10px] leading-[2] text-faint sm:text-left">
            © {new Date().getFullYear()} — مع كامل احطياتي
            <br />
            ملف رقم ٠٠١ · صفحة أخيرة
          </p>
        </div>
      </div>
    </footer>
  );
}
