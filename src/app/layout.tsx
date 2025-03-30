import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReduxProvider } from "@/redux/provider";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeInitializer } from "@/components/ThemeInitializer";
import { AnimatePresence } from "framer-motion";
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
  title: "Spritzy - Speed Reading",
  description: "An app to improve your reading speed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <ThemeInitializer />
            <AnimatePresence mode="wait">
              {children}
            </AnimatePresence>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
