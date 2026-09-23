export const CATEGORIES = [
  { id: "weird", label: "سؤال غريب", hint: "الحاجة اللي مش لاقي حد تسألها" },
  { id: "topic", label: "موضوع للحلقة", hint: "موضوع نفسك يتاخد بجد" },
  { id: "confession", label: "اعتراف", hint: "حاجة عملتها ونادم/مش نادم" },
  { id: "story", label: "حكاية", hint: "موقف حصلك ومستاهل يتحكي" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type Status = "pending" | "approved" | "answered" | "rejected";

export type Question = {
  id: string;
  body: string;
  category: CategoryId;
  name: string | null;      // null = مجهول
  city: string | null;
  status: Status;
  createdAt: string;
  /** رد عبد العاطي — رقم الحلقة ولينكها */
  answer?: { episode: number; url: string; note?: string };
  votes: number;
};

export type PublicQuestion = Omit<Question, "status"> & { status: Exclude<Status, "pending" | "rejected"> };
