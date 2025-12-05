/**
 * @file payment-success-content.tsx
 * @description 결제 성공 콘텐츠 컴포넌트
 */

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { confirmPayment } from "@/actions/payments";

export function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get("orderId");
  const paymentKey = searchParams.get("paymentKey");
  const amount = searchParams.get("amount");

  useEffect(() => {
    async function verifyPayment() {
      if (!paymentKey || !orderId || !amount) {
        setError("결제 정보가 올바르지 않습니다.");
        setIsVerifying(false);
        return;
      }

      try {
        const result = await confirmPayment(
          paymentKey,
          orderId,
          parseInt(amount, 10)
        );

        if (result.success) {
          setIsVerified(true);
        } else {
          setError(result.error || "결제 검증에 실패했습니다.");
        }
      } catch (err) {
        console.error("Error verifying payment:", err);
        setError("결제 검증 중 오류가 발생했습니다.");
      } finally {
        setIsVerifying(false);
      }
    }

    verifyPayment();
  }, [paymentKey, orderId, amount]);

  if (isVerifying) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600 dark:text-gray-400">
            결제를 확인하는 중...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error || !isVerified) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold">결제 확인 실패</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
          <div className="flex flex-col gap-2 pt-4">
            <Button asChild className="w-full">
              <Link href="/cart">장바구니로 돌아가기</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold">결제가 완료되었습니다!</h1>
      </CardHeader>
      <CardContent className="space-y-4">
        {orderId && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              주문번호
            </p>
            <p className="font-semibold">{orderId}</p>
          </div>
        )}

        <div className="flex flex-col gap-2 pt-4">
          <Button asChild className="w-full">
            <Link href={`/mypage/orders/${orderId}`}>주문 상세 보기</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/products">쇼핑 계속하기</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

