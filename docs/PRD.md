당신은 풀스택 웹 개발자입니다. 아래 요구사항에 따라 의류 쇼핑몰 MVP를 개발해주세요.

## 쇼핑몰 1차 MVP - PRD (Product Requirements Document)

## 📋 프로젝트 개요

### 목적

- **핵심 목표**: 최소 기능으로 빠른 시장 검증
- **검증 가설**: 간단한 구조와 적은 기능으로도 실제 구매 전환이 일어나는지 확인
- **출시 형태**: 테스트 결제 기능을 포함한 실동작 쇼핑몰

### 핵심 가치

- 옷 판매에 집중한 단순 명료한 쇼핑 경험
- 빠른 로그인/회원가입, 간편한 결제 프로세스

---

## 🎯 타겟 사용자

### Primary User

- **연령대**: 20-30대
- **특징**: 온라인 쇼핑에 익숙하고, 간편한 구매 프로세스를 선호

---

## 🏗️ 기술 스택

### Package Manager

- pnpm

### Frontend

- Next.js 15.5.6 (App Router, React 19)
- TypeScript (strict mode)
- Tailwind CSS v4
- shadcn/ui (Radix UI 기반)
- React Hook Form + Zod (폼 검증)

### Backend & Database

- Supabase (PostgreSQL)

### 인증

- Clerk (로그인/회원가입)
- Supabase에는 사용자 추가 정보만 저장
- supabase에 RLS는 사용하지 않습니다.

### 결제

- Toss Payments SDK (테스트 모드)
- 결제 위젯 통합
- 결제 성공/실패 콜백 처리

### 테스트

- Playwright (E2E 테스트)
- 테스트 커버리지: 인증, 상품, 장바구니, 주문, 결제, 마이페이지

---

## 🚀 개발 완료 현황

### Phase 1: 기본 인프라 ✅

- [x] Next.js 15.5.6 프로젝트 셋업 (App Router, React 19)
- [x] Supabase 프로젝트 생성 및 테이블 스키마 작성
  - `products`: 상품 정보
  - `cart_items`: 장바구니 아이템
  - `orders`: 주문 정보
  - `order_items`: 주문 상세 아이템
- [x] Clerk 연동 (회원가입/로그인, 한국어 지원)
- [x] 기본 레이아웃 및 라우팅
- [x] Clerk ↔ Supabase 사용자 동기화

### Phase 2: 상품 기능 ✅

- [x] 홈페이지 (프로모션 배너, 카테고리 섹션, 추천 상품)
- [x] 상품 목록 페이지 (Grid 레이아웃, 페이지네이션)
- [x] 카테고리 필터링 (전자제품, 의류, 도서, 식품, 스포츠, 뷰티, 생활/가정)
- [x] 상품 정렬 (최신순, 가격 낮은순, 가격 높은순, 이름순)
- [x] 상품 상세 페이지 (재고, 가격, 설명 표시)
- [x] 어드민 상품 등록 (Supabase 대시보드에서 직접 관리)

### Phase 3: 장바구니 & 주문 ✅

- [x] 장바구니 기능 (추가/삭제/수량 변경)
- [x] 장바구니 아이템 선택 및 일괄 삭제
- [x] 주문 프로세스 구현 (배송지 정보 입력)
- [x] 주문 테이블 연동 (`orders`, `order_items`)
- [x] 주문 총액 검증 및 재고 확인

### Phase 4: 결제 통합 ✅

- [x] Toss Payments 위젯 연동 (테스트 모드)
- [x] 결제 위젯 및 모달 구현
- [x] 결제 성공/실패 콜백 처리
- [x] 결제 완료 후 주문 상태 업데이트 (`orders.status`)
- [x] 결제 검증 및 주문 상태 관리

### Phase 5: 마이페이지 ✅

- [x] 주문 내역 목록 조회 (사용자별 `orders`)
- [x] 주문 상세 보기 (`order_items` 포함)
- [x] 주문 취소 기능 (pending 상태만)

### Phase 6: 테스트 & 배포 ✅

