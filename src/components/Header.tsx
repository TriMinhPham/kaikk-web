"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { content, type Locale } from "@/lib/content";
import LogoMark from "@/components/LogoMark";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default function Header({ locale }: { locale: Locale }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = content[locale].nav;
  const prefix = locale === "en" ? "/en" : "";
  const links = [
    { href: `${prefix}/services`, label: t.services },
    { href: `${prefix}/process`, label: t.process },
    { href: `${prefix}/company`, label: t.company },
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-edge bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-6 md:px-8 xl:px-14">
        <Link href={prefix || "/"} className="flex items-center gap-4" aria-label={locale === "ja" ? "KAI ホーム" : "KAI home"}>
          <LogoMark className="h-6 w-[82px]" />
          <Image src="/wordmark_kai.svg" alt="KAI" width={48} height={32} className="h-7 w-auto" priority />
        </Link>
        <nav aria-label={locale === "ja" ? "メインナビゲーション" : "Main navigation"} className="hidden items-center gap-7 text-xs text-ink-muted md:flex">
          {links.map(link => <Link key={link.href} href={link.href} className="py-3 hover:text-primary">{link.label}</Link>)}
        </nav>
        <div className="hidden items-center gap-6 md:flex">
          <span className="text-[11px] text-ink-muted"><LocaleSwitcher locale={locale} linkClass="hover:text-primary" activeClass="font-semibold text-ink" /></span>
          <Link href={`${prefix}/contact`} className="button-primary !min-h-10 !gap-5 !px-4 !py-2 !text-xs">{t.contact}<span aria-hidden="true">↗</span></Link>
        </div>
        <button type="button" className="flex min-h-11 items-center gap-3 text-xs md:hidden" aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (locale === "ja" ? "閉じる" : "Close") : (locale === "ja" ? "メニュー" : "Menu")}
          <span className="text-xl" aria-hidden="true">{menuOpen ? "×" : "+"}</span>
        </button>
      </div>
      <nav id="mobile-navigation" hidden={!menuOpen} aria-label={locale === "ja" ? "モバイルナビゲーション" : "Mobile navigation"} className="border-t border-edge px-6 pb-6 pt-3 md:!hidden">
        {[...links, { href: `${prefix}/contact`, label: t.contact }].map(link => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="block py-3 text-sm hover:text-primary">{link.label}</Link>)}
        <div className="mt-3 text-xs"><LocaleSwitcher locale={locale} linkClass="inline-block py-3" activeClass="font-semibold text-primary" /></div>
      </nav>
    </header>
  );
}
