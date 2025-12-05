/**
 * @file error.tsx
 * @description 전역 에러 페이지
 *
 * Next.js App Router의 전역 에러 핸들러
 */

"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 로깅 (예: Sentry, LogRocket 등)
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h1 className="text-3xl font-bold">오류가 발생했습니다</h1>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 다시 시도해주세요.
          </p>
          {error.digest && (
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                오류 ID: {error.digest}
              </p>
            </div>
          )}
          {process.env.NODE_ENV === "development" && (
            <details className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <summary className="cursor-pointer text-sm font-semibold mb-2">
                개발 모드: 오류 상세 정보
              </summary>
              <pre className="text-xs overflow-auto">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
          <div className="flex gap-2 flex-wrap">
            <Button onClick={reset}>다시 시도</Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                홈으로 이동
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

