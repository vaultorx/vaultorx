import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Loading from "./loading";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Vaultorx - NFT Marketplace",
  description:
    "Discover, collect, and sell extraordinary NFTs with secure escrow protocol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${inter.className} antialiased`}>
        <SessionProvider>
           <Suspense fallback={<Loading/>}>
          {children}
           </Suspense>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
