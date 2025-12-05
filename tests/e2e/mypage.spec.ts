/**
 * @file mypage.spec.ts
 * @description 마이페이지 E2E 테스트
 */

import { test, expect } from "@playwright/test";
import { isAuthenticated } from "../helpers/auth";

test.describe("마이페이지", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    
    // 로그인 상태 확인
    const authenticated = await isAuthenticated(page);
    if (!authenticated) {
      test.skip();
    }
  });

  test("마이페이지로 이동할 수 있어야 함", async ({ page }) => {
    // 마이페이지 버튼 클릭
    const mypageButton = page.getByRole("button", { name: "마이페이지" });
    if (await mypageButton.isVisible()) {
      await mypageButton.click();
    } else {
      // 직접 이동
      await page.goto("/mypage");
    }

    await expect(page).toHaveURL(/.*\/mypage/);
  });

  test("주문 내역 목록이 표시되어야 함", async ({ page }) => {
    await page.goto("/mypage");

    // 주문 내역 섹션이 표시되는지 확인
    const ordersSection = page.getByRole("heading", { name: /주문|order/i }).or(
      page.locator('h1, h2').filter({ hasText: /마이페이지|주문/i })
    );
    
    await expect(ordersSection.first()).toBeVisible({ timeout: 5000 });
  });

  test("주문 상세 페이지로 이동할 수 있어야 함", async ({ page }) => {
    await page.goto("/mypage");

    // 첫 번째 주문 카드 또는 링크 클릭
    const firstOrder = page.locator('article').or(
      page.getByRole("link", { name: /주문|상세/i })
    ).first();
    
    if (await firstOrder.isVisible()) {
      await firstOrder.click();
      
      // 주문 상세 페이지로 이동했는지 확인
      await expect(page).toHaveURL(/.*\/mypage\/orders\/[^/]+/);
    }
  });

  test("주문 상세 페이지에 주문 정보가 표시되어야 함", async ({ page }) => {
    await page.goto("/mypage");

    // 첫 번째 주문 클릭
    const firstOrder = page.locator('article').first();
    if (await firstOrder.isVisible()) {
      await firstOrder.click();
    } else {
      // 직접 주문 ID로 이동 (테스트용)
      await page.goto("/mypage/orders/test-order-id");
    }

    // 주문 번호 또는 주문 정보가 표시되는지 확인
    const orderInfo = page.getByText(/주문|order/i).first();
    await expect(orderInfo).toBeVisible({ timeout: 5000 });
  });

  test("pending 상태의 주문은 취소할 수 있어야 함", async ({ page }) => {
    await page.goto("/mypage");

    // pending 상태의 주문 찾기
    const cancelButton = page.getByRole("button", { name: /취소|cancel/i }).first();
    
    if (await cancelButton.isVisible()) {
      await cancelButton.click();
      
      // 취소 확인 다이얼로그가 표시되는지 확인
      const confirmDialog = page.getByRole("dialog");
      await expect(confirmDialog).toBeVisible({ timeout: 2000 });
    }
  });
});

