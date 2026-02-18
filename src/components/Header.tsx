"use client";

import Link from "next/link";
import { useState } from "react";
import { content, Locale } from "@/lib/content";

export default function Header({ locale }: { locale: Locale }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = content[locale].nav;
  const prefix = locale === "en" ? "/en" : "";

  return (
    <header className="border-b border-gray-border bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href={prefix || "/"} className="text-lg font-bold text-navy">
          株式会社KAI
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href={prefix || "/"} className="hover:text-blue-accent">
            {t.home}
          </Link>
          <Link href={`${prefix}/services`} className="hover:text-blue-accent">
            {t.services}
          </Link>
          <Link href={`${prefix}/process`} className="hover:text-blue-accent">
            {t.process}
          </Link>
          <Link href={`${prefix}/company`} className="hover:text-blue-accent">
            {t.company}
          </Link>
          <Link href={`${prefix}/contact`} className="hover:text-blue-accent">
            {t.contact}
          </Link>
          <span className="ml-2 border-l border-gray-border pl-4 text-xs text-gray-sub">
            <Link
              href="/"
              className={`${locale === "ja" ? "font-bold text-navy" : ""} hover:text-blue-accent`}
            >
              JP
            </Link>
            {" | "}
            <Link
              href="/en"
              className={`${locale === "en" ? "font-bold text-navy" : ""} hover:text-blue-accent`}
            >
              EN
            </Link>
          </span>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニュー"
        >
          <svg
            className="h-6 w-6 text-navy"
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
        <nav className="border-t border-gray-border bg-white px-6 pb-4 md:hidden">
          <div className="flex flex-col gap-3 pt-3 text-sm">
            <Link
              href={prefix || "/"}
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-accent"
            >
              {t.home}
            </Link>
            <Link
              href={`${prefix}/services`}
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-accent"
            >
              {t.services}
            </Link>
            <Link
              href={`${prefix}/process`}
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-accent"
            >
              {t.process}
            </Link>
            <Link
              href={`${prefix}/company`}
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-accent"
            >
              {t.company}
            </Link>
            <Link
              href={`${prefix}/contact`}
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-accent"
            >
              {t.contact}
            </Link>
            <div className="border-t border-gray-border pt-3 text-xs text-gray-sub">
              <Link
                href="/"
                className={`${locale === "ja" ? "font-bold text-navy" : ""}`}
              >
                JP
              </Link>
              {" | "}
              <Link
                href="/en"
                className={`${locale === "en" ? "font-bold text-navy" : ""}`}
              >
                EN
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
