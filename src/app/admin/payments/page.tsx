"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/motion/FadeUp";
import { Stagger } from "@/components/motion/Stagger";
import { ChevronLeft, ChevronRight, Receipt } from "lucide-react";

interface Payment {
  id: string;
  user?: { email: string };
  course?: { title: string } | null;
  workshop?: { title: string } | null;
  purpose: "COURSE" | "WORKSHOP" | "MEETING";
  amountPaise: number;
  status: "CREATED" | "PAID" | "FAILED";
  razorpayOrderId: string;
  createdAt: string;
}

interface PaymentsResponse {
  payments: Payment[];
  total: number;
  page: number;
  pageSize: number;
}

export default function PaymentsPage() {
  const { getToken } = useAuth();
  const [data, setData] = useState<PaymentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const fetchPayments = async () => {
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

      const res = await apiFetch<PaymentsResponse>(`/admin/payments?${query.toString()}`, { 
        method: "GET", 
        token 
      });
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, getToken]);

  const formatDate = (isoString: string) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(new Date(isoString));
  };

  const formatRupee = (paise: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(paise / 100);
  };

  const getProductTitle = (p: Payment) => {
    if (p.course?.title) return p.course.title;
    if (p.workshop?.title) return p.workshop.title;
    return "Unknown Product";
  };

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <Stagger staggerDelay={0.05} className="space-y-6">
      <FadeUp delay={0}>
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink tracking-tight2">Purchases</h1>
          <p className="text-ink-muted mt-1 text-sm">View all course and workshop payments.</p>
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
                <option value="PAID">Paid</option>
                <option value="CREATED">Created</option>
                <option value="FAILED">Failed</option>
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
          ) : data?.payments.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center justify-center border-2 border-dashed border-line rounded-xl2">
              <Receipt size={48} className="text-gray-300 mb-3" />
              <p className="text-ink-muted text-sm font-medium">No purchases found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-xs font-semibold text-ink-muted uppercase tracking-wider border-b border-line">
                  <tr>
                    <th className="px-4 py-3 pb-4">Buyer</th>
                    <th className="px-4 py-3 pb-4">Product</th>
                    <th className="px-4 py-3 pb-4">Amount</th>
                    <th className="px-4 py-3 pb-4">Status</th>
                    <th className="px-4 py-3 pb-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {data?.payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-paper-sunken transition-colors group">
                      <td className="px-4 py-4">
                        <span className="font-medium text-ink">{payment.user?.email || "Unknown"}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-ink">{getProductTitle(payment)}</span>
                          <span className="text-xs text-ink-muted mt-0.5">
                            {payment.purpose} • <span className="font-mono text-[10px]">{payment.razorpayOrderId.slice(0,14)}...</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-medium text-ink">
                          {formatRupee(payment.amountPaise)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {payment.status === "PAID" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-accent-green border border-green-200">
                            PAID
                          </span>
                        )}
                        {payment.status === "CREATED" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-accent-amber border border-orange-200">
                            CREATED
                          </span>
                        )}
                        {payment.status === "FAILED" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-accent-coral border border-red-200">
                            FAILED
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-ink-muted">
                        {formatDate(payment.createdAt)}
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
