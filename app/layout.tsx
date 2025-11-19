import React from 'react';
import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import "antd/dist/reset.css";
import '@ant-design/v5-patch-for-react-19';

import MainHeader from './components/client/MainHeader';
import AuthProvider from './components/server/AuthProvider';

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Advanced Simulation Modding Group",
  description: "A web endpoint to access content made by the Advanced Simulation Modding Group and online championship hosted by Advanced Simulation Racing Club",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${kanit.variable} antialiased`} suppressHydrationWarning={true}>
        <AuthProvider>
          <MainHeader />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
