/**
 * @file PaymentModal.tsx
 * @description 결제 모달 컴포넌트
 *
 * 결제 위젯을 모달 형태로 표시하는 컴포넌트
 */

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PaymentWidget } from "./PaymentWidget";
import { PaymentRequest } from "@/types/payment";
import { formatPrice } from "@/lib/utils";
import { confirmPayment } from "@/actions/payments";
import { useRouter } from "next/navigation";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentRequest: PaymentRequest;
  onSuccess?: () => void;
}

export function PaymentModal({
  open,
  onOpenChange,
  paymentRequest,
  onSuccess,
}: PaymentModalProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentSuccess = (paymentKey: string) => {
    // 결제 위젯이 자동으로 successUrl로 리다이렉트하므로
    // 여기서는 모달을 닫고 리다이렉트를 기다립니다
    onOpenChange(false);
    // successUrl에서 결제 검증이 처리됩니다
  };

  const handlePaymentError = (error: string) => {
    alert(error);
    setIsProcessing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>결제하기</DialogTitle>
          <DialogDescription>
            주문 정보를 확인하고 결제를 진행해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* 주문 정보 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">주문 정보</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-gray-500 dark:text-gray-400">주문명:</span>{" "}
                {paymentRequest.orderName}
              </p>
              <p>
                <span className="text-gray-500 dark:text-gray-400">주문번호:</span>{" "}
                {paymentRequest.orderId}
              </p>
              <p className="text-lg font-bold">
                <span className="text-gray-500 dark:text-gray-400">결제 금액:</span>{" "}
                {formatPrice(paymentRequest.amount)}
              </p>
            </div>
          </div>

          {/* 결제 위젯 */}
          {!isProcessing ? (
            <PaymentWidget
              paymentRequest={paymentRequest}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                결제를 처리하는 중입니다...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

