"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { content, Locale } from "@/lib/content";
import LogoMark from "@/components/LogoMark";

export default function Header({ locale }: { locale: Locale }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = content[locale].nav;
  const prefix = locale === "en" ? "/en" : "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled
          ? "border-b border-edge/60 bg-surface/90 shadow-sm backdrop-blur-xl"
          : "border-b border-transparent bg-surface/60 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href={prefix || "/"} className="flex items-center gap-3 transition-opacity hover:opacity-70">
          <LogoMark className="h-10 w-auto dark:invert" />
          <Image
            src="/wordmark_kai.svg"
            alt="KAI"
            width={60}
            height={40}
            className="h-10 w-auto dark:invert"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-sm text-ink-muted md:flex">
          {[
            { href: `${prefix}/services`, label: t.services },
            { href: `${prefix}/process`, label: t.process },
            { href: `${prefix}/company`, label: t.company },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative py-1 transition-colors hover:text-ink after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden items-center gap-4 md:flex">
          <span className="text-xs text-ink-muted">
            <Link
              href="/"
              className={`transition-colors ${locale === "ja" ? "font-semibold text-ink" : ""} hover:text-ink`}
            >
              JP
            </Link>
            {" / "}
            <Link
              href="/en"
              className={`transition-colors ${locale === "en" ? "font-semibold text-ink" : ""} hover:text-ink`}
            >
              EN
            </Link>
          </span>
          <Link
            href={`${prefix}/contact`}
            className="btn-press inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover hover:shadow-md"
          >
            {t.contact}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
              <path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg
            className="h-6 w-6 text-ink transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ transform: menuOpen ? "rotate(90deg)" : "rotate(0)" }}
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav - animated */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="border-t border-edge bg-surface/95 px-6 pb-6 backdrop-blur-xl">
          <div className="flex flex-col gap-4 pt-4 text-sm">
            <Link href={prefix || "/"} onClick={() => setMenuOpen(false)} className="text-ink-muted transition-colors hover:text-ink">
              {t.home}
            </Link>
            <Link href={`${prefix}/services`} onClick={() => setMenuOpen(false)} className="text-ink-muted transition-colors hover:text-ink">
              {t.services}
            </Link>
            <Link href={`${prefix}/process`} onClick={() => setMenuOpen(false)} className="text-ink-muted transition-colors hover:text-ink">
              {t.process}
            </Link>
            <Link href={`${prefix}/company`} onClick={() => setMenuOpen(false)} className="text-ink-muted transition-colors hover:text-ink">
              {t.company}
            </Link>
            <Link
              href={`${prefix}/contact`}
              onClick={() => setMenuOpen(false)}
              className="btn-press inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-white"
            >
              {t.contact}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <div className="border-t border-edge pt-4 text-xs text-ink-muted">
              <Link href="/" className={`transition-colors ${locale === "ja" ? "font-semibold text-ink" : ""}`}>JP</Link>
              {" / "}
              <Link href="/en" className={`transition-colors ${locale === "en" ? "font-semibold text-ink" : ""}`}>EN</Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
