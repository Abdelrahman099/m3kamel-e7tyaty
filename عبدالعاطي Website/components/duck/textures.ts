import * as THREE from "three";

/**
 * الخامات بتترسم على canvas وقت التشغيل — مفيش صور بتتحمّل.
 *
 * كل الأجسام كرات، فالـ UV بتاعها equirectangular:
 *   u = 0.50 → الوش (+X) — ده اللي البطة باصّة ناحيته
 *   u = 0.25 → الجنب الشمال (+Z)
 *   u = 0.75 → الجنب اليمين (−Z)
 *   v (من فوق لتحت في الـ canvas) = الزاوية من القطب الشمالي / π
 * واتأكدنا إن الكلام بيتقري من الناحيتين من غير ما يتعكس.
 */

const DUCK = "#FFC628";
const DUCK_DEEP = "#F6B51D";
const INK = "rgba(22, 18, 26, 0.9)";

function canvas(w: number, h: number) {
  const el = document.createElement("canvas");
  el.width = w;
  el.height = h;
  const ctx = el.getContext("2d")!;
  // الصفحة RTL — الـ canvas بيورث الاتجاه ده لو ماحددناش
  ctx.direction = "ltr";
  return { el, ctx };
}

function toTexture(el: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(el);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/* ============================================================
   زخارف الوشم
   ============================================================ */

function curl(ctx: CanvasRenderingContext2D, x: number, y: number, dir: 1 | -1, s: number) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(x + dir * s * 0.9, y - s * 0.2, x + dir * s * 1.1, y - s * 1.1, x + dir * s * 0.45, y - s * 1.05);
  ctx.bezierCurveTo(x + dir * s * 0.05, y - s * 1.0, x + dir * s * 0.1, y - s * 0.55, x + dir * s * 0.45, y - s * 0.6);
  ctx.stroke();
}

function star(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.42;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}

function crown(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  const h = w * 0.66;
  const top = y - h / 2;
  const base = y + h * 0.22;

  // جسم التاج — ٥ أسنان، اللي في النص أعلى
  ctx.beginPath();
  ctx.moveTo(x - w / 2, base);
  ctx.lineTo(x - w * 0.5, top + h * 0.28);
  ctx.lineTo(x - w * 0.34, top + h * 0.5);
  ctx.lineTo(x - w * 0.24, top + h * 0.1);
  ctx.lineTo(x - w * 0.12, top + h * 0.46);
  ctx.lineTo(x, top);
  ctx.lineTo(x + w * 0.12, top + h * 0.46);
  ctx.lineTo(x + w * 0.24, top + h * 0.1);
  ctx.lineTo(x + w * 0.34, top + h * 0.5);
  ctx.lineTo(x + w * 0.5, top + h * 0.28);
  ctx.lineTo(x + w / 2, base);
  ctx.closePath();
  ctx.lineWidth = w * 0.035;
  ctx.stroke();

  // تظليل خطوط جوه التاج — أسلوب وشم مش رسمة مصمتة
  ctx.save();
  ctx.clip();
  ctx.lineWidth = w * 0.012;
  for (let i = -8; i < 14; i++) {
    ctx.beginPath();
    ctx.moveTo(x - w / 2 + i * w * 0.07, base);
    ctx.lineTo(x - w / 2 + i * w * 0.07 + h, base - h);
    ctx.stroke();
  }
  ctx.restore();

  // الحزام
  ctx.fillRect(x - w * 0.52, base, w * 1.04, h * 0.16);

  // الجواهر على الأسنان
  ctx.lineWidth = w * 0.022;
  for (const [px, py] of [
    [x - w * 0.24, top + h * 0.1],
    [x, top],
    [x + w * 0.24, top + h * 0.1],
  ]) {
    ctx.beginPath();
    ctx.arc(px, py - h * 0.06, w * 0.045, 0, Math.PI * 2);
    ctx.stroke();
  }
}

/* ============================================================
   الجسم — «Hustler» على الصدر
   ============================================================ */

