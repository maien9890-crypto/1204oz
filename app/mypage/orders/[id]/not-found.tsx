/**
 * @file not-found.tsx
 * @description 주문을 찾을 수 없을 때 표시되는 페이지
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OrderNotFound() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">주문을 찾을 수 없습니다</h1>
        <p className="text-gray-600 dark:text-gray-400">
          요청하신 주문이 존재하지 않거나 접근 권한이 없습니다.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/mypage">주문 내역으로</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/products">상품 둘러보기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

