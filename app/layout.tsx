import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import "antd/dist/reset.css";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "ASRC Race Hub",
  description: "Single-page hub built with Next.js and Ant Design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${kanit.variable} antialiased`}>{children}</body>
    </html>
  );
}
