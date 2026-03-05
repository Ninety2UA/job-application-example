"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/", label: "Home" },
  { href: "/analysis", label: "Analysis" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/about", label: "About" },
];

export default function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="mx-auto max-w-5xl px-4 py-3">
        <div className="flex items-center justify-between rounded-2xl border border-card-border bg-card/80 px-5 py-3 backdrop-blur-xl">
          <Link href="/" className="text-sm font-bold tracking-tight">
            DB <span className="text-accent" style={{ textShadow: "0 0 12px rgba(16,185,129,0.3)" }}>x</span> KLAR
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 md:flex">
            {links.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "text-accent font-medium"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1 md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <motion.span
              animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-5 bg-foreground"
            />
            <motion.span
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block h-0.5 w-5 bg-foreground"
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-5 bg-foreground"
            />
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 rounded-2xl border border-card-border bg-card/95 p-4 backdrop-blur-xl md:hidden"
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 text-sm transition-colors ${
                    pathname === link.href ||
                    pathname.startsWith(link.href + "/")
                      ? "text-accent font-medium"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
