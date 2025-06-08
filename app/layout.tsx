import type { Metadata } from "next";
import type { Viewport } from 'next'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Ealert from "./components/ealert";
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/grid';
import 'atropos/css';
import 'swiper/css/navigation';
import Didyouknow from "./components/didyouknow";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ThaiGuide – Explore, Earn, and Enjoy",
  description: "Experience Thailand like never before through fun travel quests, point systems, and rewards. Powered by AI and emotional design, our platform turns every trip into an adventure full of memories.",
  openGraph: {
    url: 'https://thaiguide.siraphop.me/',
    description: `Experience Thailand like never before through fun travel quests, point systems, and rewards. Powered by AI and emotional design, our platform turns every trip into an adventure full of memories.`,
    type: 'website',
    images: 'https://thaiguide.siraphop.me/oImage.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#f7740a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <Ealert />
        {children}
        <Didyouknow />
      </body>
    </html>
  );
}
