/**
 * @file cart.ts
 * @description 장바구니 관련 Server Actions
 *
 * 장바구니 추가, 수정, 삭제 기능을 제공하는 Server Actions
 */

"use server";

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { CartItem } from "@/types/cart";

/**
 * 현재 사용자의 Clerk ID 가져오기
 */
async function getCurrentUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("인증이 필요합니다. 로그인해주세요.");
  }
  return userId;
}

/**
 * 장바구니에 상품 추가
 */
export async function addToCart(
  productId: string,
  quantity: number = 1
): Promise<{ success: boolean; error?: string }> {
  try {
    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    // 재고 확인
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("stock_quantity, is_active")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      return { success: false, error: "상품을 찾을 수 없습니다." };
    }

    if (!product.is_active) {
      return { success: false, error: "판매 중지된 상품입니다." };
    }

    if (product.stock_quantity < quantity) {
      return {
        success: false,
        error: `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`,
      };
    }

    // 기존 장바구니 아이템 확인
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("*")
      .eq("clerk_id", clerkId)
      .eq("product_id", productId)
      .single();

    if (existingItem) {
      // 기존 아이템이 있으면 수량 업데이트
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock_quantity) {
        return {
          success: false,
          error: `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`,
        };
      }

      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", existingItem.id);

      if (updateError) {
        console.error("Error updating cart item:", updateError);
        return { success: false, error: "장바구니 업데이트에 실패했습니다." };
      }
    } else {
      // 새 아이템 추가
      const { error: insertError } = await supabase.from("cart_items").insert({
        clerk_id: clerkId,
        product_id: productId,
        quantity,
      });

      if (insertError) {
        console.error("Error adding to cart:", insertError);
        return { success: false, error: "장바구니에 추가하는데 실패했습니다." };
      }
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error in addToCart:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 장바구니 아이템 수량 변경
 */
export async function updateCartItem(
  cartItemId: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  try {
    if (quantity < 1) {
      return { success: false, error: "수량은 1개 이상이어야 합니다." };
    }

    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    // 장바구니 아이템과 상품 정보 조회
    const { data: cartItem, error: cartError } = await supabase
      .from("cart_items")
      .select("*, product:products(*)")
      .eq("id", cartItemId)
      .eq("clerk_id", clerkId)
      .single();

    if (cartError || !cartItem) {
      return { success: false, error: "장바구니 아이템을 찾을 수 없습니다." };
    }

    const product = cartItem.product as any;
    if (quantity > product.stock_quantity) {
      return {
        success: false,
        error: `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`,
      };
    }

    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", cartItemId)
      .eq("clerk_id", clerkId);

    if (updateError) {
      console.error("Error updating cart item:", updateError);
      return { success: false, error: "수량 변경에 실패했습니다." };
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error in updateCartItem:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 장바구니 아이템 삭제
 */
export async function removeCartItem(
  cartItemId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId)
      .eq("clerk_id", clerkId);

    if (error) {
      console.error("Error removing cart item:", error);
      return { success: false, error: "장바구니에서 삭제하는데 실패했습니다." };
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error in removeCartItem:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 선택한 장바구니 아이템들 삭제
 */
export async function removeCartItems(
  cartItemIds: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    if (cartItemIds.length === 0) {
      return { success: false, error: "삭제할 아이템을 선택해주세요." };
    }

    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .in("id", cartItemIds)
      .eq("clerk_id", clerkId);

    if (error) {
      console.error("Error removing cart items:", error);
      return { success: false, error: "장바구니에서 삭제하는데 실패했습니다." };
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error in removeCartItems:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 장바구니 전체 비우기
 */
export async function clearCart(): Promise<{ success: boolean; error?: string }> {
  try {
    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("clerk_id", clerkId);

    if (error) {
      console.error("Error clearing cart:", error);
      return { success: false, error: "장바구니를 비우는데 실패했습니다." };
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error in clearCart:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 장바구니 아이템 조회 (상품 정보 포함)
 */
export async function getCartItems(): Promise<{
  success: boolean;
  data?: CartItem[];
  error?: string;
}> {
  try {
    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        product:products(
          id,
          name,
          price,
          stock_quantity,
          description,
          category
        )
      `
      )
      .eq("clerk_id", clerkId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching cart items:", error);
      return { success: false, error: "장바구니를 불러오는데 실패했습니다." };
    }

    return {
      success: true,
      data: (data as CartItem[]) || [],
    };
  } catch (error) {
    console.error("Unexpected error in getCartItems:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 장바구니 아이템 수 조회 (네비게이션 바 배지용)
 */
export async function getCartItemCount(): Promise<number> {
  try {
    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    const { count, error } = await supabase
      .from("cart_items")
      .select("*", { count: "exact", head: true })
      .eq("clerk_id", clerkId);

    if (error) {
      console.error("Error fetching cart item count:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Unexpected error in getCartItemCount:", error);
    return 0;
  }
}

