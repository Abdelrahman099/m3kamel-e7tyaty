import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Question, CategoryId } from "./types";

const FILE = path.join(process.cwd(), "data", "submissions.json");

/**
 * تخزين على ملف — كفاية للتطوير وللإطلاق الأولي.
 * لما الأعداد تكبر: بدّل الدالتين دول بـ Supabase/Postgres والباقي مش هيتغير.
 */
async function readAll(): Promise<Question[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return JSON.parse(raw) as Question[];
  } catch {
    return [];
  }
}

async function writeAll(rows: Question[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(rows, null, 2), "utf8");
}

export async function addQuestion(input: {
  body: string;
  category: CategoryId;
  name: string | null;
  city: string | null;
}): Promise<Question> {
  const rows = await readAll();
  const q: Question = {
    id: randomUUID(),
    body: input.body,
    category: input.category,
    name: input.name,
    city: input.city,
    // كل سؤال بيدخل طابور المراجعة — مفيش حاجة بتتنشر لوحدها
    status: "pending",
    createdAt: new Date().toISOString(),
    votes: 0,
  };
  rows.unshift(q);
  await writeAll(rows);
  return q;
}

/** اللي بيتعرض على الموقع: المعتمد والمردود عليه بس */
export async function listPublic(): Promise<Question[]> {
  const rows = await readAll();
  return rows.filter((q) => q.status === "approved" || q.status === "answered");
}

export async function countPending(): Promise<number> {
  const rows = await readAll();
  return rows.filter((q) => q.status === "pending").length;
}

export async function countAll(): Promise<number> {
  return (await readAll()).length;
}
