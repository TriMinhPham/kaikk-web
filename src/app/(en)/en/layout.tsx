import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KAI Inc. | AI & IT Systems Development",
  description:
    "KAI Inc. is a Tokyo-based IT company providing AI implementation and business automation services for small and medium-sized enterprises.",
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header locale="en" />
        <main>{children}</main>
        <Footer locale="en" />
      </body>
    </html>
  );
}
