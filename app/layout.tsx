import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Ấm Trà — the Vietnamese way of tea",
  description:
    "Seven Vietnamese teas, the old Hà Nội way of brewing them, and the manners of offering a cup — a hot cup of tea is the first greeting in a Vietnamese home.",
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
      <body>{children}</body>
    </html>
  );
}
