/**
 * @file CartIcon.tsx
 * @description 장바구니 아이콘 컴포넌트
 *
 * 네비게이션 바에 표시될 장바구니 아이콘
 * 장바구니 아이템 수를 배지로 표시
 */

"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function CartIcon() {
  const [itemCount, setItemCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchCartCount() {
      try {
        // Server Action을 동적으로 import하여 호출
        const { getCartItemCount } = await import("@/actions/cart");
        const count = await getCartItemCount();
        setItemCount(count);
      } catch (error) {
        // 인증되지 않은 사용자는 0으로 표시
        setItemCount(0);
      }
    }

    fetchCartCount();

    // 경로 변경 시 장바구니 수 업데이트
    const interval = setInterval(fetchCartCount, 3000); // 3초마다 업데이트

    return () => clearInterval(interval);
  }, [pathname]);

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {itemCount > 99 ? "99+" : itemCount}
        </Badge>
      )}
    </Link>
  );
}

