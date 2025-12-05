/**
 * @file OrderDetail.tsx
 * @description 주문 상세 정보 컴포넌트
 *
 * 주문의 상세 정보를 표시하는 컴포넌트
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderItemList } from "./OrderItemList";
import { OrderCancelDialog } from "./OrderCancelDialog";
import { formatOrderDate, formatPrice, canCancelOrder } from "@/lib/utils/orders";
import { Order, OrderItem } from "@/types/order";

interface OrderDetailProps {
  order: Order;
  orderItems: OrderItem[];
}

export function OrderDetail({ order, orderItems }: OrderDetailProps) {
  const canCancel = canCancelOrder(order.status);
  const shippingAddress = order.shipping_address;

  return (
    <div className="space-y-6">
      {/* 주문 기본 정보 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                주문 #{order.id.slice(0, 8)}
              </h2>
              <OrderStatusBadge status={order.status} />
            </div>
            {canCancel && (
              <OrderCancelDialog
                orderId={order.id}
                orderNumber={order.id.slice(0, 8)}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">주문일시</p>
              <p className="font-semibold">{formatOrderDate(order.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">총 결제 금액</p>
              <p className="text-xl font-bold">{formatPrice(order.total_amount)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 배송지 정보 */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold">배송지 정보</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <span className="text-gray-500 dark:text-gray-400">수령인:</span>{" "}
              {shippingAddress.recipient}
            </p>
            <p>
              <span className="text-gray-500 dark:text-gray-400">연락처:</span>{" "}
              {shippingAddress.phone}
            </p>
            <p>
              <span className="text-gray-500 dark:text-gray-400">주소:</span>{" "}
              [{shippingAddress.postalCode}] {shippingAddress.address}{" "}
              {shippingAddress.detailAddress}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 주문 메모 */}
      {order.order_note && (
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold">주문 메모</h3>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{order.order_note}</p>
          </CardContent>
        </Card>
      )}

      {/* 주문 상품 목록 */}
      <OrderItemList orderItems={orderItems} totalAmount={order.total_amount} />
    </div>
  );
}

