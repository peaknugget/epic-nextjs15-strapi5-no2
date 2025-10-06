import type React from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, Calendar } from "lucide-react"

const newsItems = [
  {
    category: "공지사항",
    title: "2025년 상반기 주요 정책 발표",
    date: "2025.01.15",
    badge: "NEW",
  },
  {
    category: "보도자료",
    title: "스마트 도시 구축 사업 착수",
    date: "2025.01.14",
    badge: "HOT",
  },
  {
    category: "행사안내",
    title: "시민 참여 문화축제 개최",
    date: "2025.01.13",
  },
  {
    category: "채용정보",
    title: "2025년 상반기 공무원 채용",
    date: "2025.01.12",
  },
]

export function NewsSection(): React.JSX.Element {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* News List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl md:text-2xl">시정소식</CardTitle>
              <Button variant="ghost" size="sm">
                더보기 <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {newsItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        {item.badge && <Badge className="text-xs bg-destructive">{item.badge}</Badge>}
                      </div>
                      <h3 className="font-medium group-hover:text-primary transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Featured Content */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">주요 정책</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted relative">
                <Image
                  src="/city-development-urban-planning.jpg"
                  alt="2025 스마트 도시 발전 계획"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold leading-tight">2025 스마트 도시 발전 계획</h3>
                <p className="text-muted-foreground leading-relaxed">
                  시민 중심의 디지털 혁신과 지속 가능한 도시 개발을 위한 종합 계획을 수립하였습니다.
                </p>
                <Button variant="link" className="p-0 h-auto font-medium">
                  자세히 보기 <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
