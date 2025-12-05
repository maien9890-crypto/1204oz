/**
 * @file CategorySection.tsx
 * @description 카테고리 링크 섹션 컴포넌트
 *
 * 홈페이지에 표시할 카테고리 링크 그리드
 * 각 카테고리를 클릭하면 해당 카테고리의 상품 목록으로 이동
 */

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  { id: "electronics", name: "전자제품", icon: "📱" },
  { id: "clothing", name: "의류", icon: "👕" },
  { id: "books", name: "도서", icon: "📚" },
  { id: "food", name: "식품", icon: "🍎" },
  { id: "sports", name: "스포츠", icon: "⚽" },
  { id: "beauty", name: "뷰티", icon: "💄" },
  { id: "home", name: "생활/가정", icon: "🏠" },
];

export function CategorySection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/products?category=${category.id}`} className="group">
            <Card className="h-full transition-all duration-200 hover:-translate-y-1 cursor-pointer border-border/50 bg-card hover:bg-muted/30">
              <CardContent className="flex flex-col items-center justify-center p-6 gap-3">
                <span className="text-4xl md:text-5xl transition-transform duration-200 group-hover:scale-110">
                  {category.icon}
                </span>
                <p className="text-sm font-medium text-center text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

