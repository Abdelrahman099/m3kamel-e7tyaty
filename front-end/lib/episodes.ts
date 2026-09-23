/**
 * الحلقات المستخرجة من تبويب الفيديوهات بالقناة المحددة بواسطة صاحب الموقع.
 * المصدر: https://www.youtube.com/@m3kamele7tiaty/videos
 * تاريخ المراجعة: 2026-09-23. الترتيب من الأحدث للأقدم؛ بدون Shorts.
 */
export type Episode = {
  title: string;
  url: string;
  views?: string;
  kind: "short" | "episode";
};

export const EPISODES: Episode[] = [
  {
    title: "لابتوب | جورج عزمي",
    url: "https://www.youtube.com/watch?v=w5E1LhMeOb0",
    kind: "episode",
  },
  {
    title: "شجرة | أحمد داود",
    url: "https://www.youtube.com/watch?v=TC8Un-PCnlU",
    kind: "episode",
  },
  {
    title: "نابو بيبي | اميره اديب",
    url: "https://www.youtube.com/watch?v=E-Q2NS1x5ZA",
    kind: "episode",
  },
  {
    title: "جيري | تميم يونس",
    url: "https://www.youtube.com/watch?v=48phSwvBNY0",
    kind: "episode",
  },
  {
    title: "المانش | إبراهيم حمدتو و هيثم عادل",
    url: "https://www.youtube.com/watch?v=Kk4zY2i5ipU",
    kind: "episode",
  },
  {
    title: "بنحبك يا بسيوني | عفروتو",
    url: "https://www.youtube.com/watch?v=NvhU30J2T2U",
    kind: "episode",
  },
  {
    title: "زملاء | فتحي عبد الوهاب",
    url: "https://www.youtube.com/watch?v=FNvxTrIGXsU",
    kind: "episode",
  },
  {
    title: "تندرلوين | يحيي رشدان",
    url: "https://www.youtube.com/watch?v=xukaC-1QQfE",
    kind: "episode",
  },
  {
    title: "احدب نوتردام | عمر الجمل",
    url: "https://www.youtube.com/watch?v=cQ9nPp1FlW4",
    kind: "episode",
  },
  {
    title: "سكودو | مجدي عبد الغني",
    url: "https://www.youtube.com/watch?v=Cxtx0L5DiUM",
    kind: "episode",
  },
  {
    title: "الدايرة | زياد ظاظا",
    url: "https://www.youtube.com/watch?v=daJbgH3OqSk",
    kind: "episode",
  },
  {
    title: "بوشكاش | هشام ماجد",
    url: "https://www.youtube.com/watch?v=uHoPc6kbUI8",
    kind: "episode",
  },
  {
    title: "الحاج متولي",
    url: "https://www.youtube.com/watch?v=PEyASbm6Uhg",
    kind: "episode",
  },
];

export const CHANNEL_URL = "https://www.youtube.com/@m3kamele7tiaty";
export const TIKTOK_URL = "https://www.tiktok.com/@mohammedabdelatytaha";
