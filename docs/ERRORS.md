# 오류 해결 가이드

이 문서는 프로젝트에서 발생한 오류들과 그 해결 방법을 기록합니다.

## 목차

1. [Supabase 쿼리 오류](#supabase-쿼리-오류)
2. [Clerk 인증 오류](#clerk-인증-오류)
3. [환경변수 오류](#환경변수-오류)
4. [일반적인 오류 패턴](#일반적인-오류-패턴)

---

## Supabase 쿼리 오류

### 오류 1: "Error fetching products: {}"

**발생 위치:**

- `lib/utils/products.ts` - `getProductsWithFilters` 함수
- `app/page.tsx` - `getFeaturedProducts` 함수

**원인:**

- Supabase 클라이언트가 인증 토큰을 요구하는데, 공개 데이터 접근 시 토큰이 없음
- 환경변수가 설정되지 않음
- 데이터베이스 테이블이 존재하지 않음

**해결 방법:**

1. **공개 데이터용 클라이언트 사용**

   - 인증이 필요 없는 공개 데이터 조회에는 `createPublicSupabaseClient()` 사용
   - `lib/utils/products.ts`에서 공개 클라이언트로 변경

2. **환경변수 확인**

   ```bash
   # .env.local 파일에 다음 변수들이 설정되어 있는지 확인
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **데이터베이스 테이블 확인**
   - Supabase 대시보드에서 `products` 테이블이 존재하는지 확인
   - 마이그레이션이 적용되었는지 확인

**수정된 코드:**

```typescript
// lib/utils/products.ts
function createPublicSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  }

  return createClient(supabaseUrl, supabaseKey);
}
```

---

## Clerk 인증 오류

### 오류 2: "Suffixed cookie failed due to Cannot read properties of undefined (reading 'digest')"

**발생 위치:**

- Clerk 브라우저 클라이언트 초기화 시
- 개발 환경에서 HTTP로 접근할 때

**원인:**

- Clerk가 secure context (HTTPS)를 요구하는데 HTTP로 접근
- 개발 환경에서 쿠키 설정 문제

**해결 방법:**

1. **개발 환경 설정 확인**

   - 로컬 개발 시 `http://localhost:3000` 사용 (문제 없음)
   - 네트워크 IP로 접근 시 (`http://192.168.x.x:3000`) 문제 발생 가능

2. **Clerk 환경변수 확인**

   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

3. **Clerk 대시보드 설정**
   - Clerk 대시보드에서 개발 키 사용 중인지 확인
   - 프로덕션 배포 시 프로덕션 키로 변경 필요

**참고:**

- 이 오류는 개발 환경에서만 발생하며, 기능에는 큰 영향이 없을 수 있음
- 프로덕션 환경(HTTPS)에서는 발생하지 않음

---

## 환경변수 오류

### 오류 3: 환경변수 미설정

**증상:**

- "Supabase 환경변수가 설정되지 않았습니다" 에러
- 빈 객체 `{}`가 에러로 표시됨

**해결 방법:**

1. **`.env.local` 파일 생성**

   ```bash
   # 프로젝트 루트에 .env.local 파일 생성
   cp .env.example .env.local
   ```

2. **필수 환경변수 설정**

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

3. **개발 서버 재시작**
   ```bash
   # 환경변수 변경 후 반드시 서버 재시작
   pnpm dev
   ```

---

## 일반적인 오류 패턴

### 패턴 1: 빈 에러 객체 `{}`

**원인:**

- 에러 객체가 직렬화되지 않음
- `console.error`에 객체를 직접 전달

**해결:**

```typescript
// ❌ 나쁜 예
console.error("Error:", error);

// ✅ 좋은 예
console.error("Error:", {
  message: error.message,
  details: error.details,
  hint: error.hint,
  code: error.code,
});
```

### 패턴 2: 인증이 필요한 데이터를 공개 클라이언트로 접근

**해결:**

- 공개 데이터: `createPublicSupabaseClient()` 사용
- 인증 필요 데이터: `createClerkSupabaseClient()` 사용

### 패턴 3: 비동기 함수에서 에러 처리 누락

**해결:**

```typescript
// ✅ try-catch로 감싸기
async function fetchData() {
  try {
    const data = await someAsyncOperation();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return defaultValue;
  }
}
```

---

## 오류 확인 체크리스트

새로운 기능을 추가하거나 코드를 수정할 때 다음을 확인하세요:

- [ ] 환경변수가 모두 설정되어 있는가?
  - `.env.local` 파일이 프로젝트 루트에 존재하는가?
  - `NEXT_PUBLIC_SUPABASE_URL`이 설정되어 있는가?
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`가 설정되어 있는가?
  - 환경변수 변경 후 개발 서버를 재시작했는가?
- [ ] Supabase 클라이언트가 적절한 타입인가? (공개 vs 인증)
  - 공개 데이터 조회: `createPublicSupabaseClient()` 사용
  - 인증 필요 데이터: `createClerkSupabaseClient()` 사용
- [ ] 에러 처리가 적절한가?
  - try-catch로 예외 처리
  - 에러 객체를 직렬화하여 로깅 (빈 객체 방지)
  - 기본값 반환 (빈 배열, null 등)
- [ ] 데이터베이스 테이블이 존재하는가?
  - Supabase 대시보드에서 `products` 테이블 확인
  - 테이블 구조가 예상과 일치하는가?
- [ ] 마이그레이션이 적용되었는가?
  - `supabase/migrations/` 폴더의 마이그레이션 파일 확인
  - Supabase 대시보드에서 마이그레이션 적용 상태 확인
- [ ] RLS 정책이 올바르게 설정되어 있는가?
  - 개발 환경: RLS 비활성화 (현재 설정)
  - 프로덕션: 적절한 RLS 정책 필요

---

## 오류 보고 방법

새로운 오류를 발견했을 때:

1. 오류 메시지 전체를 복사
2. 오류가 발생한 파일과 라인 번호 기록
3. 재현 단계 작성
4. 이 문서에 추가

---

## 업데이트 이력

- 2025-01-XX: 초기 문서 작성
  - Supabase 쿼리 오류 추가
  - Clerk 인증 오류 추가
  - 환경변수 오류 추가
