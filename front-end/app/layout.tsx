import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, UnifrakturMaguntia } from "next/font/google";
import "./globals.css";

// خط مؤسسي واضح — مصمّم أصلاً للوثائق والواجهات التقنية،
// وده بالظبط إحساس الملف. حروفه مفتوحة وبتتقري في أي مقاس.
const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

// خط الوشم — blackletter زي «Hustler» اللي على صدر البطة.
// مش بيتستخدم في النص؛ البطة الـ3D بتقرا اسم العائلة من المتغير ده
// وبترسم بيه على الـ canvas بتاع الوشم.
const blackletter = UnifrakturMaguntia({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-blackletter",
  display: "block",
});

const SITE = "https://maa-kamel-e7tyaty.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "مع كامل احطياتي — قيّد سؤالك في الملف",
    template: "%s · مع كامل احطياتي",
  },
  description:
    "ابعت أغرب سؤال في دماغك أو الموضوع اللي نفسك نتكلم فيه. كل سؤال بيتقيّد في الملف، وبيتراجع قبل ما يتنشر.",
  keywords: [
    "مع كامل احطياتي",
    "مع كامل احترامي",
    "محمد عبد العاطي",
    "بودكاست مصري",
    "أسئلة غريبة",
    "صوت البطة",
  ],
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: SITE,
    siteName: "مع كامل احطياتي",
    title: "مع كامل احطياتي — قيّد سؤالك في الملف",
    description: "ابعت أغرب سؤال في دماغك، وعبد العاطي يقرر يرد على إيه.",
  },
  twitter: {
    card: "summary_large_image",
    title: "مع كامل احطياتي",
    description: "ابعت أغرب سؤال في دماغك، وعبد العاطي يقرر يرد على إيه.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#C9B78E",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${plex.variable} ${blackletter.variable}`}
    >
      <body className="grain">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[100] focus:bg-duck focus:px-5 focus:py-2 focus:font-bold focus:text-ink"
        >
          تخطَّ إلى المحتوى
        </a>
        {children}
      </body>
    </html>
  );
}
