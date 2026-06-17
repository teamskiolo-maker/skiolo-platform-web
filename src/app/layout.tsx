import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

import { PublicLayoutWrapper } from "@/components/layout/PublicLayoutWrapper";

export const metadata: Metadata = {
  title: "SKIOLO Platform",
  description: "Premium education platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased`}
        >
          <PublicLayoutWrapper>
            {children}
          </PublicLayoutWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
