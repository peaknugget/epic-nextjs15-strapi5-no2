import type React from "react"
import { FileText, Building2, Bus, Phone, Users, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"

const services = [
  { icon: FileText, title: "민원서류발급", color: "bg-blue-500" },
  { icon: Building2, title: "시설예약", color: "bg-green-500" },
  { icon: Bus, title: "교통정보", color: "bg-orange-500" },
  { icon: Phone, title: "전화번호안내", color: "bg-purple-500" },
  { icon: Users, title: "시민참여", color: "bg-pink-500" },
  { icon: Calendar, title: "행사일정", color: "bg-teal-500" },
]

export function QuickServices(): React.JSX.Element {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">주요 서비스</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-1"
              role="button"
              tabIndex={0}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div
                  className={`${service.color} p-4 rounded-full text-white group-hover:scale-110 transition-transform`}
                  aria-hidden="true"
                >
                  <service.icon className="w-6 h-6" />
                </div>
                <span className="font-medium text-sm leading-tight">{service.title}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
