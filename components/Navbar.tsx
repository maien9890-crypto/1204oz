"use client";

import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { CartIcon } from "@/components/CartIcon";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-between items-center px-6 py-4 h-16 max-w-7xl mx-auto">
        {/* 로고 */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity flex items-center gap-2"
        >
          <span className="text-primary">SaaS</span>
          <span>Template</span>
        </Link>

        {/* 중앙 네비게이션 */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/products"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            New
          </Link>
          <Link
            href="/products?sort=popular"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Best
          </Link>
          <Link
            href="/products?category=electronics"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            전자제품
          </Link>
          <Link
            href="/products?category=clothing"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            의류
          </Link>
        </nav>

        {/* 우측 액션 */}
        <div className="flex gap-3 items-center">
          {/* 검색바 */}
          <div className="hidden md:flex items-center relative">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="검색"
              className="pl-10 w-48 h-9 bg-muted border-border/50"
            />
          </div>

          <SignedIn>
            <CartIcon />
            <Link href="/mypage">
              <Button variant="ghost" size="sm">
                마이페이지
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="sm">로그인</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
