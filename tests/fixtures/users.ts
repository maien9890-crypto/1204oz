/**
 * @file users.ts
 * @description 테스트용 사용자 데이터
 */

export const TEST_USERS = {
  valid: {
    email: "test@example.com",
    password: "TestPassword123!",
  },
  invalid: {
    email: "invalid@example.com",
    password: "wrongpassword",
  },
} as const;

