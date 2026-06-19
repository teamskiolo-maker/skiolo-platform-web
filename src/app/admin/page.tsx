"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { FadeUp } from "@/components/motion/FadeUp";
import { Stagger } from "@/components/motion/Stagger";
import { IndianRupee, Users, BookOpen, CalendarCheck, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";

interface StatsData {
  totalRevenuePaise: number;
  revenueThisMonthPaise: number;
  totalUsers: number;
  newUsersThisMonth: number;
  totalEnrollments: number;
  totalBookings: number;
  revenueByMonth: { month: string; revenuePaise: number }[];
  revenueByProduct: { title: string; revenuePaise: number }[];
}

export default function AdminDashboard() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);
        const token = await getToken();
        const data = await apiFetch<StatsData>("/admin/stats", { method: "GET", token });
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [getToken]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl2">
        <p className="font-medium">Error loading dashboard</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="p-6 animate-pulse bg-paper-card border-line">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 h-[400px] animate-pulse bg-paper-card border-line"></Card>
          <Card className="p-6 h-[400px] animate-pulse bg-paper-card border-line"></Card>
        </div>
      </div>
    );
  }

  const formatRupee = (paise: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(paise / 100);
  };

  const formatYAxisTick = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1).replace(/\.0$/, '')}L`;
    }
    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    }
    return `₹${value}`;
  };

  const truncateLabel = (label: string, maxLength = 18) => {
    return label.length > maxLength ? label.substring(0, maxLength) + "..." : label;
  };

  const chartDataArea = stats.revenueByMonth.map((item) => {
    const [year, month] = item.month.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    const shortMonth = date.toLocaleString("default", { month: "short" });
    return {
      name: shortMonth,
      revenue: item.revenuePaise / 100,
    };
  });

  const chartDataBar = stats.revenueByProduct.map((item) => ({
    name: item.title,
    revenue: item.revenuePaise / 100,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-navy-deep text-white p-3 rounded-lg shadow-soft text-sm">
          <p className="font-semibold mb-1">{label}</p>
          <p className="text-accent-green font-medium">
            {formatRupee(payload[0].value * 100)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Stagger staggerDelay={0.05} className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <FadeUp delay={0}>
          <Link href="/admin/payments" className="block h-full group">
            <Card className="p-5 flex flex-col justify-between h-full relative overflow-hidden group-hover:border-navy transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <IndianRupee size={48} className="text-navy" />
              </div>
              <div className="flex items-center gap-2 text-ink-muted mb-2">
                <IndianRupee size={18} />
                <h3 className="text-sm font-medium">Total Revenue</h3>
              </div>
              <div>
                <p className="text-3xl font-display font-bold tracking-tight2 text-navy-deep">
                  {formatRupee(stats.totalRevenuePaise)}
                </p>
              </div>
            </Card>
          </Link>
        </FadeUp>

        <FadeUp delay={0.1}>
          <Link href="/admin/payments" className="block h-full group">
            <Card className="p-5 flex flex-col justify-between h-full relative overflow-hidden group-hover:border-navy transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                <TrendingUp size={48} className="text-ink" />
              </div>
              <div className="flex items-center gap-2 text-ink-muted mb-2">
                <TrendingUp size={18} />
                <h3 className="text-sm font-medium">This Month</h3>
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-tight2 text-ink">
                  {formatRupee(stats.revenueThisMonthPaise)}
                </p>
              </div>
            </Card>
          </Link>
        </FadeUp>

        <FadeUp delay={0.2}>
          <Link href="/admin/users" className="block h-full group">
            <Card className="p-5 flex flex-col justify-between h-full relative overflow-hidden group-hover:border-navy transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                <Users size={48} className="text-ink" />
              </div>
              <div className="flex items-center gap-2 text-ink-muted mb-2">
                <Users size={18} />
                <h3 className="text-sm font-medium">Total Users</h3>
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-tight2 text-ink">
                  {stats.totalUsers}
                </p>
                <p className="text-xs text-accent-green font-medium mt-1">
                  +{stats.newUsersThisMonth} this month
                </p>
              </div>
            </Card>
          </Link>
        </FadeUp>

        <FadeUp delay={0.3}>
          <Link href="/admin/payments" className="block h-full group">
            <Card className="p-5 flex flex-col justify-between h-full relative overflow-hidden group-hover:border-navy transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                <BookOpen size={48} className="text-ink" />
              </div>
              <div className="flex items-center gap-2 text-ink-muted mb-2">
                <BookOpen size={18} />
                <h3 className="text-sm font-medium">Enrollments</h3>
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-tight2 text-ink">
                  {stats.totalEnrollments}
                </p>
              </div>
            </Card>
          </Link>
        </FadeUp>

        <FadeUp delay={0.4}>
          <Link href="/admin/bookings" className="block h-full group">
            <Card className="p-5 flex flex-col justify-between h-full relative overflow-hidden group-hover:border-navy transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                <CalendarCheck size={48} className="text-ink" />
              </div>
              <div className="flex items-center gap-2 text-ink-muted mb-2">
                <CalendarCheck size={18} />
                <h3 className="text-sm font-medium">Bookings</h3>
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-tight2 text-ink">
                  {stats.totalBookings}
                </p>
              </div>
            </Card>
          </Link>
        </FadeUp>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FadeUp delay={0.5}>
          <Card className="p-6">
            <h3 className="text-lg font-semibold tracking-tight2 mb-6 text-ink">
              Revenue (last 6 months)
            </h3>
            <div className="h-[300px] w-full">
              {chartDataArea.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartDataArea} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0E2F66" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0E2F66" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E6DF" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6B6B70', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6B6B70', fontSize: 12 }}
                      tickFormatter={formatYAxisTick}
                      width={60}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#0E2F66" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-ink-muted text-sm">
                  No revenue data yet
                </div>
              )}
            </div>
          </Card>
        </FadeUp>

        <FadeUp delay={0.6}>
          <Card className="p-6">
            <h3 className="text-lg font-semibold tracking-tight2 mb-6 text-ink">
              Top products by revenue
            </h3>
            <div className="h-[300px] w-full">
              {chartDataBar.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartDataBar} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E8E6DF" />
                    <XAxis 
                      type="number"
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6B6B70', fontSize: 12 }}
                      tickFormatter={formatYAxisTick}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#0A0A0B', fontSize: 13, fontWeight: 500 }}
                      tickFormatter={(value) => truncateLabel(value)}
                      width={140}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: '#F2F1EC'}} />
                    <Bar 
                      dataKey="revenue" 
                      fill="#3FB57A" 
                      radius={[0, 4, 4, 0]}
                      barSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-ink-muted text-sm">
                  No product data yet
                </div>
              )}
            </div>
          </Card>
        </FadeUp>
      </div>
    </Stagger>
  );
}
