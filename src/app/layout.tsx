// src/app/layout.tsx
'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/sections/context/AuthContext";
import { useEffect } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { App } from "@capacitor/app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // ক্যাপাসিটর স্ট্যাটাস বার ও ব্যাক বাটন ইনিশিয়ালাইজেশন
    const initNativeFeatures = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#030303' });
      } catch (e) {
        console.log('Not running in Capacitor environment');
      }
    };

    initNativeFeatures();

    const handleBackButton = App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        App.exitApp();
      }
    });

    return () => {
      handleBackButton.then(listener => listener.remove());
    };
  }, []);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}