/**
 * @file page.tsx
 * @description 장바구니 페이지
 *
 * 사용자의 장바구니 아이템을 표시하고 관리하는 페이지
 * 주문하기 기능 포함
 */

import { Suspense } from "react";
import { CartContent } from "./cart-content";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function CartPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">장바구니</h1>
        </div>

        <Suspense
          fallback={<LoadingSpinner size="lg" text="장바구니를 불러오는 중..." />}
        >
          <CartContent />
        </Suspense>
      </div>
    </main>
  );
}

