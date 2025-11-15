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
  title: "ASRC Race Hub",
  description: "Single-page hub built with Next.js and Ant Design",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${kanit.variable} antialiased`} suppressHydrationWarning={true}>
        <AuthProvider>
          <MainHeader />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
