/**
 * @file OrderCard.tsx
 * @description 주문 카드 컴포넌트
 *
 * 주문 목록에서 개별 주문을 카드 형태로 표시
 */

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { formatOrderDate, canCancelOrder } from "@/lib/utils/orders";
import { formatPrice } from "@/lib/utils";
import { Order } from "@/types/order";
import { OrderCancelDialog } from "./OrderCancelDialog";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const canCancel = canCancelOrder(order.status);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">주문 #{order.id.slice(0, 8)}</h3>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatOrderDate(order.created_at)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{formatPrice(order.total_amount)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <Link href={`/mypage/orders/${order.id}`}>
            <Button variant="outline">상세 보기</Button>
          </Link>
          {canCancel && (
            <OrderCancelDialog orderId={order.id} orderNumber={order.id.slice(0, 8)} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

