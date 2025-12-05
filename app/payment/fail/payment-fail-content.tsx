/**
 * @file payment-fail-content.tsx
 * @description 결제 실패 콘텐츠 컴포넌트
 */

"use client";

import { useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PaymentFailContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <XCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold">결제에 실패했습니다</h1>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorCode && (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400 font-semibold">
              오류 코드: {errorCode}
            </p>
            {errorMessage && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errorMessage}
              </p>
            )}
          </div>
        )}

        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>결제 중 문제가 발생했습니다.</p>
          <p className="mt-2">
            문제가 지속되면 고객센터로 문의해주세요.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <Button asChild className="w-full">
            <Link href="/cart">장바구니로 돌아가기</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/products">쇼핑 계속하기</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

