/**
 * @file OrderStatusBadge.tsx
 * @description 주문 상태 배지 컴포넌트
 *
 * 주문 상태를 아이콘과 텍스트로 표시
 */

import { getStatusIcon, getStatusText, getStatusColorClass } from "@/lib/utils/orders";
import { Order } from "@/types/order";
import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: Order["status"];
  showIcon?: boolean;
}

export function OrderStatusBadge({
  status,
  showIcon = true,
}: OrderStatusBadgeProps) {
  const { icon: Icon, color } = getStatusIcon(status);
  const statusText = getStatusText(status);
  const colorClass = getStatusColorClass(status);

  return (
    <Badge variant="outline" className={colorClass}>
      {showIcon && <Icon className={`h-3 w-3 mr-1 ${color}`} />}
      <span>{statusText}</span>
    </Badge>
  );
}

