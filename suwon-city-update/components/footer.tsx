import type React from "react"
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"

export function Footer(): React.JSX.Element {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">시청 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>서울특별시 중구 세종대로 110</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>대표전화: 02-1234-5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>webmaster@city.go.kr</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">주요 메뉴</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  시정안내
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  민원서비스
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  정보공개
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  시민참여
                </a>
              </li>
            </ul>
          </div>

          {/* Related Sites */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">관련 사이트</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  정부24
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  국민신문고
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  행정안전부
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  열린재정
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">소셜 미디어</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <a href="#" className="hover:underline">
                개인정보처리방침
              </a>
              <a href="#" className="hover:underline">
                저작권정책
              </a>
              <a href="#" className="hover:underline">
                이메일무단수집거부
              </a>
              <a href="#" className="hover:underline">
                찾아오시는 길
              </a>
            </div>
            <p className="text-background/70">© 2025 City Hall. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
