import type React from "react"
import Image from "next/image"
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection(): React.JSX.Element {
  return (
    <section className="relative bg-gradient-to-br from-primary to-secondary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Main Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-full text-sm font-medium">
              <AlertCircle className="w-4 h-4" />
              <span>중요 공지사항</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-balance">
              시민과 함께하는
              <br />더 나은 도시를 만듭니다
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
              시민 여러분의 의견을 듣고 함께 발전하는 스마트 도시를 구현합니다.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" className="font-medium">
                민원신청
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-medium"
              >
                시정소식 보기
              </Button>
            </div>
          </div>

          {/* Image with Next.js Image optimization */}
          <div className="relative aspect-video lg:aspect-square rounded-lg overflow-hidden bg-primary-foreground/10 backdrop-blur-sm">
            <Image
              src="/city-hall-building-modern-architecture.jpg"
              alt="시청 건물 전경"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button size="icon" variant="secondary" className="rounded-full" aria-label="이전 이미지">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="secondary" className="rounded-full" aria-label="다음 이미지">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
