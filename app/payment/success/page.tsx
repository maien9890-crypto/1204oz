/**
 * @file page.tsx
 * @description 결제 성공 페이지
 *
 * 결제 성공 후 표시되는 페이지
 */

import { Suspense } from "react";
import { PaymentSuccessContent } from "./payment-success-content";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Suspense
          fallback={
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>결제 정보를 확인하는 중...</p>
            </div>
          }
        >
          <PaymentSuccessContent />
        </Suspense>
      </div>
    </main>
  );
}

