"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth, SignedIn, RedirectToSignIn } from "@clerk/nextjs";
import { apiFetch } from "@/lib/api";

export default function MyBookingsPage() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookings() {
      if (!isLoaded || !isSignedIn) return;
      try {
        const token = await getToken();
        if (token) {
          const data = await apiFetch<any[]>("/me/bookings", { method: "GET", token });
          setBookings(data);
        }
      } catch (err) {
        console.error("Failed to load my bookings", err);
      } finally {
        setLoading(false);
      }
    }
    if (isLoaded) {
      loadBookings();
    }
  }, [isLoaded, isSignedIn, getToken]);

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setCancellingId(bookingId);
    try {
      const token = await getToken();
      await apiFetch(`/bookings/${bookingId}/cancel`, { method: "POST", token });
      // Refresh list
      const data = await apiFetch<any[]>("/me/bookings", { method: "GET", token });
      setBookings(data);
    } catch (err: any) {
      alert(err.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

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
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="flex items-center justify-between p-6 max-w-5xl mx-auto border-b border-gray-200 bg-white shadow-sm mb-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold tracking-tight">SKIOLO</Link>
          <Link href="/courses" className="text-sm font-medium hover:underline text-gray-600">Courses</Link>
          <Link href="/workshops" className="text-sm font-medium hover:underline text-gray-600">Workshops</Link>
          <SignedIn>
            <Link href="/my-courses" className="text-sm font-medium hover:underline text-gray-600">My Courses</Link>
            <Link href="/my-bookings" className="text-sm font-medium hover:underline text-gray-900">My Bookings</Link>
          </SignedIn>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading your bookings...</div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const ws = booking.workshop;
              const isCancellable = ["CONFIRMED", "PENDING_PAYMENT", "WAITLISTED"].includes(booking.status);
              
              let statusBadge = null;
              if (booking.status === "CONFIRMED") statusBadge = <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Confirmed</span>;
              else if (booking.status === "PENDING_PAYMENT") statusBadge = <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">Payment pending</span>;
              else if (booking.status === "WAITLISTED") statusBadge = <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">Waitlisted {booking.waitlistPosition ? `(#${booking.waitlistPosition})` : ""}</span>;
              else if (booking.status === "OFFERED") statusBadge = <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">Seat offered — pay to confirm</span>;
              else if (booking.status === "CANCELLED") statusBadge = <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">Cancelled</span>;

              return (
                <div key={booking.id} className="bg-white border rounded-lg shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <Link href={`/workshops/${ws.slug}`} className="hover:underline">
                        <h2 className="text-xl font-semibold">{ws.title}</h2>
                      </Link>
                      {statusBadge}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>When:</strong> {formatIST(ws.startsAt)}</p>
                      <p><strong>Mode:</strong> {ws.mode} {ws.mode === "OFFLINE" && ws.venue ? `(${ws.venue})` : ""}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    {booking.status === "CONFIRMED" && ws.mode === "ONLINE" && ws.zoomJoinUrl && (
                      <a 
                        href={ws.zoomJoinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition text-sm font-medium"
                      >
                        Join link
                      </a>
                    )}
                    
                    {isCancellable && (
                      <button 
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition text-sm font-medium disabled:opacity-50"
                      >
                        {cancellingId === booking.id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            
            {bookings.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-600 mb-4">You have no bookings yet.</p>
                <Link href="/workshops">
                  <button className="bg-gray-100 text-gray-900 px-6 py-2 rounded-md hover:bg-gray-200 transition text-sm font-medium">
                    Browse Workshops
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
