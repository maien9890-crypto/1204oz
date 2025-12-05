/**
 * @file payments.ts
 * @description 결제 관련 Server Actions
 *
 * 결제 검증 및 주문 상태 업데이트 기능
 */

"use server";

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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
 * 결제 검증 및 주문 확인
 */
export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    // 주문 조회 및 검증
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("clerk_id", clerkId)
      .single();

    if (orderError || !order) {
      return { success: false, error: "주문을 찾을 수 없습니다." };
    }

    // 금액 검증
    if (order.total_amount !== amount) {
      console.error("Payment amount mismatch:", {
        orderAmount: order.total_amount,
        paymentAmount: amount,
      });
      return { success: false, error: "결제 금액이 일치하지 않습니다." };
    }

    // 주문 상태 확인 (이미 확인된 주문인지)
    if (order.status !== "pending") {
      return {
        success: false,
        error: `이미 처리된 주문입니다. (현재 상태: ${order.status})`,
      };
    }

    // Toss Payments API로 결제 검증 (서버 사이드)
    const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY;
    if (!secretKey) {
      console.error("TOSS_PAYMENTS_SECRET_KEY가 설정되지 않았습니다.");
      return { success: false, error: "결제 검증 설정 오류입니다." };
    }

    try {
      const response = await fetch(
        `https://api.tosspayments.com/v1/payments/${paymentKey}`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${Buffer.from(secretKey + ":").toString(
              "base64",
            )}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Toss Payments API error:", errorData);
        return {
          success: false,
          error: `결제 검증 실패: ${errorData.message || "알 수 없는 오류"}`,
        };
      }

      const paymentData = await response.json();

      // 결제 정보 검증
      if (
        paymentData.orderId !== orderId ||
        paymentData.totalAmount !== amount
      ) {
        return {
          success: false,
          error: "결제 정보가 일치하지 않습니다.",
        };
      }

      // 주문 상태 업데이트
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: "confirmed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId)
        .eq("clerk_id", clerkId);

      if (updateError) {
        console.error("Error updating order status:", updateError);
        return { success: false, error: "주문 상태 업데이트에 실패했습니다." };
      }

      revalidatePath("/cart");
      revalidatePath(`/orders/${orderId}`);

      return { success: true };
    } catch (apiError) {
      console.error("Toss Payments API request error:", apiError);
      return {
        success: false,
        error: "결제 검증 중 오류가 발생했습니다.",
      };
    }
  } catch (error) {
    console.error("Unexpected error in confirmPayment:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 주문 상태 업데이트
 */
export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled",
): Promise<{ success: boolean; error?: string }> {
  try {
    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    const { error } = await supabase
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .eq("clerk_id", clerkId);

    if (error) {
      console.error("Error updating order status:", error);
      return { success: false, error: "주문 상태 업데이트에 실패했습니다." };
    }

    revalidatePath("/cart");
    revalidatePath(`/orders/${orderId}`);

    return { success: true };
  } catch (error) {
    console.error("Unexpected error in updateOrderStatus:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    };
  }
}
