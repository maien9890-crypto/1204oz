/**
 * @file page.tsx
 * @description 상품 목록 페이지
 *
 * 필터, 정렬, 페이지네이션이 적용된 상품 목록 표시
 * - URL 쿼리 파라미터 기반 카테고리 필터링
 * - 고급 정렬 기능
 * - 번호 페이지네이션
 */

import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductSidebar } from "@/components/ProductSidebar";
import { ProductSort } from "@/components/ProductSort";
import { Pagination } from "@/components/Pagination";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { getProductsWithFilters } from "@/lib/utils/products";
import { Product } from "@/types/product";
import { Package } from "lucide-react";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

async function ProductsContent({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const category = params.category || undefined;
  const sort = (params.sort as any) || "latest";
  const page = params.page ? parseInt(params.page, 10) : 1;

  const { products, totalCount, totalPages, currentPage } =
    await getProductsWithFilters({
      category,
      sort,
      page,
    });

  return (
    <>
      {/* 정렬 드롭다운 */}
      <ProductSort />

      {/* 상품 목록 */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* 페이지네이션 */}
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </>
      ) : (
        <EmptyState
          icon={Package}
          title="표시할 상품이 없습니다"
          description={
            category
              ? "다른 카테고리를 선택해보세요."
              : "상품이 등록되면 여기에 표시됩니다."
          }
        />
      )}
    </>
  );
}

export default async function ProductsPage(props: ProductsPageProps) {
  return (
    <main className="min-h-[calc(100vh-80px)] py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8">
          {/* 사이드바 필터 */}
          <Suspense fallback={<div className="w-64" />}>
            <ProductSidebar />
          </Suspense>

          {/* 메인 컨텐츠 */}
          <div className="flex-1">
            <Suspense
              fallback={<LoadingSpinner size="lg" text="상품을 불러오는 중..." />}
            >
              <ProductsContent {...props} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
