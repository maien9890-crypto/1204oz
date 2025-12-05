/**
 * @file page.tsx
 * @description 마이페이지 메인
 *
 * 사용자의 주문 내역 목록을 표시하는 페이지
 */

import { Suspense } from "react";
import { OrdersList } from "./orders-list";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getOrders } from "@/actions/orders";

export default function MyPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">마이페이지</h1>
          <p className="text-muted-foreground text-lg">
            주문 내역을 확인하고 관리할 수 있습니다.
          </p>
        </div>

        <Suspense
          fallback={<LoadingSpinner size="lg" text="주문 내역을 불러오는 중..." />}
        >
          <OrdersList />
        </Suspense>
      </div>
    </main>
  );
}

