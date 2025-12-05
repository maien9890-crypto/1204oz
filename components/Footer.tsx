/**
 * @file Footer.tsx
 * @description 푸터 컴포넌트
 *
 * 브랜드 정보, 링크, 뉴스레터 구독 기능 제공
 */

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* 브랜드 정보 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">
                <span className="text-primary">SaaS</span> Template
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Timeless Style for Everyday. Discover curated collections for your perfect look.
            </p>
          </div>

          {/* Shop 링크 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products?sort=popular" className="text-muted-foreground hover:text-foreground transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Support 링크 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* 뉴스레터 구독 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Stay Connected</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest updates.
            </p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-1 h-9"
              />
              <Button type="submit" size="sm" className="h-9">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* 저작권 */}
        <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>©2024 SaaS Template. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

