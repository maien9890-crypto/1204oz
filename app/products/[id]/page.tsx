/**
 * @file page.tsx
 * @description 상품 상세 페이지
 *
 * 동적 라우트를 통해 특정 상품의 상세 정보를 표시
 * - 상품이 없을 경우 404 처리
 * - 반응형 레이아웃 (모바일: 세로, 데스크톱: 가로)
 */

import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";
import { getProductById } from "@/lib/utils/products";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-[calc(100vh-80px)] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <ProductDetail product={product} />
      </div>
    </main>
  );
}
