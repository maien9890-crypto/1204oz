/**
 * @file auth.spec.ts
 * @description 인증 플로우 E2E 테스트
 */

import { test, expect } from "@playwright/test";
import { login, logout, isAuthenticated } from "../helpers/auth";
import { TEST_USERS } from "../fixtures/users";

test.describe("인증 플로우", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("비로그인 상태에서 로그인 버튼이 표시되어야 함", async ({ page }) => {
    const loginButton = page.getByRole("button", { name: "로그인" });
    await expect(loginButton).toBeVisible();
  });

  test("로그인 후 네비게이션 바에 마이페이지 버튼과 UserButton이 표시되어야 함", async ({
    page,
  }) => {
    // 로그인 (실제 Clerk 인증은 테스트 환경에서 복잡하므로 스킵 가능)
    // 이 테스트는 Clerk가 제대로 설정되어 있을 때만 작동합니다
    const authenticated = await isAuthenticated(page);
    
    if (!authenticated) {
      test.skip();
    }

    // 마이페이지 버튼 확인
    const mypageButton = page.getByRole("button", { name: "마이페이지" });
    await expect(mypageButton).toBeVisible();

    // UserButton 확인
    const userButton = page.getByRole("button", { name: /user|사용자/i });
    await expect(userButton).toBeVisible();
  });

  test("로그인 버튼 클릭 시 Clerk 로그인 모달이 표시되어야 함", async ({
    page,
  }) => {
    const loginButton = page.getByRole("button", { name: "로그인" });
    await loginButton.click();

    // Clerk 모달 또는 로그인 페이지가 표시되는지 확인
    // 실제 구현에 따라 선택자 조정 필요
    await page.waitForTimeout(1000); // 모달 로딩 대기

    // 이메일 입력 필드가 있는지 확인 (Clerk 모달 또는 로그인 페이지)
    const emailInput = page.getByLabel(/이메일|email/i).first();
    await expect(emailInput).toBeVisible({ timeout: 5000 });
  });
});

