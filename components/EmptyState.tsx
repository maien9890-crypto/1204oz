/**
 * @file EmptyState.tsx
 * @description 빈 상태 컴포넌트
 *
 * 데이터가 없을 때 표시하는 재사용 가능한 컴포넌트
 */

import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn("max-w-md mx-auto", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        {Icon && (
          <Icon className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
        )}
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        {description && (
          <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
        )}
        {action && (
          <Button asChild>
            <Link href={action.href}>{action.label}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

