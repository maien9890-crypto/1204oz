/**
 * @file animations.ts
 * @description 애니메이션 유틸리티 함수
 *
 * Google Stitch 스타일의 부드러운 애니메이션 효과
 */

import { cn } from "@/lib/utils";

/**
 * 카드 hover 애니메이션 클래스
 */
export const cardHover = cn(
  "transition-all duration-200",
  "hover:-translate-y-1",
  "hover:shadow-lg"
);

/**
 * 버튼 클릭 애니메이션 클래스
 */
export const buttonPress = cn(
  "transition-transform duration-150",
  "active:scale-[0.98]"
);

/**
 * 페이드 인 애니메이션 클래스
 */
export const fadeIn = cn(
  "animate-in fade-in duration-300"
);

/**
 * 슬라이드 업 애니메이션 클래스
 */
export const slideUp = cn(
  "animate-in slide-in-from-bottom-4 duration-300"
);

/**
 * 스케일 인 애니메이션 클래스
 */
export const scaleIn = cn(
  "animate-in zoom-in-95 duration-200"
);

