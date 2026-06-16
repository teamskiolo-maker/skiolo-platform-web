"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { FadeUp } from "@/components/motion/FadeUp";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Courses", href: "/courses", public: true },
    { name: "Workshops", href: "/workshops", public: true },
    { name: "My Courses", href: "/my-courses", public: false },
    { name: "My Bookings", href: "/my-bookings", public: false },
  ];

  const DesktopLinks = () => (
    <>
      {navLinks.map((link) => {
        const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
        const linkClass = `relative h-16 flex items-center text-sm font-medium transition-colors ${
          isActive ? "text-ink" : "text-ink-muted hover:text-ink"
        }`;
        
        const content = (
          <Link key={link.href} href={link.href} className={linkClass}>
            {link.name}
            {isActive && (
              <motion.div
                layoutId="navbar-active"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-brand"
              />
            )}
          </Link>
        );

        if (!link.public) {
          return <SignedIn key={link.href}>{content}</SignedIn>;
        }
        return content;
      })}
    </>
  );

  return (
    <FadeUp delay={0.1} className="sticky top-0 z-50">
      <header className="w-full bg-paper/80 backdrop-blur border-b border-line">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-display font-semibold text-xl text-ink tracking-tight2">
              SKIOLO
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <DesktopLinks />
            </nav>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="secondary" size="sm">Sign in</Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="primary" size="sm">Get started</Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          <button 
            className="md:hidden p-2 text-ink"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-paper border-b border-line overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
                const content = (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    className={`text-base font-medium ${isActive ? "text-emerald-brand" : "text-ink-muted hover:text-ink"}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );

                if (!link.public) {
                  return <SignedIn key={link.href}>{content}</SignedIn>;
                }
                return content;
              })}
              <div className="pt-4 border-t border-line flex flex-col gap-3">
                <SignedOut>
                  <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="secondary" className="w-full">Sign in</Button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full">Get started</Button>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-ink-muted">Account</span>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </SignedIn>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </FadeUp>
  );
}
