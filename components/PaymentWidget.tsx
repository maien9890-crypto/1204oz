/**
 * @file PaymentWidget.tsx
 * @description Toss Payments 위젯 래퍼 컴포넌트
 *
 * Toss Payments 결제 위젯을 렌더링하고 결제 요청을 처리
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";
import {
  initializePaymentWidget,
  generateCustomerKey,
} from "@/lib/toss-payments";
import { PaymentRequest } from "@/types/payment";
import { useAuth } from "@clerk/nextjs";

interface PaymentWidgetProps {
  paymentRequest: PaymentRequest;
  onSuccess: (paymentKey: string) => void;
  onError: (error: string) => void;
}

export function PaymentWidget({
  paymentRequest,
  onSuccess,
  onError,
}: PaymentWidgetProps) {
  const { userId } = useAuth();
  const [widget, setWidget] = useState<PaymentWidgetInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const paymentMethodsWidgetRef = useRef<ReturnType<
    PaymentWidgetInstance["renderPaymentMethods"]
  > | null>(null);
  const agreementWidgetRef = useRef<ReturnType<
    PaymentWidgetInstance["renderAgreement"]
  > | null>(null);

  useEffect(() => {
    if (!userId) {
      onError("로그인이 필요합니다.");
      return;
    }

    async function setupWidget() {
      try {
        const customerKey = generateCustomerKey(userId);
        const paymentWidget = await initializePaymentWidget(customerKey);

        setWidget(paymentWidget);

        // 결제 수단 위젯 렌더링
        const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
          "#payment-methods",
          { value: paymentRequest.amount },
          { variantKey: "DEFAULT" }
        );

        // 이용약관 위젯 렌더링
        const agreementWidget = paymentWidget.renderAgreement("#agreement", {
          variantKey: "AGREEMENT",
        });

        paymentMethodsWidgetRef.current = paymentMethodsWidget;
        agreementWidgetRef.current = agreementWidget;

        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing payment widget:", error);
        onError(
          error instanceof Error
            ? error.message
            : "결제 위젯 초기화에 실패했습니다."
        );
        setIsLoading(false);
      }
    }

    setupWidget();

    return () => {
      // 정리
      if (paymentMethodsWidgetRef.current) {
        paymentMethodsWidgetRef.current.unmount();
      }
      if (agreementWidgetRef.current) {
        agreementWidgetRef.current.unmount();
      }
    };
  }, [userId, paymentRequest.amount, onError]);

  const handlePayment = async () => {
    if (!widget) {
      onError("결제 위젯이 초기화되지 않았습니다.");
      return;
    }

    try {
      // 결제 요청
      // Toss Payments는 결제 완료 후 자동으로 successUrl로 리다이렉트하며
      // URL에 paymentKey와 orderId를 쿼리 파라미터로 전달합니다
      await widget.requestPayment({
        orderId: paymentRequest.orderId,
        orderName: paymentRequest.orderName,
        customerName: paymentRequest.customerName,
        customerEmail: paymentRequest.customerEmail,
        customerPhone: paymentRequest.customerPhone,
        successUrl: `${window.location.origin}/payment/success?orderId=${paymentRequest.orderId}&amount=${paymentRequest.amount}`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error: any) {
      // 결제 위젯에서 발생한 에러 처리
      if (error.code === "USER_CANCEL") {
        // 사용자가 결제를 취소한 경우
        return;
      }

      console.error("Payment request error:", error);
      onError(
        error?.message || "결제 요청 중 오류가 발생했습니다."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500 dark:text-gray-400">결제 위젯을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 결제 수단 선택 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">결제 수단</h3>
        <div id="payment-methods" className="min-h-[200px]" />
      </div>

      {/* 이용약관 */}
      <div>
        <div id="agreement" />
      </div>

      {/* 결제 버튼 */}
      <button
        onClick={handlePayment}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        {paymentRequest.amount.toLocaleString()}원 결제하기
      </button>
    </div>
  );
}

