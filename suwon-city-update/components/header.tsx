"use client"

import type React from "react"

import { useState } from "react"
import { Menu, X, Search, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header(): React.JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      {/* Top bar */}
      <div className="bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center gap-4">
              <a href="#" className="hover:underline">
                날씨
              </a>
              <a href="#" className="hover:underline">
                교통정보
              </a>
              <a href="#" className="hover:underline">
                민원안내
              </a>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 hover:underline" aria-label="언어 선택">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Language</span>
              </button>
              <a href="#" className="hover:underline">
                로그인
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold">시청 로고</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="주요 메뉴">
            <a href="#" className="hover:text-accent-foreground transition-colors font-medium">
              시정안내
            </a>
            <a href="#" className="hover:text-accent-foreground transition-colors font-medium">
              시정소식
            </a>
            <a href="#" className="hover:text-accent-foreground transition-colors font-medium">
              행정정보/기관
            </a>
            <a href="#" className="hover:text-accent-foreground transition-colors font-medium">
              수원소식
            </a>
            <a href="#" className="hover:text-accent-foreground transition-colors font-medium">
              수원소개
            </a>
            <a href="#" className="hover:text-accent-foreground transition-colors font-medium">
              분야별정보
            </a>
          </nav>

          {/* Search and Mobile Menu */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary/90"
              aria-label="검색"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-primary-foreground hover:bg-primary/90"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-primary border-t border-primary-foreground/20">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3" aria-label="모바일 메뉴">
            <a href="#" className="py-2 hover:text-accent-foreground transition-colors font-medium">
              시정안내
            </a>
            <a href="#" className="py-2 hover:text-accent-foreground transition-colors font-medium">
              시정소식
            </a>
            <a href="#" className="py-2 hover:text-accent-foreground transition-colors font-medium">
              행정정보/기관
            </a>
            <a href="#" className="py-2 hover:text-accent-foreground transition-colors font-medium">
              수원소식
            </a>
            <a href="#" className="py-2 hover:text-accent-foreground transition-colors font-medium">
              수원소개
            </a>
            <a href="#" className="py-2 hover:text-accent-foreground transition-colors font-medium">
              분야별정보
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
