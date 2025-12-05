/**
 * @file payment.ts
 * @description 결제 관련 TypeScript 타입 정의
 *
 * Toss Payments 통합을 위한 타입 정의
 */

export interface PaymentRequest {
  orderId: string;
  amount: number;
  orderName: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentKey?: string;
  orderId?: string;
  amount?: number;
  error?: string;
}

export interface PaymentCallback {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface PaymentMethod {
  method: "카드" | "계좌이체" | "가상계좌" | "휴대폰";
}
