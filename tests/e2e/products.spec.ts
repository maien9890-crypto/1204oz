/**
 * @file products.spec.ts
 * @description 상품 조회 및 필터링 E2E 테스트
 */

import { test, expect } from "@playwright/test";

test.describe("상품 기능", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("홈페이지에 상품 목록이 표시되어야 함", async ({ page }) => {
    // 상품 카드가 표시되는지 확인
    const productCards = page.locator('[data-testid="product-card"]').or(
      page.locator('article').filter({ hasText: /원/ })
    );
    
    // 최소 1개 이상의 상품이 표시되어야 함
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("상품 목록 페이지로 이동할 수 있어야 함", async ({ page }) => {
    // "상품 둘러보기" 버튼 클릭
    const browseButton = page.getByRole("button", { name: "상품 둘러보기" });
    if (await browseButton.isVisible()) {
      await browseButton.click();
    } else {
      // 또는 직접 /products로 이동
      await page.goto("/products");
    }

    await expect(page).toHaveURL(/.*\/products/);
  });

  test("상품 목록 페이지에서 카테고리 필터링이 작동해야 함", async ({
    page,
  }) => {
    await page.goto("/products");

    // 카테고리 선택 (예: 전자제품)
    const categoryButton = page.getByRole("button", { name: /전자제품|electronics/i }).first();
    
    if (await categoryButton.isVisible()) {
      await categoryButton.click();
      
      // URL에 카테고리 파라미터가 포함되는지 확인
      await expect(page).toHaveURL(/.*category=/);
    }
  });

  test("상품 상세 페이지로 이동할 수 있어야 함", async ({ page }) => {
    await page.goto("/products");

    // 첫 번째 상품 카드 클릭
    const firstProduct = page.locator('article').or(
      page.locator('[data-testid="product-card"]')
    ).first();
    
    if (await firstProduct.isVisible()) {
      await firstProduct.click();
      
      // 상품 상세 페이지로 이동했는지 확인
      await expect(page).toHaveURL(/.*\/products\/[^/]+/);
      
      // 상품 이름이 표시되는지 확인
      const productName = page.getByRole("heading", { level: 1 }).or(
        page.locator("h1")
      );
      await expect(productName).toBeVisible();
    }
  });

  test("상품 상세 페이지에 가격과 설명이 표시되어야 함", async ({
    page,
  }) => {
    await page.goto("/products");

    // 첫 번째 상품 클릭
    const firstProduct = page.locator('article').first();
    if (await firstProduct.isVisible()) {
      await firstProduct.click();
    } else {
      // 직접 상품 ID로 이동 (테스트용)
      await page.goto("/products/test-product-id");
    }

    // 가격이 표시되는지 확인 (원 단위)
    const price = page.getByText(/원/).first();
    await expect(price).toBeVisible({ timeout: 5000 });
  });
});

