import type { Metadata } from "next";
import type { Viewport } from 'next'
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Ealert from "./components/ealert";
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/grid';
import 'atropos/css';
import 'swiper/css/navigation';
import Didyouknow from "./components/didyouknow";
import NextTopLoader from 'nextjs-toploader';
import Footer from "./components/footer";
//import Totop from "./components/totop";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { Toaster } from "@/components/ui/sonner"
import 'react-photo-view/dist/react-photo-view.css';
import Alertbox from "./components/alertbox";
import { keywords } from "./seo.json"
import "@egjs/react-view360/css/view360.min.css";
import { ThemeProvider } from "./theme-provider";

import Underdev from "./components/underdev";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ThaiGuide – Explore, Earn, and Enjoy",
  description: "Experience Thailand like never before through fun travel quests, point systems, and rewards. Powered by AI and emotional design, our platform turns every trip into an adventure full of memories.",
  keywords: keywords,
  openGraph: {
    url: 'https://www.thaiguide.in.th/',
    description: `Experience Thailand like never before through fun travel quests, point systems, and rewards. Powered by AI and emotional design, our platform turns every trip into an adventure full of memories.`,
    type: 'website',
    images: 'https://www.thaiguide.in.th/oImage.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#f7740a',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <>
      <html lang={locale} suppressHydrationWarning>
        <body
          className={`${notoSans.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
          >
            <NextIntlClientProvider>
              <NextTopLoader
                color="#f7740a"
                height={4}
                showSpinner={false}
              />
              <Toaster position="top-center" />
              <Navbar />
              <Ealert />
              {children}
              <Didyouknow />
              <Footer />
              <Alertbox />
              {/* <Underdev /> */}
              {/*<Totop />*/}
            </NextIntlClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
