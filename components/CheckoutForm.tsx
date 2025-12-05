/**
 * @file CheckoutForm.tsx
 * @description 주문 정보 입력 폼 컴포넌트
 *
 * 배송지 정보와 주문 메모를 입력받는 폼
 * react-hook-form + Zod 검증 사용
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createOrder } from "@/actions/orders";
import { ShippingAddress } from "@/types/order";
import { formatPrice } from "@/lib/utils";
import { PaymentModal } from "./PaymentModal";
import { PaymentRequest } from "@/types/payment";
import { useAuth } from "@clerk/nextjs";

const checkoutSchema = z.object({
  recipient: z
    .string()
    .min(1, "수령인을 입력해주세요.")
    .max(50, "수령인 이름은 50자 이하여야 합니다.")
    .regex(
      /^[가-힣a-zA-Z\s]+$/,
      "수령인 이름은 한글 또는 영문만 입력 가능합니다.",
    ),
  phone: z
    .string()
    .min(1, "연락처를 입력해주세요.")
    .regex(
      /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/,
      "올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)",
    ),
  postalCode: z
    .string()
    .min(1, "우편번호를 입력해주세요.")
    .regex(
      /^\d{5}$|^\d{5}-\d{3}$/,
      "올바른 우편번호 형식이 아닙니다. (예: 12345 또는 12345-678)",
    ),
  address: z
    .string()
    .min(1, "주소를 입력해주세요.")
    .max(200, "주소는 200자 이하여야 합니다."),
  detailAddress: z
    .string()
    .max(100, "상세주소는 100자 이하여야 합니다.")
    .optional(),
  orderNote: z
    .string()
    .max(500, "주문 메모는 500자 이하여야 합니다.")
    .optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  totalAmount: number;
  onCancel: () => void;
  onSuccess: () => void;
}

export function CheckoutForm({
  totalAmount,
  onCancel,
  onSuccess,
}: CheckoutFormProps) {
  const { userId } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
    null,
  );

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      recipient: "",
      phone: "",
      postalCode: "",
      address: "",
      detailAddress: "",
      orderNote: "",
    },
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);

    try {
      const shippingAddress: ShippingAddress = {
        recipient: data.recipient,
        phone: data.phone,
        postalCode: data.postalCode,
        address: data.address,
        detailAddress: data.detailAddress || "",
      };

      const result = await createOrder(
        shippingAddress,
        data.orderNote || undefined,
      );

      if (result.success && result.orderId) {
        // 주문 생성 성공 시 결제 모달 표시
        const orderName = `주문 #${result.orderId.slice(0, 8)}`;
        setPaymentRequest({
          orderId: result.orderId,
          amount: totalAmount,
          orderName,
          customerName: data.recipient,
          customerPhone: data.phone,
        });
        setShowPaymentModal(true);
      } else {
        alert(result.error || "주문 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("주문 생성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">주문 정보 입력</h2>
        <p className="text-lg font-semibold text-primary mt-2">
          총 금액: {formatPrice(totalAmount)}
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>수령인 *</FormLabel>
                  <FormControl>
                    <Input placeholder="홍길동" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>연락처 *</FormLabel>
                  <FormControl>
                    <Input placeholder="010-1234-5678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>우편번호 *</FormLabel>
                  <FormControl>
                    <Input placeholder="12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>주소 *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="서울시 강남구 테헤란로 123"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="detailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>상세주소</FormLabel>
                  <FormControl>
                    <Input placeholder="101동 101호" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="orderNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>주문 메모</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="배송 시 요청사항을 입력해주세요."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex-1"
              >
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "주문 처리 중..." : "주문하기"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>

      {/* 결제 모달 */}
      {paymentRequest && (
        <PaymentModal
          open={showPaymentModal}
          onOpenChange={setShowPaymentModal}
          paymentRequest={paymentRequest}
          onSuccess={() => {
            setShowPaymentModal(false);
            onSuccess();
          }}
        />
      )}
    </Card>
  );
}
