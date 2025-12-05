/**
 * @file order-detail-content.tsx
 * @description 주문 상세 콘텐츠 컴포넌트
 *
 * 주문 상세 정보를 표시하는 Server Component
 */

import { notFound } from "next/navigation";
import { OrderDetail } from "@/components/OrderDetail";
import { getOrderById } from "@/actions/orders";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface OrderDetailContentProps {
  orderId: string;
}

export async function OrderDetailContent({
  orderId,
}: OrderDetailContentProps) {
  const result = await getOrderById(orderId);

  if (!result.success || !result.order || !result.orderItems) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <Link href="/mypage">
          <Button variant="outline">← 주문 내역으로</Button>
        </Link>
      </div>

      <OrderDetail order={result.order} orderItems={result.orderItems} />
    </div>
  );
}

