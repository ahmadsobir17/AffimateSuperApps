import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const pjs = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-pjs",
});

export const metadata: Metadata = {
  title: "Affimate Super Apps - Masa Depan Content Creation AI",
  description: "Dominasi market affiliate dan content creation dengan teknologi AI 5.0. AI Product Studio, Viral Script Engine, dan VEO Vision dalam satu genggaman.",
  keywords: ["affiliate marketing", "content creator", "AI content tool", "tiktok affiliate", "reels automation", "affimate", "super apps", "marketing 5.0"],
  authors: [{ name: "Axiamasi Team" }],
  openGraph: {
    title: "Affimate Super Apps - Masa Depan Content Creation AI",
    description: "Dominasi market affiliate dan content creation dengan teknologi AI 5.0. Otomasi proses repetitif lo sekarang.",
    url: "https://affimate.id", // Update with actual domain if known
    siteName: "Affimate Super Apps",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Affimate Super Apps Dashboard",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Affimate Super Apps - Masa Depan Content Creation AI",
    description: "Otomasi konten affiliate lo dengan AI tercanggih. Hemat 120+ jam per bulan.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Affimate",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  themeColor: "#ef4444",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${pjs.variable} antialiased font-sans min-h-screen bg-[#050911] text-slate-200`}
      >
        {children}
      </body>
    </html>
  );
}
