/**
 * @file ProductSort.tsx
 * @description 상품 정렬 드롭다운 컴포넌트
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

const SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "price-asc", label: "가격 낮은순" },
  { value: "price-desc", label: "가격 높은순" },
  { value: "name", label: "이름순" },
  { value: "popular", label: "인기순" },
];

export function ProductSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = (searchParams.get("sort") as string) || "latest";

  const updateSort = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex justify-end mb-6">
      <Select value={currentSort} onValueChange={updateSort}>
        <SelectTrigger className="w-[140px] h-9">
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
  );
}

