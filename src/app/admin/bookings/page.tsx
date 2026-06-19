"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/motion/FadeUp";
import { Stagger } from "@/components/motion/Stagger";
import { ChevronLeft, ChevronRight, CalendarCheck } from "lucide-react";

interface Booking {
  id: string;
  user?: { email: string };
  workshop?: { title: string };
  status: "PENDING_PAYMENT" | "CONFIRMED" | "WAITLISTED" | "OFFERED" | "CANCELLED";
  waitlistPosition?: number | null;
  createdAt: string;
}

interface BookingsResponse {
  bookings: Booking[];
  total: number;
  page: number;
  pageSize: number;
}

export default function BookingsPage() {
  const { getToken } = useAuth();
  const [data, setData] = useState<BookingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      
      const query = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (statusFilter !== "All") {
        query.append("status", statusFilter);
      }

      const res = await apiFetch<BookingsResponse>(`/admin/bookings?${query.toString()}`, { 
        method: "GET", 
        token 
      });
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, getToken]);

  const formatDate = (isoString: string) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(new Date(isoString));
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "CONFIRMED":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-accent-green border border-green-200">CONFIRMED</span>;
      case "PENDING_PAYMENT":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-accent-amber border border-orange-200">PENDING_PAYMENT</span>;
      case "WAITLISTED":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-accent-blue border border-blue-200">WAITLISTED</span>;
      case "OFFERED":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-navy-tint text-navy-deep border border-navy-glow/20">OFFERED</span>;
      case "CANCELLED":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">CANCELLED</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">{status}</span>;
    }
  };

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <Stagger staggerDelay={0.05} className="space-y-6">
      <FadeUp delay={0}>
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink tracking-tight2">Bookings</h1>
          <p className="text-ink-muted mt-1 text-sm">Manage all workshop bookings and waitlists.</p>
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-ink-muted">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-line bg-paper-card px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
              >
                <option value="All">All Statuses</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PENDING_PAYMENT">Pending Payment</option>
                <option value="WAITLISTED">Waitlisted</option>
                <option value="OFFERED">Offered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {loading && !data ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl2 text-sm">
              {error}
            </div>
          ) : data?.bookings.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center justify-center border-2 border-dashed border-line rounded-xl2">
              <CalendarCheck size={48} className="text-gray-300 mb-3" />
              <p className="text-ink-muted text-sm font-medium">No bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-xs font-semibold text-ink-muted uppercase tracking-wider border-b border-line">
                  <tr>
                    <th className="px-4 py-3 pb-4">User</th>
                    <th className="px-4 py-3 pb-4">Workshop</th>
                    <th className="px-4 py-3 pb-4">Status</th>
                    <th className="px-4 py-3 pb-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {data?.bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-paper-sunken transition-colors group">
                      <td className="px-4 py-4">
                        <span className="font-medium text-ink">{booking.user?.email || "Unknown"}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-medium text-ink">{booking.workshop?.title || "Unknown Workshop"}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col items-start gap-1">
                          {getStatusBadge(booking.status)}
                          {booking.status === "WAITLISTED" && booking.waitlistPosition !== null && booking.waitlistPosition !== undefined && (
                            <span className="text-[10px] text-ink-muted font-mono">Pos: {booking.waitlistPosition}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-ink-muted">
                        {formatDate(booking.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && data && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-line mt-4 pt-4">
              <span className="text-sm text-ink-muted">
                Showing page <span className="font-medium text-ink">{page}</span> of <span className="font-medium text-ink">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-2"
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-2"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </FadeUp>
    </Stagger>
  );
}