- [x] 전체 플로우 E2E 테스트 (Playwright)
- [x] 버그 수정 및 예외처리 강화
- [x] 에러 바운더리 및 전역 에러 페이지
- [x] 로딩 상태 및 빈 상태 UI
- [x] Vercel 배포 설정 및 환경변수 구성

**개발 완료일: 2025년 1월**

---

## 📈 성공 지표 (MVP 검증 기준)

### 정량적 지표

- 회원가입 수: 최소 50명
- 실제 테스트 결제 시도: 최소 10건
- 결제 완료율: 50% 이상
- 장바구니 추가율: 방문자 대비 20%

### 정성적 지표

- 사용자 피드백 수집 (간단한 설문)
- 주요 개선 포인트 파악
- 기술 스택 검증 (Clerk + Supabase + Toss Payments 조합)

---

## 🚨 제약사항 및 주의사항

- Supabase RLS는 사용하지 않습니다 (서버 사이드에서 권한 체크)
- 어드민 기능은 MVP에 포함하지 않습니다 (상품 등록은 Supabase 대시보드에서 직접)
- 결제는 반드시 테스트 모드로만 운영
- 실제 배송 기능은 구현하지 않습니다 (주문 상태만 관리)
- 상품 리뷰, 찜하기, 쿠폰 등의 부가 기능은 제외

## 📊 데이터베이스 스키마

### 테이블 구조

**products**

- `id` (UUID, PK)
- `name` (TEXT)
- `description` (TEXT)
- `price` (DECIMAL)
- `category` (TEXT)
- `stock_quantity` (INTEGER)
- `is_active` (BOOLEAN)
- `created_at`, `updated_at` (TIMESTAMPTZ)

**cart_items**

- `id` (UUID, PK)
- `clerk_id` (TEXT)
- `product_id` (UUID, FK)
- `quantity` (INTEGER)
- `created_at`, `updated_at` (TIMESTAMPTZ)

**orders**

- `id` (UUID, PK)
- `clerk_id` (TEXT)
- `total_amount` (DECIMAL)
- `status` (TEXT: pending, confirmed, shipped, delivered, cancelled)
- `shipping_address` (JSONB)
- `order_note` (TEXT)
- `created_at`, `updated_at` (TIMESTAMPTZ)

**order_items**

- `id` (UUID, PK)
- `order_id` (UUID, FK)
- `product_id` (UUID, FK)
- `product_name` (TEXT)
- `quantity` (INTEGER)
- `price` (DECIMAL)
- `created_at` (TIMESTAMPTZ)

## 🛠️ 주요 기능 상세

### 인증 시스템

- Clerk를 통한 소셜 로그인 (이메일, Google 등)
- Clerk 사용자 자동으로 Supabase `users` 테이블에 동기화
- 한국어 UI 지원

### 상품 관리

- 카테고리별 상품 필터링
- 정렬 기능 (최신순, 가격순, 이름순)
- 페이지네이션 (페이지당 12개 상품)
- 상품 상세 정보 표시

### 장바구니

- 상품 추가/삭제
- 수량 변경
- 선택 아이템 일괄 삭제
- 장바구니 아이콘 배지 (아이템 수 표시)

### 주문 및 결제

- 배송지 정보 입력 (수령인, 연락처, 주소)
- 주문 메모 입력
- Toss Payments 테스트 결제
- 결제 완료 후 주문 상태 자동 업데이트

### 마이페이지

- 주문 내역 목록 조회
- 주문 상세 정보 확인
- 주문 취소 (pending 상태만 가능)

## 📦 배포 정보

### 배포 플랫폼

- Vercel (프로덕션)
- 환경변수: Clerk, Supabase, Toss Payments 키 설정 완료

### 환경변수 목록

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY`
- `TOSS_PAYMENTS_SECRET_KEY`

## 📈 성공 지표 (MVP 검증 기준)

### 정량적 지표

- 회원가입 수: 최소 50명
- 실제 테스트 결제 시도: 최소 10건
- 결제 완료율: 50% 이상
- 장바구니 추가율: 방문자 대비 20%

### 정성적 지표

- 사용자 피드백 수집 (간단한 설문)
- 주요 개선 포인트 파악
- 기술 스택 검증 (Clerk + Supabase + Toss Payments 조합)

---
