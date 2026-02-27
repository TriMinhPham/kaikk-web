"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { content, Locale } from "@/lib/content";

export default function Header({ locale }: { locale: Locale }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = content[locale].nav;
  const prefix = locale === "en" ? "/en" : "";

  return (
    <header className="sticky top-0 z-50 border-b border-edge bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href={prefix || "/"}>
          <Image
            src="/kai_logo_header.svg"
            alt="KAI"
            width={120}
            height={54}
            className="h-10 w-auto dark:invert"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-sm text-ink-muted md:flex">
          <Link href={`${prefix}/services`} className="hover:text-ink">
            {t.services}
          </Link>
          <Link href={`${prefix}/process`} className="hover:text-ink">
            {t.process}
          </Link>
          <Link href={`${prefix}/company`} className="hover:text-ink">
            {t.company}
          </Link>
        </nav>

        {/* Right side */}
        <div className="hidden items-center gap-4 md:flex">
          <span className="text-xs text-ink-muted">
            <Link
              href="/"
              className={`${locale === "ja" ? "font-semibold text-ink" : ""} hover:text-ink`}
            >
              JP
            </Link>
            {" / "}
            <Link
              href="/en"
              className={`${locale === "en" ? "font-semibold text-ink" : ""} hover:text-ink`}
            >
              EN
            </Link>
          </span>
          <Link
            href={`${prefix}/contact`}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-hover"
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
            className="h-6 w-6 text-ink"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="border-t border-edge bg-surface px-6 pb-6 md:hidden">
          <div className="flex flex-col gap-4 pt-4 text-sm">
            <Link href={prefix || "/"} onClick={() => setMenuOpen(false)} className="text-ink-muted hover:text-ink">
              {t.home}
            </Link>
            <Link href={`${prefix}/services`} onClick={() => setMenuOpen(false)} className="text-ink-muted hover:text-ink">
              {t.services}
            </Link>
            <Link href={`${prefix}/process`} onClick={() => setMenuOpen(false)} className="text-ink-muted hover:text-ink">
              {t.process}
            </Link>
            <Link href={`${prefix}/company`} onClick={() => setMenuOpen(false)} className="text-ink-muted hover:text-ink">
              {t.company}
            </Link>
            <Link
              href={`${prefix}/contact`}
              onClick={() => setMenuOpen(false)}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-white"
            >
              {t.contact}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <div className="border-t border-edge pt-4 text-xs text-ink-muted">
              <Link href="/" className={`${locale === "ja" ? "font-semibold text-ink" : ""}`}>JP</Link>
              {" / "}
              <Link href="/en" className={`${locale === "en" ? "font-semibold text-ink" : ""}`}>EN</Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
