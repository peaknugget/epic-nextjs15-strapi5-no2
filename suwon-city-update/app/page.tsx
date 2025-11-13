import type React from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { QuickServices } from "@/components/quick-services"
import { NewsSection } from "@/components/news-section"
import { CitizenServices } from "@/components/citizen-services"
import { Footer } from "@/components/footer"

export default function Home(): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <QuickServices />
        <NewsSection />
        <CitizenServices />
      </main>
      <Footer />
    </div>
  )
}
