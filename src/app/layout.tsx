import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { UIWrapper } from "@/components/UIWrapper";
import Navigation from "@/components/Navigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cafe Order System",
  description: "Order your favorite cafe items online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <ErrorBoundary>
          <UIWrapper>
            <ErrorBoundary>
              <CartProvider>
                <Navigation />
                <main className="min-h-screen">
                  {children}
                </main>
              </CartProvider>
            </ErrorBoundary>
          </UIWrapper>
        </ErrorBoundary>
      </body>
    </html>
  );
}
