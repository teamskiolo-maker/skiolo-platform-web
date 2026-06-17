"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth, RedirectToSignIn } from "@clerk/nextjs";
import { apiFetch } from "@/lib/api";
import { WorkshopBanner } from "@/components/WorkshopCard";
import { FadeUp } from "@/components/motion/FadeUp";
import { Stagger } from "@/components/motion/Stagger";
import { Button } from "@/components/ui/Button";
import { CalendarDays, MapPin, Video, Ticket } from "lucide-react";

export default function MyBookingsPage() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookings() {
      if (!isLoaded || !isSignedIn) return;
      try {
        setLoading(true);
        setError(null);
        const token = await getToken();
        if (token) {
          const data = await apiFetch<any[]>("/me/bookings", { method: "GET", token });
          setBookings(data);
        }
      } catch (err: any) {
        console.error("Failed to load my bookings", err);
        setError(err.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    }
    if (isLoaded) {
      loadBookings();
    }
  }, [isLoaded, isSignedIn, getToken]);
  const formatIST = (dateString: string) => {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(new Date(dateString));
  };

  if (!isLoaded) {
    return <div className="p-8 text-center min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return (
    <div className="min-h-screen bg-paper text-ink font-sans pb-32">
      <div className="max-w-6xl mx-auto px-6 pt-12 md:pt-20">
        <FadeUp>
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight2 mb-4">
              My <span className="font-serif-accent text-navy italic">Bookings</span>
            </h1>
            <p className="text-ink-muted text-lg max-w-2xl">
              Your upcoming and past workshop reservations.
            </p>
          </div>
        </FadeUp>

        {loading ? (
          <div className="text-center py-20 text-ink-muted flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-navy/20 border-t-navy rounded-full animate-spin mb-4" />
            <p className="font-medium">Loading your bookings...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-600 font-medium flex flex-col items-center justify-center">
            <p>{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-24 px-6 text-center bg-white rounded-2xl2 border border-line shadow-sm">
            <div className="w-16 h-16 bg-navy/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-navy">
              <Ticket className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-display font-semibold text-ink mb-2">No bookings yet</h3>
            <p className="text-ink-muted mb-8 max-w-md mx-auto">
              You have no workshop bookings yet. Start your journey by exploring our available workshops.
            </p>
            <Link href="/workshops">
              <Button variant="primary" size="lg" className="shadow-soft">
                Browse Workshops
              </Button>
            </Link>
          </div>
        ) : (
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {bookings.map((booking) => {
              const ws = booking.workshop;
              
              let statusBadge = null;
              if (booking.status === "CONFIRMED") {
                statusBadge = <span className="bg-accent-green/10 text-emerald-800 border border-accent-green/20 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest inline-block">Confirmed</span>;
              } else if (booking.status === "PENDING_PAYMENT") {
                statusBadge = <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest inline-block">Payment Pending</span>;
              } else if (booking.status === "WAITLISTED") {
                statusBadge = <span className="bg-[#2E73C9]/10 text-[#235BA0] border border-[#2E73C9]/20 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest inline-block">Waitlisted {booking.waitlistPosition ? `(#${booking.waitlistPosition})` : ""}</span>;
              } else if (booking.status === "OFFERED") {
                statusBadge = <span className="bg-purple-100 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest inline-block">Seat Offered</span>;
              } else if (booking.status === "CANCELLED") {
                statusBadge = <span className="bg-gray-100 text-gray-600 border border-gray-200 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest inline-block">Cancelled</span>;
              }

              return (
                <FadeUp key={booking.id} className="h-full">
                  <div className="relative h-full flex flex-col bg-paper-card border border-line rounded-2xl2 overflow-hidden shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1">
                    <div className="h-24 sm:h-32">
                      <WorkshopBanner mode={ws.mode} className="w-full h-full" />
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex flex-col items-start gap-3 mb-4">
                        <div className="flex flex-wrap gap-2">
                          {statusBadge}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold tracking-[0.2em] uppercase border ${
                            ws.mode === 'ONLINE' 
                              ? 'text-[#2E73C9] bg-[#2E73C9]/5 border-[#2E73C9]/20' 
                              : 'text-[#F2B53C] bg-[#F2B53C]/5 border-[#F2B53C]/20'
                          }`}>
                            {ws.mode === 'ONLINE' ? <Video className="w-3 h-3 mr-1.5" /> : <MapPin className="w-3 h-3 mr-1.5" />}
                            {ws.mode}
                          </span>
                        </div>
                      </div>

                      <h2 className="text-xl font-display font-semibold text-ink tracking-tight2 line-clamp-2 mb-4 group-hover:text-navy transition-colors">
                        {ws.title}
                      </h2>

                      <div className="flex flex-col gap-2 mb-6 flex-1 text-sm text-ink-muted">
                        <div className="flex items-start gap-2">
                          <CalendarDays className="w-4 h-4 mt-0.5 text-navy/60 shrink-0" />
                          <span>{formatIST(ws.startsAt)}</span>
                        </div>
                        {ws.mode === "OFFLINE" && ws.venue && (
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-0.5 text-navy/60 shrink-0" />
                            <span className="line-clamp-2">{ws.venue}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-line/50 flex flex-col gap-3">
                        <Link href={`/workshops/${ws.slug}`} className="w-full">
                          <Button variant={booking.status === "PENDING_PAYMENT" || booking.status === "OFFERED" ? "primary" : "secondary"} className="w-full justify-center">
                            View Details
                          </Button>
                        </Link>
                        
                        {booking.status === "CONFIRMED" && ws.mode === "ONLINE" && ws.zoomJoinUrl && (
                          <a 
                            href={ws.zoomJoinUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full"
                          >
                            <Button variant="primary" className="w-full justify-center bg-[#2E73C9] hover:bg-[#235BA0]">
                              Join Link
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </FadeUp>
              );
            })}
          </Stagger>
        )}
      </div>
    </div>
  );
}
