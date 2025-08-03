import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { LoadingScreen } from "@/components/LoadingScreen"; // Fixed import
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Mini LinkedIn - Professional Networking Platform",
    template: "%s | Mini LinkedIn",
  },
  description:
    "Connect with industry leaders, share your expertise, and discover opportunities that shape your career journey.",
  keywords: [
    "professional networking",
    "career development",
    "industry connections",
    "job opportunities",
  ],
  authors: [{ name: "Mini LinkedIn Team" }],
  creator: "Mini LinkedIn",
  metadataBase: new URL("https://mini-linkedin-platform.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mini-linkedin-platform.vercel.app",
    title: "Mini LinkedIn - Professional Networking Platform",
    description:
      "Connect with industry leaders, share your expertise, and discover opportunities that shape your career journey.",
    siteName: "Mini LinkedIn",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mini LinkedIn - Professional Networking Platform",
    description:
      "Connect with industry leaders, share your expertise, and discover opportunities.",
    creator: "@minilinkedin",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Suspense fallback={<LoadingScreen />}>
          <SmoothScrollProvider>
            <AuthProvider>
              <Header />
              <main className="min-h-screen">{children}</main>
            </AuthProvider>
          </SmoothScrollProvider>
        </Suspense>
      </body>
    </html>
  );
}
