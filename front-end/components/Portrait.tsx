"use client";

import { useEffect, useRef, useState } from "react";

const PHOTO = "/images/abdelaty-cutout.webp";

type Props = {
  ratio?: string;
  className?: string;
  skin?: string;
  hair?: string;
  shirt?: string;
  bg?: string;
};

/**
 * صورة عبد العاطي.
 *
 * صورة حقيقية من القناة، مفرغة الخلفية ومحفوظة محلياً.
 * لو مفيش بيرسم بورتريه متّجه بدالها — أصلع، دقن كثيفة، قدام مايك —
 * بنفس المقاسات بالظبط، فالاستبدال مش بيحرّك أي حاجة في اللياوت.
 *
 * الرسم مقصوص قريّب (راس وكتوف) وبتباين عالي عشان يتقري من بعيد.
 */
export default function Portrait({
  ratio = "3/4",
  className = "",
  skin = "#C9A579",
  hair = "#1A160F",
  shirt = "#2E6F68",
  bg = "#DED5BE",
}: Props) {
  const [noPhoto, setNoPhoto] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // الصورة بتفشل قبل ما React يعمل hydrate، يعني onError بيفوت وبنفضل
  // شايفين أيقونة الصورة المكسورة. فبنتأكد بنفسنا بعد الـ mount:
  // complete + naturalWidth === 0 معناها إن الملف مش موجود.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) setNoPhoto(true);
  }, []);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: ratio, background: bg }}
    >
      {!noPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={PHOTO}
          alt="محمد عبد العاطي"
          onError={() => setNoPhoto(true)}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-contain object-bottom"
          style={{ filter: "grayscale(0.25) contrast(1.06) sepia(0.08) drop-shadow(7px 5px 0 rgba(70,45,20,0.13))" }}
        />
      ) : (
        <svg
          viewBox="0 0 300 400"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="رسم لمحمد عبد العاطي أمام المايك"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* خلفية استوديو — أغمق في الأطراف */}
          <defs>
            <radialGradient id="pv" cx="50%" cy="38%" r="72%">
              <stop offset="0%" stopColor="#E7DFC9" />
              <stop offset="100%" stopColor="#C6BCA1" />
            </radialGradient>
          </defs>
          <rect width="300" height="400" fill="url(#pv)" />

          {/* الكتوف */}
          <path
            d="M-12 400 C-12 322 58 290 150 290 C242 290 312 322 312 400 Z"
            fill={shirt}
          />
          {/* الرقبة */}
          <path d="M120 232 h60 v66 h-60 Z" fill={skin} opacity="0.85" />

          {/* الودان */}
          <ellipse cx="66" cy="164" rx="15" ry="24" fill={skin} />
          <ellipse cx="234" cy="164" rx="15" ry="24" fill={skin} />

          {/* الراس */}
          <ellipse cx="150" cy="152" rx="83" ry="97" fill={skin} />

          {/* الدقن — أكثف حاجة في الوش */}
          <path
            d="M72 148 C68 226 104 286 150 290 C196 286 232 226 228 148
               C223 204 196 216 150 216 C104 216 77 204 72 148 Z"
            fill={hair}
          />
          {/* الشنب */}
          <path
            d="M112 192 C128 181 172 181 188 192 C172 205 128 205 112 192 Z"
            fill={hair}
          />

          {/* الحواجب */}
          <rect x="92" y="116" width="50" height="13" rx="6.5" fill={hair} />
          <rect x="158" y="116" width="50" height="13" rx="6.5" fill={hair} />

          {/* العينين */}
          <ellipse cx="117" cy="147" rx="15" ry="10" fill="#F6F1E2" />
          <ellipse cx="183" cy="147" rx="15" ry="10" fill="#F6F1E2" />
          <circle cx="118" cy="147" r="6.4" fill={hair} />
          <circle cx="184" cy="147" r="6.4" fill={hair} />
          <circle cx="120" cy="144.5" r="2" fill="#FFFFFF" />
          <circle cx="186" cy="144.5" r="2" fill="#FFFFFF" />

          {/* المناخير */}
          <path
            d="M150 146 L139 176 q11 6 22 0 Z"
            fill={skin}
            opacity="0.55"
          />

          {/* المايك */}
          <rect x="124" y="318" width="52" height="82" rx="26" fill="#211D16" />
          <g opacity="0.45">
            <rect x="132" y="332" width="36" height="4" rx="2" fill="#6E6350" />
            <rect x="132" y="344" width="36" height="4" rx="2" fill="#6E6350" />
            <rect x="132" y="356" width="36" height="4" rx="2" fill="#6E6350" />
          </g>
        </svg>
      )}
    </div>
  );
}
