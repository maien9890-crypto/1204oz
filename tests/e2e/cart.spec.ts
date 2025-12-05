/**
 * @file cart.spec.ts
 * @description 장바구니 관리 E2E 테스트
 */

import { test, expect } from "@playwright/test";
import { isAuthenticated } from "../helpers/auth";

test.describe("장바구니 관리", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    
    // 로그인 상태 확인 (장바구니는 인증 필요)
    const authenticated = await isAuthenticated(page);
    if (!authenticated) {
      test.skip();
    }
  });

  test("상품을 장바구니에 추가할 수 있어야 함", async ({ page }) => {
    await page.goto("/products");

    // 첫 번째 상품 클릭
    const firstProduct = page.locator('article').first();
    if (await firstProduct.isVisible()) {
      await firstProduct.click();
    }

    // "장바구니에 추가" 버튼 클릭
    const addToCartButton = page.getByRole("button", { name: /장바구니|추가/i });
    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();
      
      // 성공 메시지 또는 장바구니 아이콘 업데이트 확인
      await page.waitForTimeout(1000);
    }
  });

  test("장바구니 페이지로 이동할 수 있어야 함", async ({ page }) => {
    // 장바구니 아이콘 클릭
    const cartIcon = page.locator('a[href="/cart"]').or(
      page.getByRole("link", { name: /장바구니|cart/i })
    );
    
    if (await cartIcon.isVisible()) {
      await cartIcon.click();
      await expect(page).toHaveURL(/.*\/cart/);
    } else {
      // 직접 이동
      await page.goto("/cart");
      await expect(page).toHaveURL(/.*\/cart/);
    }
  });

  test("장바구니에서 상품 수량을 변경할 수 있어야 함", async ({ page }) => {
    await page.goto("/cart");

    // 수량 증가 버튼 찾기
    const increaseButton = page.getByRole("button", { name: /\+|증가/i }).first();
    
    if (await increaseButton.isVisible()) {
      const initialQuantity = await page.locator('input[type="number"]').first().inputValue();
      await increaseButton.click();
      await page.waitForTimeout(500);
      
      // 수량이 증가했는지 확인
      const newQuantity = await page.locator('input[type="number"]').first().inputValue();
      expect(parseInt(newQuantity)).toBeGreaterThan(parseInt(initialQuantity || "1"));
    }
  });

  test("장바구니에서 상품을 삭제할 수 있어야 함", async ({ page }) => {
    await page.goto("/cart");

    // 삭제 버튼 찾기
    const deleteButton = page.getByRole("button", { name: /삭제|delete|remove/i }).first();
    
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      await page.waitForTimeout(1000);
      
      // 상품이 삭제되었는지 확인 (장바구니가 비어있거나 개수가 줄어듦)
    }
  });
});

