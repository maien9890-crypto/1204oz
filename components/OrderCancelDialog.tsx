/**
 * @file OrderCancelDialog.tsx
 * @description 주문 취소 확인 다이얼로그 컴포넌트
 *
 * 주문 취소 확인 및 실행
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cancelOrder } from "@/actions/orders";
import { useRouter } from "next/navigation";

interface OrderCancelDialogProps {
  orderId: string;
  orderNumber: string;
}

export function OrderCancelDialog({
  orderId,
  orderNumber,
}: OrderCancelDialogProps) {
  const [open, setOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      const result = await cancelOrder(orderId);
      if (result.success) {
        setOpen(false);
        router.refresh();
        alert("주문이 취소되었습니다.");
      } else {
        alert(result.error || "주문 취소에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("주문 취소 중 오류가 발생했습니다.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          주문 취소
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>주문 취소 확인</DialogTitle>
          <DialogDescription>
            주문 #{orderNumber}을(를) 취소하시겠습니까?
            <br />
            취소된 주문은 복구할 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isCancelling}>
            아니오
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isCancelling}
          >
            {isCancelling ? "취소 중..." : "예, 취소합니다"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

