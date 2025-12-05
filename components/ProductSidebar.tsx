/**
 * @file ProductSidebar.tsx
 * @description 상품 목록 페이지 사이드바 필터 컴포넌트
 *
 * 카테고리, 가격대, 색상, 사이즈 필터를 제공하는 사이드바
 */

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RotateCcw } from "lucide-react";
import { VALID_CATEGORIES } from "@/lib/utils/products";

const CATEGORY_LABELS: Record<string, string> = {
  electronics: "전자제품",
  clothing: "의류",
  books: "도서",
  food: "식품",
  sports: "스포츠",
  beauty: "뷰티",
  home: "생활/가정",
};

const COLORS = [
  { name: "파란색", value: "blue", hex: "#3b82f6" },
  { name: "흰색", value: "white", hex: "#ffffff" },
  { name: "회색", value: "gray", hex: "#6b7280" },
  { name: "빨간색", value: "red", hex: "#ef4444" },
  { name: "초록색", value: "green", hex: "#10b981" },
  { name: "노란색", value: "yellow", hex: "#f59e0b" },
  { name: "보라색", value: "purple", hex: "#8b5cf6" },
  { name: "분홍색", value: "pink", hex: "#ec4899" },
  { name: "주황색", value: "orange", hex: "#f97316" },
];

const SIZES = ["S", "M", "L", "XL", "Free"];

export function ProductSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";
  const currentColor = searchParams.get("color") || "";
  const currentSize = searchParams.get("size") || "";

  const updateQuery = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  const resetFilters = () => {
    router.push("/products");
  };

  return (
    <aside className="w-full md:w-64 space-y-6">
      {/* 브레드크럼 */}
      <div className="space-y-2">
        <nav className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            홈
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">전체 상품</span>
        </nav>
        <h2 className="text-2xl font-bold">전체 상품</h2>
      </div>

      {/* 카테고리 필터 */}
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">카테고리</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="category-all"
              checked={!currentCategory}
              onCheckedChange={() => updateQuery("category", null)}
            />
            <Label htmlFor="category-all" className="text-sm font-normal cursor-pointer">
              All
            </Label>
          </div>
          {VALID_CATEGORIES.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={currentCategory === category}
                onCheckedChange={(checked) =>
                  updateQuery("category", checked ? category : null)
                }
              />
              <Label
                htmlFor={`category-${category}`}
                className="text-sm font-normal cursor-pointer"
              >
                {CATEGORY_LABELS[category] || category}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 가격대 필터 */}
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">가격대</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>₩10,000</span>
              <span>₩200,000+</span>
            </div>
            <div className="relative h-2 bg-muted rounded-full">
              <div className="absolute left-0 top-0 h-full w-3/4 bg-primary rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 색상 필터 */}
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">색상</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            {COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => updateQuery("color", currentColor === color.value ? null : color.value)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  currentColor === color.value
                    ? "border-foreground scale-110"
                    : "border-border hover:border-primary/50"
                }`}
                style={{ backgroundColor: color.hex }}
                aria-label={color.name}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 사이즈 필터 */}
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">사이즈</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((size) => (
              <Button
                key={size}
                variant={currentSize === size ? "default" : "outline"}
                size="sm"
                onClick={() => updateQuery("size", currentSize === size ? null : size)}
                className="h-8"
              >
                {size}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 필터 초기화 */}
      <Button
        variant="outline"
        onClick={resetFilters}
        className="w-full"
        size="sm"
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        필터초기화
      </Button>
    </aside>
  );
}

