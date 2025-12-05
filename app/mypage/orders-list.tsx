/**
 * @file orders-list.tsx
 * @description 주문 내역 목록 컴포넌트
 *
 * 사용자의 주문 목록을 표시하는 Server Component
 */

import { OrderCard } from "@/components/OrderCard";
import { EmptyState } from "@/components/EmptyState";
import { getOrders } from "@/actions/orders";
import { Package } from "lucide-react";

export async function OrdersList() {
  const result = await getOrders();

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 dark:text-red-400 mb-4">
          {result.error || "주문 내역을 불러오는데 실패했습니다."}
        </p>
        <Button asChild>
          <Link href="/products">상품 둘러보기</Link>
        </Button>
      </div>
    );
  }

  const orders = result.data || [];

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="아직 주문 내역이 없습니다"
        description="상품을 구매하시면 주문 내역이 여기에 표시됩니다."
        action={{
          label: "상품 둘러보기",
          href: "/products",
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-400">
          총 {orders.length}개의 주문
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}

