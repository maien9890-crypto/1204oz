/**
 * @file cart.ts
 * @description 장바구니 관련 유틸리티 함수
 *
 * 장바구니 계산 및 검증 관련 함수들
 */

import { CartItem, CartSummary } from "@/types/cart";

/**
 * 장바구니 요약 정보 계산
 */
export function calculateCartSummary(cartItems: CartItem[]): CartSummary {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => {
    if (item.product) {
      return sum + item.product.price * item.quantity;
    }
    return sum;
  }, 0);

  return {
    totalItems,
    totalAmount,
  };
}

/**
 * 장바구니 아이템의 총 가격 계산
 */
export function getCartItemTotal(cartItem: CartItem): number {
  if (!cartItem.product) return 0;
  return cartItem.product.price * cartItem.quantity;
}

/**
 * 재고 확인
 */
export function checkStock(cartItem: CartItem): {
  isValid: boolean;
  availableStock: number;
  requestedQuantity: number;
} {
  if (!cartItem.product) {
    return {
      isValid: false,
      availableStock: 0,
      requestedQuantity: cartItem.quantity,
    };
  }

  const availableStock = cartItem.product.stock_quantity;
  const isValid = cartItem.quantity <= availableStock;

  return {
    isValid,
    availableStock,
    requestedQuantity: cartItem.quantity,
  };
}
