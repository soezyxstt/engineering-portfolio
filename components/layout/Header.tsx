"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Work", href: "/work" },
  { label: "Robotics", href: "/robotics" },
  { label: "Software", href: "/software" },
  { label: "Leadership", href: "/leadership" },
  { label: "About", href: "/about" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="Adi Haditya Nursyam, home" onClick={() => setOpen(false)}>
          <span className="brand-mark">
            <Image src="/logo-transparent.png" alt="" fill sizes="40px" className="object-contain" />
          </span>
          <span className="brand-copy">
            <strong>Adi Haditya Nursyam</strong>
            <small>Robotics & Software Engineer</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/resume" className="nav-resume">
            Résumé
          </Link>
        </nav>

        <button
          type="button"
          className="menu-button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav id="mobile-navigation" className={`mobile-nav ${open ? "is-open" : ""}`} aria-label="Mobile navigation">
        {navItems.map((item, index) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item.label}
          </Link>
        ))}
        <Link href="/archive" onClick={() => setOpen(false)}>
          <span>06</span>Archive
        </Link>
        <Link href="/resume" onClick={() => setOpen(false)}>
          <span>07</span>Résumé
        </Link>
      </nav>
    </header>
  );
}
