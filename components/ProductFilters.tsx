/**
 * @file ProductFilters.tsx
 * @description 상품 필터 및 정렬 UI 컴포넌트
 *
 * 카테고리 필터와 정렬 옵션을 제공하는 클라이언트 컴포넌트
 * URL 쿼리 파라미터와 동기화
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SortOption, VALID_CATEGORIES } from "@/lib/utils/products";

const CATEGORY_LABELS: Record<string, string> = {
  electronics: "전자제품",
  clothing: "의류",
  books: "도서",
  food: "식품",
  sports: "스포츠",
  beauty: "뷰티",
  home: "생활/가정",
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "price-asc", label: "가격 낮은순" },
  { value: "price-desc", label: "가격 높은순" },
  { value: "name", label: "이름순" },
  { value: "popular", label: "인기순" },
];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";
  const currentSort = (searchParams.get("sort") as SortOption) || "latest";

  const updateQuery = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // 페이지는 필터 변경 시 1로 리셋
    params.delete("page");

    router.push(`/products?${params.toString()}`);
  };

  const handleCategoryChange = (value: string) => {
    updateQuery("category", value === "all" ? null : value);
  };

  const handleSortChange = (value: string) => {
    updateQuery("sort", value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-12 p-6 bg-muted/30 rounded-xl border border-border/50">
      {/* 카테고리 필터 */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-semibold whitespace-nowrap text-foreground">
          카테고리:
        </label>
        <Select
          value={currentCategory || "all"}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-[180px] h-10">
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {VALID_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {CATEGORY_LABELS[category] || category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 정렬 옵션 */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-semibold whitespace-nowrap text-foreground">정렬:</label>
        <Select value={currentSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px] h-10">
            <SelectValue placeholder="정렬 선택" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
