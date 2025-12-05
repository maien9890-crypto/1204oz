/**
 * @file order.ts
 * @description 주문 관련 TypeScript 타입 정의
 *
 * Supabase orders, order_items 테이블과 일치하는 타입 정의
 */

export interface ShippingAddress {
  recipient: string;
  phone: string;
  postalCode: string;
  address: string;
  detailAddress: string;
}

export interface Order {
  id: string;
  clerk_id: string;
  total_amount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shipping_address: ShippingAddress;
  order_note?: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  created_at: string;
}
