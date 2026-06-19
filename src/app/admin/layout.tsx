"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { 
  LayoutDashboard, 
  BookOpen, 
  CalendarDays, 
  Users, 
  Receipt, 
  CalendarCheck,
  Menu,
  X,
  ArrowLeft
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Courses", href: "/admin/courses", icon: BookOpen },
    { name: "Workshops", href: "/admin/workshops", icon: CalendarDays },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Purchases", href: "/admin/payments", icon: Receipt },
    { name: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  ];

  const currentPage = links.find(l => l.href === pathname)?.name || "Dashboard";

  return (
    <div className="flex min-h-screen bg-background font-sans text-ink">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-ink/50 z-40 md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-navy-night text-white flex flex-col
        transition-transform duration-300 ease-in-out md:static md:translate-x-0
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-navy-glow/30">
          <div className="bg-white px-2 py-1.5 rounded-md flex items-center justify-center">
            <Logo className="h-6 w-auto" />
          </div>
          <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="text-xs font-semibold tracking-wider text-navy-tint/60 uppercase mb-4 px-2">
            Menu
          </div>
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? "bg-navy-glow text-white shadow-soft"
                    : "text-gray-400 hover:bg-navy-deep hover:text-gray-100"
                }`}
              >
                <Icon size={18} className={isActive ? "text-accent-blue" : "text-gray-500"} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-navy-glow/30 space-y-4">
          <Link 
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-navy-deep transition-colors"
          >
            <ArrowLeft size={16} />
            Back to site
          </Link>
          <div className="flex items-center gap-3 px-3 py-2 bg-navy-deep rounded-xl2 border border-navy-glow/50">
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white leading-tight">Admin</span>
              <span className="text-xs text-gray-400 leading-tight">Account settings</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-paper-card border-b border-line flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-ink-muted hover:text-ink p-1 rounded-md"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold tracking-tight2 text-ink">{currentPage}</h1>
          </div>
          <div className="flex items-center gap-4 md:hidden">
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-x-hidden overflow-y-auto bg-paper-sunken">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
