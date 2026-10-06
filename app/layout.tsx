import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import Loader from "@/components/loader/Loader";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const TITLE = "Ấm Trà — the Vietnamese way of tea";
const DESCRIPTION =
  "Seven Vietnamese teas, the old Hà Nội way of brewing them, and the manners of offering a cup — a hot cup of tea is the first greeting in a Vietnamese home.";

// Set NEXT_PUBLIC_SITE_URL to the real domain; on Vercel the production domain is picked up automatically.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://tra-vn.vercel.app/");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: TITLE, template: "%s · Ấm Trà" },
  description: DESCRIPTION,
  applicationName: "Ấm Trà",
  keywords: [
    "Vietnamese tea",
    "trà Việt Nam",
    "trà Thái Nguyên",
    "trà mạn",
    "trà sen",
    "trà nhài",
    "Shan tuyết tea",
    "Hà Nội tea culture",
    "how to brew tea",
    "tea etiquette",
    "lễ nghi trà",
    "mời trà",
  ],
  authors: [{ name: "Ấm Trà" }],
  category: "culture",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Ấm Trà",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    locale: "en_US",
    alternateLocale: ["vi_VN"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#14291C",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={beVietnam.variable}>
      <head>
        <link rel="preload" href="/fonts/big-shoulders-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/big-shoulders-vietnamese.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <Loader />
        {children}
      </body>
    </html>
  );
}
