import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, MapPin, Megaphone, HelpCircle } from "lucide-react"

const services = [
  {
    icon: MessageSquare,
    title: "시민제안",
    description: "시정 발전을 위한 여러분의 소중한 의견을 들려주세요.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: MapPin,
    title: "찾아오시는 길",
    description: "시청 및 주요 기관의 위치와 교통편을 안내합니다.",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: Megaphone,
    title: "시민참여",
    description: "다양한 시민 참여 프로그램에 함께하세요.",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    icon: HelpCircle,
    title: "자주 묻는 질문",
    description: "시민들이 자주 묻는 질문과 답변을 확인하세요.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
]

export function CitizenServices(): React.JSX.Element {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">시민과 소통하는 서비스</h2>
          <p className="text-muted-foreground text-lg">시민 여러분의 목소리에 귀 기울이겠습니다</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-1">
              <CardHeader>
                <div
                  className={`${service.bgColor} w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <service.icon className={`w-7 h-7 ${service.color}`} />
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{service.description}</p>
                <Button variant="link" className="p-0 h-auto font-medium">
                  바로가기 →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
