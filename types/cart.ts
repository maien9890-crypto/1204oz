/**
 * @file cart.ts
 * @description 장바구니 관련 TypeScript 타입 정의
 *
 * Supabase cart_items 테이블과 일치하는 타입 정의
 */

export interface CartItem {
  id: string;
  clerk_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  // 조인된 상품 정보
  product?: {
    id: string;
    name: string;
    price: number;
    stock_quantity: number;
    description: string | null;
    category: string | null;
  };
}

export interface CartSummary {
  totalItems: number;
  totalAmount: number;
}
