/**
 * @file page.tsx
 * @description 주문 상세 페이지
 *
 * 특정 주문의 상세 정보를 표시하는 페이지
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { OrderDetailContent } from "./order-detail-content";
import { getOrderById } from "@/actions/orders";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage(props: OrderDetailPageProps) {
  const params = await props.params;
  const { id } = params;

  return (
    <main className="min-h-[calc(100vh-80px)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">주문 상세</h1>
        </div>

        <Suspense
          fallback={
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>주문 정보를 불러오는 중...</p>
            </div>
          }
        >
          <OrderDetailContent orderId={id} />
        </Suspense>
      </div>
    </main>
  );
}

