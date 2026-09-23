import { NextResponse } from "next/server";
import { z } from "zod";
import { addQuestion, countAll } from "@/lib/store";
import { CATEGORIES } from "@/lib/types";

const categoryIds = CATEGORIES.map((c) => c.id) as [string, ...string[]];

const schema = z.object({
  body: z
    .string()
    .trim()
    .min(10, "السؤال قصير أوي — اكتب شوية كمان")
    .max(600, "السؤال طويل أوي — قصّره شوية"),
  category: z.enum(categoryIds),
  name: z.string().trim().max(40).optional().or(z.literal("")),
  city: z.string().trim().max(40).optional().or(z.literal("")),
  // حقل فخ للبوتس — المفروض يفضل فاضي
  website: z.string().max(0).optional().or(z.literal("")),
});

// rate limit بسيط في الذاكرة (لكل instance)
const hits = new Map<string, { n: number; reset: number }>();
const WINDOW = 60_000;
const MAX = 5;

function limited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.reset) {
    hits.set(ip, { n: 1, reset: now + WINDOW });
    return false;
  }
  rec.n += 1;
  return rec.n > MAX;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (limited(ip)) {
    return NextResponse.json(
      { ok: false, error: "على مهلك شوية — استنى دقيقة وجرب تاني." },
      { status: 429 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "طلب غير صالح" }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "في حاجة ناقصة" },
      { status: 400 }
    );
  }

  const { body, category, name, city, website } = parsed.data;

  // البوت وقع في الفخ — نرد نجاح من غير ما نخزّن
  if (website) return NextResponse.json({ ok: true, queued: true });

  const q = await addQuestion({
    body,
    category: category as never,
    name: name?.trim() ? name.trim() : null,
    city: city?.trim() ? city.trim() : null,
  });

  return NextResponse.json({ ok: true, id: q.id, queued: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, total: await countAll() });
}
