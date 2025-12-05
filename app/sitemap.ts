/**
 * @file sitemap.ts
 * @description 동적 사이트맵 생성
 *
 * Next.js App Router의 sitemap.xml 생성
 */

import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

function createPublicSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  }

  return createClient(supabaseUrl, supabaseKey);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // 카테고리 페이지
  const categories = [
    "electronics",
    "clothing",
    "books",
    "food",
    "sports",
    "beauty",
    "home",
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/products?category=${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 상품 페이지 (동적)
  let productPages: MetadataRoute.Sitemap = [];

  try {
    const supabase = createPublicSupabaseClient();
    const { data: products } = await supabase
      .from("products")
      .select("id, updated_at")
      .eq("is_active", true)
      .limit(1000); // 최대 1000개 상품만 포함

    if (products) {
      productPages = products.map((product) => ({
        url: `${baseUrl}/products/${product.id}`,
        lastModified: product.updated_at
          ? new Date(product.updated_at)
          : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
  }

  return [...staticPages, ...categoryPages, ...productPages];
}
