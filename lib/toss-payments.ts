/**
 * @file toss-payments.ts
 * @description Toss Payments 클라이언트 설정 및 유틸리티
 *
 * Toss Payments 위젯 초기화 및 설정
 */

import {
  loadPaymentWidget,
  PaymentWidgetInstance,
} from "@tosspayments/payment-widget-sdk";

/**
 * Toss Payments 클라이언트 키 가져오기
 */
export function getTossClientKey(): string {
  const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY;
  if (!clientKey) {
    throw new Error(
      "Toss Payments 클라이언트 키가 설정되지 않았습니다. NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY를 확인하세요.",
    );
  }
  return clientKey;
}

/**
 * Toss Payments 위젯 초기화
 */
export async function initializePaymentWidget(
  customerKey: string,
): Promise<PaymentWidgetInstance> {
  const clientKey = getTossClientKey();

  const paymentWidget = await loadPaymentWidget(clientKey, customerKey);

  return paymentWidget;
}

/**
 * 고객 키 생성 (Clerk User ID 기반)
 */
export function generateCustomerKey(userId: string): string {
  return `customer_${userId}_${Date.now()}`;
}
