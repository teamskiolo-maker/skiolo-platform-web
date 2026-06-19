import type { Metadata } from "next";
import { Space_Grotesk, Inter, Instrument_Serif } from "next/font/google";
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

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif-accent",
  weight: "400",
  style: "italic",
});

import { PublicLayoutWrapper } from "@/components/layout/PublicLayoutWrapper";
import { Toaster } from "sonner";

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
    <ClerkProvider signInForceRedirectUrl="/" signUpForceRedirectUrl="/">
      <html lang="en">
        <body
          className={`${spaceGrotesk.variable} ${inter.variable} ${instrumentSerif.variable} font-sans antialiased`}
        >
          <PublicLayoutWrapper>
            {children}
          </PublicLayoutWrapper>
          <Toaster 
            position="top-center" 
            toastOptions={{
              style: {
                background: '#FAFAF8',
                color: '#0A0A0B',
                border: '1px solid #E8E6DF',
                fontFamily: 'var(--font-inter)'
              },
              classNames: {
                toast: 'rounded-xl shadow-soft',
                error: 'bg-red-50 text-red-900 border-red-200',
                success: 'bg-emerald-50 text-emerald-900 border-emerald-200'
              }
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
