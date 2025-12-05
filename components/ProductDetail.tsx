/**
 * @file ProductDetail.tsx
 * @description 상품 상세 정보 컴포넌트
 *
 * 상품의 상세 정보를 표시하는 컴포넌트
 * - 상품 이미지, 이름, 가격, 설명, 재고, 카테고리
 * - 장바구니 담기 버튼 (Phase 3 연동 준비)
 */

"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const isOutOfStock = product.stock_quantity === 0;
  const stockStatus = isOutOfStock
    ? "품절"
    : product.stock_quantity < 10
    ? `재고 ${product.stock_quantity}개`
    : "재고 있음";

  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const { addToCart } = await import("@/actions/cart");
      const result = await addToCart(product.id, 1);
      
      if (result.success) {
        alert("장바구니에 추가되었습니다!");
        // 장바구니 아이콘 업데이트를 위해 페이지 새로고침
        window.location.reload();
      } else {
        alert(result.error || "장바구니에 추가하는데 실패했습니다.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("장바구니에 추가하는 중 오류가 발생했습니다.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      {/* 상품 이미지 */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl overflow-hidden shadow-lg">
        <img
          src="https://via.placeholder.com/600x600?text=Product"
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-semibold text-xl px-4 py-2 bg-black/60 rounded-lg">
              품절
            </span>
          </div>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="flex flex-col gap-6">
        <Card className="border-border/50">
          <CardHeader className="space-y-4 pb-4">
            {/* 카테고리 */}
            {product.category && (
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                {product.category}
              </p>
            )}
            {/* 상품명 */}
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
              {product.name}
            </h1>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* 가격 */}
            <div className="pb-4 border-b border-border/50">
              <p className="text-4xl lg:text-5xl font-bold text-primary">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* 재고 상태 */}
            <div className="space-y-2">
              <p
                className={`text-base font-semibold ${
                  isOutOfStock
                    ? "text-destructive"
                    : product.stock_quantity < 10
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-secondary"
                }`}
              >
                {stockStatus}
              </p>
              {!isOutOfStock && (
                <p className="text-sm text-muted-foreground">
                  남은 수량: {product.stock_quantity}개
                </p>
              )}
            </div>

            {/* 설명 */}
            {product.description && (
              <div className="pt-4 border-t border-border/50">
                <h2 className="text-lg font-semibold mb-3 tracking-tight">상품 설명</h2>
                <p className="text-foreground/80 whitespace-pre-line leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* 장바구니 담기 버튼 */}
            <div className="pt-4">
              <Button
                size="lg"
                className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl"
                disabled={isOutOfStock || isAdding}
                onClick={handleAddToCart}
              >
                {isAdding
                  ? "추가 중..."
                  : isOutOfStock
                    ? "품절"
                    : "장바구니에 담기"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
