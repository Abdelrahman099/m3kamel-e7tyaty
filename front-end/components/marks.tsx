/**
 * علامات صغيرة بتتكرر في الملف — مشبك، بطة مرسومة، ختم.
 * كلها SVG inline عشان تاخد لون النص وتتصغّر من غير ما تتكسر.
 */

export function Paperclip({
  className = "",
  color = "#6E6957",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 40 74" className={className} aria-hidden="true">
      <path
        d="M12 66 L12 16 A8 8 0 0 1 28 16 L28 58 A5 5 0 0 1 18 58 L18 22"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** البطة كرسمة حبر — الشكل الأساسي في الملف */
export function DuckOutline({
  className = "",
  color = "currentColor",
  weight = 10,
}: {
  className?: string;
  color?: string;
  weight?: number;
}) {
  return (
    <svg viewBox="0 0 230 200" className={className} aria-hidden="true">
      <g
        fill="none"
        stroke={color}
        strokeWidth={weight}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <ellipse cx="100" cy="130" rx="64" ry="48" />
        <circle cx="146" cy="70" r="34" />
        <path d="M178 70 L214 81 L178 92 Z" />
        <path d="M36 112 L8 88 L42 132" />
      </g>
      <circle cx="157" cy="60" r="7" fill={color} />
    </svg>
  );
}

/** البطة مصمتة — للأماكن اللي محتاجة اللون الأصفر */
export function DuckSolid({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 230 200" className={className} aria-hidden="true">
      <ellipse cx="100" cy="130" rx="66" ry="50" fill="#FFCE3E" />
      <path d="M34 112 L6 88 L40 134 Z" fill="#E0AE1C" />
      <ellipse cx="90" cy="136" rx="30" ry="15" fill="#E0AE1C" />
      <circle cx="146" cy="70" r="35" fill="#FFCE3E" />
      <path d="M178 62 L218 72 L178 84 Z" fill="#FF8A1F" />
      <circle cx="155" cy="57" r="8" fill="#FFFFFF" />
      <circle cx="157" cy="57" r="4" fill="#241F17" />
    </svg>
  );
}
