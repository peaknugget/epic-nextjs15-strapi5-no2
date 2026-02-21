import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: {
    default: "시청 홈페이지",
    template: "%s | 시청 홈페이지",
  },
  description: "시민과 함께하는 더 나은 도시를 만듭니다. 민원서비스, 시정소식, 행정정보를 제공합니다.",
  keywords: ["시청", "민원", "행정서비스", "시정소식", "공공기관"],
  authors: [{ name: "시청" }],
  creator: "시청",
  publisher: "시청",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: "시청 홈페이지",
    description: "시민과 함께하는 더 나은 도시를 만듭니다.",
    siteName: "시청",
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
