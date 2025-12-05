/**
 * @file design-tokens.ts
 * @description 디자인 토큰 정의
 *
 * Google Stitch 스타일의 Material Design 3 기반 디자인 시스템
 */

/**
 * Material Design 3 색상 팔레트
 */
export const colors = {
  primary: {
    50: "#E8F0FE",
    100: "#D2E3FC",
    200: "#AECBFA",
    300: "#8AB4F8",
    400: "#669DF6",
    500: "#4285F4", // Google Blue
    600: "#1A73E8",
    700: "#1967D2",
    800: "#185ABC",
    900: "#174EA6",
  },
  secondary: {
    50: "#E6F4EA",
    100: "#CEEAD6",
    200: "#A8DAB5",
    300: "#81C995",
    400: "#5BB974",
    500: "#34A853", // Google Green
    600: "#2E7D32",
    700: "#1E7E34",
    800: "#137333",
    900: "#0D652D",
  },
  accent: {
    50: "#FEF7E0",
    100: "#FEF0C1",
    200: "#FDE293",
    300: "#FDD663",
    400: "#FCC934",
    500: "#FBBC04", // Google Yellow
    600: "#F9AB00",
    700: "#F57F17",
    800: "#F57C00",
    900: "#E65100",
  },
  error: {
    50: "#FCE8E6",
    100: "#F9D0CC",
    200: "#F2A19A",
    300: "#EA4335", // Google Red
    400: "#D93025",
    500: "#C5221F",
    600: "#B31412",
    700: "#A50E0E",
    800: "#8E0B0B",
    900: "#6B0A0A",
  },
  neutral: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#EEEEEE",
    300: "#E0E0E0",
    400: "#BDBDBD",
    500: "#9E9E9E",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },
} as const;

/**
 * 간격 시스템 (8px 그리드)
 */
export const spacing = {
  0: "0",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
} as const;

/**
 * 타이포그래피 스케일
 */
export const typography = {
  display: {
    fontSize: "3.5rem", // 56px
    lineHeight: "1.1",
    fontWeight: 700,
  },
  h1: {
    fontSize: "2.5rem", // 40px
    lineHeight: "1.2",
    fontWeight: 700,
  },
  h2: {
    fontSize: "2rem", // 32px
    lineHeight: "1.3",
    fontWeight: 600,
  },
  h3: {
    fontSize: "1.5rem", // 24px
    lineHeight: "1.4",
    fontWeight: 600,
  },
  h4: {
    fontSize: "1.25rem", // 20px
    lineHeight: "1.4",
    fontWeight: 600,
  },
  body: {
    fontSize: "1rem", // 16px
    lineHeight: "1.5",
    fontWeight: 400,
  },
  small: {
    fontSize: "0.875rem", // 14px
    lineHeight: "1.5",
    fontWeight: 400,
  },
  caption: {
    fontSize: "0.75rem", // 12px
    lineHeight: "1.4",
    fontWeight: 400,
  },
} as const;

/**
 * Border Radius
 */
export const borderRadius = {
  none: "0",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  full: "9999px",
} as const;

/**
 * Elevation (그림자)
 */
export const elevation = {
  0: "none",
  1: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
  2: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
  3: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
  4: "0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)",
  5: "0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)",
} as const;

/**
 * 전환 효과
 */
export const transitions = {
  fast: "150ms ease-in-out",
  default: "200ms ease-in-out",
  slow: "300ms ease-in-out",
} as const;

