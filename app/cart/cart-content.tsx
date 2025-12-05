/**
 * @file cart-content.tsx
 * @description 장바구니 콘텐츠 컴포넌트
 *
 * 장바구니 아이템 목록과 요약을 표시하는 Server Component
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CartItem as CartItemComponent } from "@/components/CartItem";
import { CartSummary } from "@/components/CartSummary";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { getCartItems, removeCartItems, clearCart } from "@/actions/cart";
import { CartItem } from "@/types/cart";
import { ShoppingCart } from "lucide-react";

export function CartContent() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    async function loadCart() {
      setIsLoading(true);
      const result = await getCartItems();
      if (result.success && result.data) {
        setCartItems(result.data);
        // 모든 아이템 선택
        setSelectedItems(new Set(result.data.map((item) => item.id)));
      }
      setIsLoading(false);
    }

    loadCart();
  }, []);

  const handleSelectChange = (itemId: string, selected: boolean) => {
    const newSelected = new Set(selectedItems);
    if (selected) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleRemoveSelected = async () => {
    if (selectedItems.size === 0) {
      alert("삭제할 아이템을 선택해주세요.");
      return;
    }

    if (!confirm(`선택한 ${selectedItems.size}개의 아이템을 삭제하시겠습니까?`)) {
      return;
    }

    setIsRemoving(true);
    const result = await removeCartItems(Array.from(selectedItems));
    
    if (result.success) {
      setCartItems((prev) => prev.filter((item) => !selectedItems.has(item.id)));
      setSelectedItems(new Set());
      router.refresh();
    } else {
      alert(result.error || "삭제에 실패했습니다.");
    }
    
    setIsRemoving(false);
  };

  const handleClearCart = async () => {
    if (!confirm("장바구니를 모두 비우시겠습니까?")) {
      return;
    }

    setIsRemoving(true);
    const result = await clearCart();
    
    if (result.success) {
      setCartItems([]);
      setSelectedItems(new Set());
      router.refresh();
    } else {
      alert(result.error || "장바구니 비우기에 실패했습니다.");
    }
    
    setIsRemoving(false);
  };

  const handleItemRemove = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
    router.refresh();
  };

  const handleOrderComplete = () => {
    setCartItems([]);
    setSelectedItems(new Set());
    router.refresh();
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="장바구니를 불러오는 중..." />;
  }

  if (cartItems.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="장바구니가 비어있습니다"
        description="원하는 상품을 장바구니에 담아보세요."
        action={{
          label: "상품 둘러보기",
          href: "/products",
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 장바구니 아이템 목록 */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            상품 ({cartItems.length}개)
          </h2>
          <div className="flex gap-2">
            {selectedItems.size > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveSelected}
                disabled={isRemoving}
              >
                선택 삭제 ({selectedItems.size})
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCart}
              disabled={isRemoving}
            >
              전체 삭제
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <CartItemComponent
              key={item.id}
              item={item}
              isSelected={selectedItems.has(item.id)}
              onSelectChange={handleSelectChange}
              onRemove={handleItemRemove}
            />
          ))}
        </div>
      </div>

      {/* 장바구니 요약 */}
      <div className="lg:col-span-1">
        <CartSummary cartItems={cartItems} onOrderComplete={handleOrderComplete} />
      </div>
    </div>
  );
}

