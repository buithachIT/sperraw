import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import favicon from "./favicon.png";
import { AppFooter } from "@/components/DefaultFooter";
import { Toaster } from "@/components/ui/sonner";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { MswProvider } from "@/mocks/MswProvider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sperraw",
  description: "Recognition & Rewards workspace onboarding",
  icons: {
    icon: favicon.src,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-dvh">
        <MswProvider>
          <AuthGuard>
            <div className="bg-surface flex min-h-dvh flex-col px-3 py-4 md:px-8 md:py-8">
              <div className="flex min-h-0 flex-1 flex-col">{children}</div>
              <AppFooter />
            </div>
          </AuthGuard>
        </MswProvider>
        <Toaster />
      </body>
    </html>
  );
}
