/**
 * @file auth.ts
 * @description 인증 관련 테스트 헬퍼 함수
 */

import { Page } from "@playwright/test";
import { TEST_USERS } from "../fixtures/users";

/**
 * 로그인 플로우 실행
 */
export async function login(page: Page, email?: string, password?: string) {
  const userEmail = email || TEST_USERS.valid.email;
  const userPassword = password || TEST_USERS.valid.password;

  // 로그인 버튼 클릭
  await page.getByRole("button", { name: "로그인" }).click();

  // Clerk 모달이 나타날 때까지 대기
  await page.waitForSelector('[data-testid="clerk-modal"]', {
    timeout: 5000,
  }).catch(() => {
    // 모달이 없으면 직접 로그인 페이지로 이동
    return page.goto("/sign-in");
  });

  // 이메일 입력
  const emailInput = page.getByLabel(/이메일|email/i);
  await emailInput.fill(userEmail);

  // 비밀번호 입력
  const passwordInput = page.getByLabel(/비밀번호|password/i);
  await passwordInput.fill(userPassword);

  // 로그인 버튼 클릭
  await page.getByRole("button", { name: /로그인|sign in/i }).click();

  // 로그인 완료 대기 (홈페이지로 리다이렉트되거나 네비게이션 바 변경)
  await page.waitForURL(/^http:\/\/localhost:3000\/$/, { timeout: 10000 });
}

/**
 * 로그아웃 플로우 실행
 */
export async function logout(page: Page) {
  // UserButton 클릭
  await page.getByRole("button", { name: /user|사용자/i }).click();

  // 로그아웃 옵션 클릭
  await page.getByRole("menuitem", { name: /로그아웃|sign out/i }).click();

  // 로그아웃 완료 대기
  await page.waitForURL(/^http:\/\/localhost:3000\/$/, { timeout: 5000 });
}

/**
 * 인증 상태 확인
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    // UserButton이 보이면 로그인 상태
    await page.getByRole("button", { name: /user|사용자/i }).waitFor({
      timeout: 2000,
    });
    return true;
  } catch {
    // 로그인 버튼이 보이면 비로그인 상태
    try {
      await page.getByRole("button", { name: "로그인" }).waitFor({
        timeout: 2000,
      });
      return false;
    } catch {
      return false;
    }
  }
}

