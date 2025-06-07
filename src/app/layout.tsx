import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ソルビス税理士法人 - SOLVIS TAX ACCOUNTING",
  description: "ソルビス税理士法人の従業員管理・業務支援システム",
  keywords: ["税理士", "会計", "従業員管理", "業務支援", "ソルビス"],
  authors: [{ name: "SOLVIS TAX ACCOUNTING" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
