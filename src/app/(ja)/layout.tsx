import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function JaLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <Header locale="ja" />
        <main>{children}</main>
        <Footer locale="ja" />
      </body>
    </html>
  );
}
