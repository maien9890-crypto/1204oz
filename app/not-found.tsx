/**
 * @file not-found.tsx
 * @description 전역 404 페이지
 *
 * 존재하지 않는 경로에 접근했을 때 표시되는 페이지
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold">페이지를 찾을 수 없습니다</h2>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Button asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                홈으로 이동
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/products">
                <Search className="h-4 w-4 mr-2" />
                상품 둘러보기
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

