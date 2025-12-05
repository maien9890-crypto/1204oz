/**
 * @file manifest.ts
 * @description PWA 매니페스트 설정
 *
 * Next.js App Router의 manifest.json 생성
 */

import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";

  return {
    name: "SaaS 템플릿 쇼핑몰",
    short_name: "SaaS 쇼핑몰",
    description: "Next.js 15 + Clerk + Supabase 기반 쇼핑몰",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