function paintBody(ctx: CanvasRenderingContext2D, W: number, H: number, family: string) {
  ctx.fillStyle = DUCK;
  ctx.fillRect(0, 0, W, H);

  const cx = W * 0.5;
  const cy = H * 0.585;
  const size = Math.round(H * 0.13);

  ctx.save();
  ctx.fillStyle = INK;
  ctx.strokeStyle = INK;
  ctx.lineCap = "round";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${size}px ${family}`;
  ctx.fillText("Hustler", cx, cy);

  // الشريط الملفوف تحت الكلمة
  ctx.lineWidth = H * 0.005;
  const half = size * 1.55;
  ctx.beginPath();
  ctx.moveTo(cx - half, cy + size * 0.55);
  ctx.bezierCurveTo(
    cx - half * 0.45, cy + size * 0.85,
    cx + half * 0.45, cy + size * 0.3,
    cx + half, cy + size * 0.55
  );
  ctx.stroke();
  curl(ctx, cx - half, cy + size * 0.55, -1, size * 0.34);
  curl(ctx, cx + half, cy + size * 0.55, 1, size * 0.34);

  // نجوم فوق
  star(ctx, cx - half * 0.78, cy - size * 0.72, size * 0.11);
  star(ctx, cx + half * 0.78, cy - size * 0.72, size * 0.11);
  star(ctx, cx, cy - size * 0.9, size * 0.07);
  ctx.restore();
}

/* ============================================================
   الجناح — تاج + زخارف
   ============================================================ */

function paintWing(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.fillStyle = DUCK_DEEP;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = INK;
  ctx.strokeStyle = INK;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // نفس الرسمة على الجناحين: u=0.25 (+Z) و u=0.75 (−Z)
  for (const u of [0.25, 0.75]) {
    const x = W * u;
    const y = H * 0.47;
    const w = W * 0.11;
    crown(ctx, x, y, w);

    ctx.lineWidth = w * 0.03;
    curl(ctx, x - w * 0.62, y + w * 0.2, -1, w * 0.42);
    curl(ctx, x + w * 0.62, y + w * 0.2, 1, w * 0.42);
    star(ctx, x, y + w * 0.62, w * 0.09);
  }
}

/* ============================================================
   الكمامة — قماش أبيض عليه بطط صغيرة وثنيات
   ============================================================ */

function miniDuck(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.fillStyle = "#F9C22A";
  ctx.beginPath();
  ctx.ellipse(x, y, s, s * 0.68, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + s * 0.6, y - s * 0.62, s * 0.46, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#F07F1C";
  ctx.beginPath();
  ctx.moveTo(x + s * 0.98, y - s * 0.66);
  ctx.lineTo(x + s * 1.4, y - s * 0.56);
  ctx.lineTo(x + s * 0.98, y - s * 0.44);
  ctx.fill();
  ctx.fillStyle = "#2A2118";
  ctx.beginPath();
  ctx.arc(x + s * 0.72, y - s * 0.74, s * 0.09, 0, Math.PI * 2);
  ctx.fill();
}

function paintMask(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.fillStyle = "#F3F0E9";
  ctx.fillRect(0, 0, W, H);

  // نسيج القماش — نقط عشوائية خفيفة جدًا
  for (let i = 0; i < 14000; i++) {
    const g = Math.random() < 0.5 ? 0 : 255;
    ctx.fillStyle = `rgba(${g},${g},${g},${0.03 + Math.random() * 0.03})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, 1.5, 1.5);
  }

  // بطط الطبعة
  const step = 58;
  for (let row = 0; row * step * 0.82 < H + step; row++) {
    for (let col = -1; col * step < W + step; col++) {
      const x = col * step + (row % 2 ? step / 2 : 0);
      const y = row * step * 0.82;
      miniDuck(ctx, x, y, 12);
    }
  }

  // الثنيات الأفقية — ظل تحت، ولمعة فوق
  for (const py of [0.41, 0.5, 0.59]) {
    const y = py * H;
    const grad = ctx.createLinearGradient(0, y - 12, 0, y + 12);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(0.45, "rgba(60,50,40,0.22)");
    grad.addColorStop(0.55, "rgba(255,255,255,0.5)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, y - 12, W, 24);
  }
}

/* ============================================================
   الكاب — تويد بورجوندي بـ ٨ قطع
   ============================================================ */

function paintCap(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.fillStyle = "#7A2331";
  ctx.fillRect(0, 0, W, H);

  // نسيج التويد — شرط صغيرة فاتحة وغامقة في كل الاتجاهات
  for (let i = 0; i < 26000; i++) {
    const light = Math.random() < 0.45;
    ctx.strokeStyle = light
      ? `rgba(196,110,120,${0.08 + Math.random() * 0.12})`
      : `rgba(40,8,14,${0.1 + Math.random() * 0.16})`;
    ctx.lineWidth = 1 + Math.random();
    const x = Math.random() * W;
    const y = Math.random() * H;
    const a = Math.random() < 0.5 ? 0.78 : -0.78;
    const l = 3 + Math.random() * 5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
    ctx.stroke();
  }

  // الخياطة بين القطع — خطوط طولية بتتقابل عند الزرار فوق
  for (let k = 0; k < 8; k++) {
    const x = (k / 8) * W;
    ctx.fillStyle = "rgba(30,6,12,0.55)";
    ctx.fillRect(x - 2, 0, 4, H);
    ctx.fillStyle = "rgba(210,140,150,0.25)";
    ctx.fillRect(x + 3, 0, 1.5, H);
  }
}

/* ============================================================
   التجميع
   ============================================================ */

export type DuckTextures = {
  body: THREE.CanvasTexture;
  wing: THREE.CanvasTexture;
  mask: THREE.CanvasTexture;
  cap: THREE.CanvasTexture;
  /** يعيد رسم الوشم بعد ما خط الـ blackletter يتحمّل */
  paintTattoos: (family: string) => void;
  dispose: () => void;
};

export function createDuckTextures(): DuckTextures {
  const body = canvas(2048, 1024);
  const wing = canvas(1024, 512);
  const mask = canvas(1024, 512);
  const cap = canvas(1024, 512);

  // أول رسمة بخط احتياطي لحد ما الـ blackletter يوصل
  paintBody(body.ctx, 2048, 1024, "Georgia, serif");
  paintWing(wing.ctx, 1024, 512);
  paintMask(mask.ctx, 1024, 512);
  paintCap(cap.ctx, 1024, 512);

  const t = {
    body: toTexture(body.el),
    wing: toTexture(wing.el),
    mask: toTexture(mask.el),
    cap: toTexture(cap.el),
  };

  return {
    ...t,
    paintTattoos(family: string) {
      paintBody(body.ctx, 2048, 1024, family);
      t.body.needsUpdate = true;
    },
    dispose() {
      t.body.dispose();
      t.wing.dispose();
      t.mask.dispose();
      t.cap.dispose();
    },
  };
}
