/**
 * @file products.ts
 * @description 상품 관련 유틸리티 함수
 *
 * 상품 필터링, 정렬, 페이지네이션 관련 유틸리티 함수들
 */

import { Product } from "@/types/product";
import { createClient } from "@supabase/supabase-js";

/**
 * 공개 데이터 접근용 Supabase 클라이언트 생성
 * 인증이 필요 없는 공개 데이터 조회에 사용
 */
function createPublicSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    const missingVars: string[] = [];
    if (!supabaseUrl) missingVars.push("NEXT_PUBLIC_SUPABASE_URL");
    if (!supabaseKey) missingVars.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

    throw new Error(
      `Supabase 환경변수가 설정되지 않았습니다. 다음 변수들을 확인하세요: ${missingVars.join(
        ", ",
      )}`,
    );
  }

  // URL 형식 검증
  try {
    new URL(supabaseUrl);
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL이 유효한 URL 형식이 아닙니다: ${supabaseUrl}`,
    );
  }

  return createClient(supabaseUrl, supabaseKey);
}

export const PRODUCTS_PER_PAGE = 12;

export const VALID_CATEGORIES = [
  "electronics",
  "clothing",
  "books",
  "food",
  "sports",
  "beauty",
  "home",
] as const;

export type SortOption =
  | "latest"
  | "price-asc"
  | "price-desc"
  | "name"
  | "popular";

export interface ProductFilters {
  category?: string;
  sort?: SortOption;
  page?: number;
}

/**
 * 카테고리 유효성 검증
 */
export function validateCategory(category: string | null | undefined): boolean {
  if (!category) return true;
  return VALID_CATEGORIES.includes(category as any);
}

/**
 * 필터, 정렬, 페이지네이션을 적용한 상품 조회
 */
export async function getProductsWithFilters(
  filters: ProductFilters = {},
): Promise<{
  products: Product[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}> {
  try {
    const supabase = createPublicSupabaseClient();
    const { category, sort = "latest", page = 1 } = filters;

    // 기본 쿼리 빌더
    // is_active가 true이거나 NULL인 경우 포함 (개발 환경: NULL도 활성으로 간주)
    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .or("is_active.eq.true,is_active.is.null");

    // 카테고리 필터
    if (category && validateCategory(category)) {
      query = query.eq("category", category);
    }

    // 정렬 옵션
    switch (sort) {
      case "latest":
        query = query.order("created_at", { ascending: false });
        break;
      case "price-asc":
        query = query.order("price", { ascending: true });
        break;
      case "price-desc":
        query = query.order("price", { ascending: false });
        break;
      case "name":
        query = query.order("name", { ascending: true });
        break;
      case "popular":
        // 인기순은 현재 주문 수 기준이 없으므로 최신순으로 대체
        query = query.order("created_at", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    // 페이지네이션
    const from = (page - 1) * PRODUCTS_PER_PAGE;
    const to = from + PRODUCTS_PER_PAGE - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      // 에러 객체를 안전하게 직렬화
      const errorInfo: Record<string, unknown> = {};
      if (error.message) errorInfo.message = error.message;
      if (error.details) errorInfo.details = error.details;
      if (error.hint) errorInfo.hint = error.hint;
      if (error.code) errorInfo.code = error.code;

      // 에러 정보가 없으면 전체 에러 객체를 문자열로 변환
      if (Object.keys(errorInfo).length === 0) {
        errorInfo.rawError = String(error);
        errorInfo.errorType = typeof error;
      }

      console.error("Error fetching products:", errorInfo);
      return {
        products: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: page,
      };
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

    return {
      products: (data as Product[]) || [],
      totalCount,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    // 환경변수 오류인지 확인
    if (error instanceof Error && error.message.includes("환경변수")) {
      console.error("환경변수 오류:", error.message);
    } else {
      console.error("Unexpected error in getProductsWithFilters:", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
    return {
      products: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: filters.page || 1,
    };
  }
}

/**
 * ID로 단일 상품 조회
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = createPublicSupabaseClient();

    // is_active가 true이거나 NULL인 경우 포함 (개발 환경: NULL도 활성으로 간주)
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .or("is_active.eq.true,is_active.is.null")
      .single();

    if (error) {
      // 에러 객체를 안전하게 직렬화
      const errorInfo: Record<string, unknown> = {
        productId: id,
      };
      if (error.message) errorInfo.message = error.message;
      if (error.details) errorInfo.details = error.details;
      if (error.hint) errorInfo.hint = error.hint;
      if (error.code) errorInfo.code = error.code;

      // 에러 정보가 없으면 전체 에러 객체를 문자열로 변환
      if (Object.keys(errorInfo).length === 1) {
        errorInfo.rawError = String(error);
        errorInfo.errorType = typeof error;
      }

      console.error("Error fetching product:", errorInfo);
      return null;
    }

    return data as Product | null;
  } catch (error) {
    // 환경변수 오류인지 확인
    if (error instanceof Error && error.message.includes("환경변수")) {
      console.error("환경변수 오류:", error.message);
    } else {
      console.error("Unexpected error in getProductById:", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        productId: id,
      });
    }
    return null;
  }
}

/**
 * 총 페이지 수 계산
 */
export function getTotalPages(totalCount: number): number {
  return Math.ceil(totalCount / PRODUCTS_PER_PAGE);
}
