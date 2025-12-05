/**
 * @file orders.ts
 * @description 주문 관련 유틸리티 함수
 *
 * 주문 날짜 포맷팅, 상태 텍스트 변환 등
 */

import { LucideIcon, Clock, CheckCircle2, Truck, Package, XCircle } from "lucide-react";
import { Order } from "@/types/order";

/**
 * 주문 날짜를 한국어 형식으로 포맷팅
 */
export function formatOrderDate(date: string): string {
  const orderDate = new Date(date);
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(orderDate);
}

/**
 * 주문 상태를 한글 텍스트로 변환
 */
export function getStatusText(status: Order["status"]): string {
  const statusMap: Record<Order["status"], string> = {
    pending: "주문 대기",
    confirmed: "주문 확인됨",
    shipped: "배송 중",
    delivered: "배송 완료",
    cancelled: "주문 취소됨",
  };
  return statusMap[status] || status;
}

/**
 * 주문 상태에 따른 아이콘 반환
 */
export function getStatusIcon(
  status: Order["status"]
): { icon: LucideIcon; color: string } {
  switch (status) {
    case "pending":
      return { icon: Clock, color: "text-orange-500" };
    case "confirmed":
      return { icon: CheckCircle2, color: "text-blue-500" };
    case "shipped":
      return { icon: Truck, color: "text-purple-500" };
    case "delivered":
      return { icon: Package, color: "text-green-500" };
    case "cancelled":
      return { icon: XCircle, color: "text-gray-500" };
    default:
      return { icon: Clock, color: "text-gray-500" };
  }
}

/**
 * 주문 취소 가능 여부 확인
 */
export function canCancelOrder(status: Order["status"]): boolean {
  return status === "pending";
}

/**
 * 주문 상태 색상 클래스 반환
 */
export function getStatusColorClass(status: Order["status"]): string {
  switch (status) {
    case "pending":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
    case "confirmed":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "shipped":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
    case "delivered":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "cancelled":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
}

