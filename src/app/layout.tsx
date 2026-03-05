import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import FloatingNav from "@/components/layout/FloatingNav";
import Footer from "@/components/layout/Footer";
import ChatProvider from "@/components/layout/ChatProvider";
import ChatWidget from "@/components/layout/ChatWidget";
import "./globals.css";

const satoshi = localFont({
  src: [
    { path: "../../public/fonts/Satoshi-Light.woff2", weight: "300" },
    { path: "../../public/fonts/Satoshi-Regular.woff2", weight: "400" },
    { path: "../../public/fonts/Satoshi-Medium.woff2", weight: "500" },
    { path: "../../public/fonts/Satoshi-Bold.woff2", weight: "700" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dominik Benger x KLAR",
  description:
    "An interactive job application: deep business research, strategic recommendations, and working prototypes for KLAR — the eCom Data Operating System.",
  metadataBase: new URL("https://klar.dbenger.com"),
  openGraph: {
    title: "Dominik Benger x KLAR",
    description: "I didn't write a cover letter. I built this instead.",
    url: "https://klar.dbenger.com",
    siteName: "Dominik Benger x KLAR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dominik Benger x KLAR",
    description: "I didn't write a cover letter. I built this instead.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={satoshi.variable}>
      <body className="antialiased">
        <ChatProvider>
          <FloatingNav />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer />
          <ChatWidget />
        </ChatProvider>
        <Analytics />
      </body>
    </html>
  );
}
