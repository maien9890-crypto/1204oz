/**
 * @file PromoBanner.tsx
 * @description 프로모션 배너 컴포넌트
 *
 * 홈페이지 상단에 표시되는 프로모션 배너
 * 주요 이벤트나 할인 정보를 강조
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PromoBanner() {
  return (
    <section className="w-full relative overflow-hidden bg-gradient-to-br from-muted/50 via-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 텍스트 영역 */}
          <div className="space-y-6 text-left">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                24SS Collection Launch
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                Timeless Style for Everyday
              </p>
            </div>
            <div className="pt-4">
              <Link href="/products">
                <Button size="lg" className="text-base px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground">
                  자세히보기
                </Button>
              </Link>
            </div>
          </div>

          {/* 이미지 영역 */}
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-muted to-muted/50">
            <img
              src="https://via.placeholder.com/800x600?text=Collection"
              alt="24SS Collection"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

