/**
 * @file CartSummary.tsx
 * @description 장바구니 요약 컴포넌트
 *
 * 장바구니의 총 상품 수와 총 금액을 표시
 * 주문하기 버튼 제공
 */

"use client";

import { CartItem } from "@/types/cart";
import { calculateCartSummary } from "@/lib/utils/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { CheckoutForm } from "./CheckoutForm";

interface CartSummaryProps {
  cartItems: CartItem[];
  onOrderComplete?: () => void;
}

export function CartSummary({ cartItems, onOrderComplete }: CartSummaryProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  const summary = calculateCartSummary(cartItems);

  if (cartItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            장바구니가 비어있습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (showCheckout) {
    return (
      <CheckoutForm
        totalAmount={summary.totalAmount}
        onCancel={() => setShowCheckout(false)}
        onSuccess={() => {
          setShowCheckout(false);
          if (onOrderComplete) {
            onOrderComplete();
          }
        }}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">주문 요약</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-lg">
          <span>총 상품 수</span>
          <span className="font-semibold">{summary.totalItems}개</span>
        </div>
        <div className="flex justify-between text-2xl font-bold border-t pt-4">
          <span>총 금액</span>
          <span className="text-primary">{formatPrice(summary.totalAmount)}</span>
        </div>
        <Button
          size="lg"
          className="w-full mt-4"
          onClick={() => setShowCheckout(true)}
        >
          주문하기
        </Button>
      </CardContent>
    </Card>
  );
}

