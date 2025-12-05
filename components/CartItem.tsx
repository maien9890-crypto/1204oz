/**
 * @file CartItem.tsx
 * @description 장바구니 아이템 컴포넌트
 *
 * 장바구니의 개별 아이템을 표시하는 컴포넌트
 * - 상품 정보 표시
 * - 수량 조절
 * - 삭제 기능
 * - 선택 체크박스
 */

"use client";

import { CartItem as CartItemType } from "@/types/cart";
import { formatPrice } from "@/lib/utils";
import { getCartItemTotal } from "@/lib/utils/cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import { updateCartItem, removeCartItem } from "@/actions/cart";
import { useState } from "react";
import Link from "next/link";

interface CartItemProps {
  item: CartItemType;
  isSelected?: boolean;
  onSelectChange?: (itemId: string, selected: boolean) => void;
  onRemove?: (itemId: string) => void;
}

export function CartItem({
  item,
  isSelected = false,
  onSelectChange,
  onRemove,
}: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  if (!item.product) {
    return null;
  }

  const product = item.product;
  const itemTotal = getCartItemTotal(item);
  const isOutOfStock = product.stock_quantity === 0;
  const canIncrease = quantity < product.stock_quantity;

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > product.stock_quantity) {
      return;
    }

    setIsUpdating(true);
    setQuantity(newQuantity);

    const result = await updateCartItem(item.id, newQuantity);
    if (!result.success) {
      // 실패 시 원래 수량으로 복구
      setQuantity(item.quantity);
      alert(result.error || "수량 변경에 실패했습니다.");
    }

    setIsUpdating(false);
  };

  const handleRemove = async () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setIsRemoving(true);
      const result = await removeCartItem(item.id);
      if (result.success && onRemove) {
        onRemove(item.id);
      } else if (!result.success) {
        alert(result.error || "삭제에 실패했습니다.");
        setIsRemoving(false);
      }
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* 체크박스 */}
          {onSelectChange && (
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelectChange(item.id, e.target.checked)}
                className="h-4 w-4"
              />
            </div>
          )}

          {/* 상품 이미지 */}
          <Link href={`/products/${product.id}`} className="flex-shrink-0">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img
                src="https://via.placeholder.com/80x80?text=Product"
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>

          {/* 상품 정보 */}
          <div className="flex-1 min-w-0">
            <Link href={`/products/${product.id}`}>
              <h3 className="font-semibold text-lg mb-1 hover:underline">
                {product.name}
              </h3>
            </Link>
            {product.category && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {product.category}
              </p>
            )}
            <p className="text-lg font-bold">{formatPrice(product.price)}</p>
            {isOutOfStock && <p className="text-sm text-red-500 mt-1">품절</p>}
          </div>

          {/* 수량 조절 및 삭제 */}
          <div className="flex flex-col items-end gap-2">
            {/* 수량 조절 */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || isUpdating || isRemoving}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={!canIncrease || isUpdating || isRemoving}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* 총액 */}
            <p className="text-lg font-bold">{formatPrice(itemTotal)}</p>

            {/* 삭제 버튼 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={isRemoving}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              삭제
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
