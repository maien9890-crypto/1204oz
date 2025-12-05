/**
 * @file ProductCard.tsx
 * @description 상품 카드 컴포넌트
 *
 * 상품 정보를 카드 형태로 표시하는 재사용 가능한 컴포넌트
 * - 상품 이미지 (placeholder)
 * - 상품명, 가격, 카테고리, 재고 상태 표시
 * - 클릭 시 상품 상세 페이지로 이동
 */

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock_quantity === 0;
  const stockStatus = isOutOfStock
    ? "품절"
    : product.stock_quantity < 10
      ? `재고 ${product.stock_quantity}개`
      : "재고 있음";

  return (
    <Link href={`/products/${product.id}`} className="block h-full group">
      <Card className="h-full flex flex-col p-0 overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border-border/50 bg-card">
        {/* 상품 이미지 */}
        <div className="relative w-full aspect-square bg-gradient-to-br from-muted/50 to-muted/30 overflow-hidden">
          <img
            src="https://via.placeholder.com/300x300?text=Product"
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-semibold text-sm px-3 py-1.5 bg-black/60 rounded-md">
                품절
              </span>
            </div>
          )}
        </div>

        <CardHeader className="flex-1 pb-2 px-4 pt-4">
          <div className="space-y-1.5">
            {/* 브랜드/카테고리 */}
            {product.category && (
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                {product.category}
              </p>
            )}
            {/* 상품명 */}
            <h3 className="font-medium text-sm line-clamp-2 leading-snug text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </div>
        </CardHeader>

        <CardFooter className="flex flex-col items-start gap-1 pt-0 pb-4 px-4">
          {/* 가격 */}
          <p className="text-base font-semibold text-foreground">{formatPrice(product.price)}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}

