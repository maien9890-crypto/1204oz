/**
 * @file page.tsx
 * @description 홈페이지
 *
 * 프로모션 배너, 카테고리 섹션, 인기 상품 미리보기를 표시
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PromoBanner } from "@/components/PromoBanner";
import { CategorySection } from "@/components/CategorySection";
import { ProductCard } from "@/components/ProductCard";
import { getProductsWithFilters } from "@/lib/utils/products";

async function getFeaturedProducts() {
  try {
    // 홈페이지에서는 최신 상품 8개만 가져오기
    const { products } = await getProductsWithFilters({
      sort: "latest",
      page: 1,
    });

    // 최대 8개만 반환
    return products.slice(0, 8);
  } catch (error) {
    console.error("Error fetching featured products:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <main className="min-h-[calc(100vh-80px)]">
      {/* 프로모션 배너 */}
      <PromoBanner />

      {/* 카테고리 섹션 */}
      <CategorySection />

      {/* MD's Pick 섹션 */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-2">MD's Pick</h2>
          <p className="text-muted-foreground">에디터가 선정한 추천 상품</p>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">표시할 상품이 없습니다.</p>
          </div>
        )}
      </section>
    </main>
  );
}
