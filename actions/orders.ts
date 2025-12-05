/**
 * @file orders.ts
 * @description 주문 관련 Server Actions
 *
 * 주문 생성 및 관리 기능을 제공하는 Server Actions
 */

"use server";

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { ShippingAddress, Order, OrderItem } from "@/types/order";
import { getCartItems } from "./cart";
import { clearCart } from "./cart";

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
 * 주문 생성
 */
export async function createOrder(
  shippingAddress: ShippingAddress,
  orderNote?: string
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    // 장바구니 아이템 조회
    const cartResult = await getCartItems();
    if (!cartResult.success || !cartResult.data || cartResult.data.length === 0) {
      return { success: false, error: "장바구니가 비어있습니다." };
    }

    const cartItems = cartResult.data;

    // 재고 확인 및 총액 계산
    let totalAmount = 0;
    const orderItemsData: Array<{
      product_id: string;
      product_name: string;
      quantity: number;
      price: number;
    }> = [];

    for (const cartItem of cartItems) {
      if (!cartItem.product) {
        return {
          success: false,
          error: `상품 정보를 찾을 수 없습니다. (ID: ${cartItem.product_id})`,
        };
      }

      // 재고 확인
      if (cartItem.quantity > cartItem.product.stock_quantity) {
        return {
          success: false,
          error: `${cartItem.product.name}의 재고가 부족합니다. (요청: ${cartItem.quantity}개, 재고: ${cartItem.product.stock_quantity}개)`,
        };
      }

      const itemTotal = cartItem.product.price * cartItem.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        product_id: cartItem.product_id,
        product_name: cartItem.product.name,
        quantity: cartItem.quantity,
        price: cartItem.product.price,
      });
    }

    // 주문 생성 (트랜잭션)
    // 1. orders 테이블에 주문 생성
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        clerk_id: clerkId,
        total_amount: totalAmount,
        status: "pending",
        shipping_address: shippingAddress as any,
        order_note: orderNote || null,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Error creating order:", orderError);
      return { success: false, error: "주문 생성에 실패했습니다." };
    }

    // 2. order_items 테이블에 주문 상세 추가
    const orderItemsToInsert = orderItemsData.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: orderItemsError } = await supabase
      .from("order_items")
      .insert(orderItemsToInsert);

    if (orderItemsError) {
      console.error("Error creating order items:", orderItemsError);
      // 주문 삭제 (롤백)
      await supabase.from("orders").delete().eq("id", order.id);
      return { success: false, error: "주문 상세 생성에 실패했습니다." };
    }

    // 3. 장바구니 비우기
    const clearResult = await clearCart();
    if (!clearResult.success) {
      console.error("Error clearing cart after order:", clearResult.error);
      // 주문은 생성되었지만 장바구니 비우기 실패 (경고만)
    }

    revalidatePath("/cart");
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Unexpected error in createOrder:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 사용자의 주문 목록 조회
 */
export async function getOrders(): Promise<{
  success: boolean;
  data?: Order[];
  error?: string;
}> {
  try {
    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("clerk_id", clerkId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return { success: false, error: "주문 내역을 불러오는데 실패했습니다." };
    }

    return {
      success: true,
      data: (data as Order[]) || [],
    };
  } catch (error) {
    console.error("Unexpected error in getOrders:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 주문 상세 조회 (order_items 포함)
 */
export async function getOrderById(orderId: string): Promise<{
  success: boolean;
  order?: Order;
  orderItems?: OrderItem[];
  error?: string;
}> {
  try {
    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    // 주문 조회
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("clerk_id", clerkId)
      .single();

    if (orderError || !order) {
      return { success: false, error: "주문을 찾을 수 없습니다." };
    }

    // 주문 상세 조회
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
      return { success: false, error: "주문 상세를 불러오는데 실패했습니다." };
    }

    return {
      success: true,
      order: order as Order,
      orderItems: (orderItems as OrderItem[]) || [],
    };
  } catch (error) {
    console.error("Unexpected error in getOrderById:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 주문 취소
 */
export async function cancelOrder(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    // 주문 조회 및 상태 확인
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("clerk_id", clerkId)
      .single();

    if (orderError || !order) {
      return { success: false, error: "주문을 찾을 수 없습니다." };
    }

    // pending 상태만 취소 가능
    if (order.status !== "pending") {
      const statusTextMap: Record<string, string> = {
        pending: "주문 대기",
        confirmed: "주문 확인됨",
        shipped: "배송 중",
        delivered: "배송 완료",
        cancelled: "주문 취소됨",
      };
      const statusText = statusTextMap[order.status] || order.status;
      return {
        success: false,
        error: `${statusText} 상태의 주문은 취소할 수 없습니다.`,
      };
    }

    // 주문 상태를 cancelled로 업데이트
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .eq("clerk_id", clerkId);

    if (updateError) {
      console.error("Error cancelling order:", updateError);
      return { success: false, error: "주문 취소에 실패했습니다." };
    }

    revalidatePath("/mypage");
    revalidatePath(`/mypage/orders/${orderId}`);

    return { success: true };
  } catch (error) {
    console.error("Unexpected error in cancelOrder:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

