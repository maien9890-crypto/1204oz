import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { Inter, Roboto } from "next/font/google";

import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "SaaS 템플릿 쇼핑몰",
    template: "%s | SaaS 템플릿",
  },
  description:
    "Next.js 15 + Clerk + Supabase 기반 모던 쇼핑몰. 전자제품, 의류, 도서 등 다양한 상품을 만나보세요.",
  keywords: [
    "쇼핑몰",
    "온라인 쇼핑",
    "전자제품",
    "의류",
    "도서",
    "Next.js",
    "Supabase",
  ],
  authors: [{ name: "SaaS Template" }],
  creator: "SaaS Template",
  publisher: "SaaS Template",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: baseUrl,
    siteName: "SaaS 템플릿 쇼핑몰",
    title: "SaaS 템플릿 쇼핑몰",
    description: "Next.js 15 + Clerk + Supabase 기반 모던 쇼핑몰",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "SaaS 템플릿 쇼핑몰",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaS 템플릿 쇼핑몰",
    description: "Next.js 15 + Clerk + Supabase 기반 모던 쇼핑몰",
    images: [`${baseUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={koKR}>
      <html lang="ko" className="dark">
        <body
          className={`${inter.variable} ${roboto.variable} font-sans antialiased bg-background text-foreground`}
        >
          <SyncUserProvider>
            <Navbar />
            {children}
            <Footer />
          </SyncUserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
