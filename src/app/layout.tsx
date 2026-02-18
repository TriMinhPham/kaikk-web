import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "株式会社KAI | AI・ITシステム開発",
  description:
    "株式会社KAIは、東京都を拠点とするAI・ITシステム開発会社です。中小企業様向けに、業務自動化およびAIシステムの設計・構築を行っています。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
