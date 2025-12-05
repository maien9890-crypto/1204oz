/**
 * @file OrderItemList.tsx
 * @description 주문 상품 목록 컴포넌트
 *
 * 주문에 포함된 상품 목록을 표시
 */

import { OrderItem } from "@/types/order";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface OrderItemListProps {
  orderItems: OrderItem[];
  totalAmount: number;
}

export function OrderItemList({
  orderItems,
  totalAmount,
}: OrderItemListProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-bold">주문 상품</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orderItems.map((item) => {
            const itemTotal = item.price * item.quantity;
            return (
              <div
                key={item.id}
                className="flex justify-between items-start py-4 border-b last:border-0"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-1">{item.product_name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    수량: {item.quantity}개 × {formatPrice(item.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{formatPrice(itemTotal)}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">총 결제 금액</span>
            <span className="text-2xl font-bold text-primary">
              {formatPrice(totalAmount)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

