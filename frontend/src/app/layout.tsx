import { Footer } from "@/components/custom/footer";
import Header from "@/components/custom/header";
import { loaders } from "@/data/loaders";
import { validateApiResponse } from "@/lib/error-handler";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export async function generateMetadata(): Promise<Metadata> {
  const metadata = await loaders.getMetaData();

  return {
    title: metadata?.data?.title ?? "Epic Next Course",
    description: metadata?.data?.description ?? "Epic Next Course",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const globalDataResponse =await loaders.getGlobalData();
  const globalData = validateApiResponse(globalDataResponse, "global page");
  
  //console.dir(globalData, { depth: null });

  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header data={globalData.header} />        
        {children}
        <Footer data={globalData.footer} />

      </body>
    </html>
  );
}
