"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/motion/FadeUp";
import { Stagger } from "@/components/motion/Stagger";
import { Search, ChevronLeft, ChevronRight, Users } from "lucide-react";

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: "ADMIN" | "STUDENT" | "STAFF";
  createdAt: string;
  _count: {
    enrollments: number;
    workshopBookings: number;
  };
}

interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
}

export default function UsersPage() {
  const { getToken } = useAuth();
  const [data, setData] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      
      const query = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (debouncedSearch) {
        query.append("search", debouncedSearch);
      }

      const res = await apiFetch<UsersResponse>(`/admin/users?${query.toString()}`, { 
        method: "GET", 
        token 
      });
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, getToken]);

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "STUDENT" : "ADMIN";
    const confirmMsg = newRole === "ADMIN" 
      ? "Are you sure you want to make this user an ADMIN?"
      : "Are you sure you want to remove ADMIN rights from this user?";
      
    if (!window.confirm(confirmMsg)) return;

    try {
      const token = await getToken();
      await apiFetch(`/admin/users/${userId}/role`, {
        method: "PATCH",
        token,
        body: { role: newRole }
      });
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Failed to update user role");
    }
  };

  const formatDate = (isoString: string) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(new Date(isoString));
  };

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <Stagger staggerDelay={0.05} className="space-y-6">
      <FadeUp delay={0}>
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink tracking-tight2">Users</h1>
          <p className="text-ink-muted mt-1 text-sm">Manage user roles and view their purchase history.</p>
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-line rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-shadow"
              />
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
          ) : data?.users.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center justify-center border-2 border-dashed border-line rounded-xl2">
              <Users size={48} className="text-gray-300 mb-3" />
              <p className="text-ink-muted text-sm font-medium">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-xs font-semibold text-ink-muted uppercase tracking-wider border-b border-line">
                  <tr>
                    <th className="px-4 py-3 pb-4">User</th>
                    <th className="px-4 py-3 pb-4">Role</th>
                    <th className="px-4 py-3 pb-4">Purchases</th>
                    <th className="px-4 py-3 pb-4">Joined</th>
                    <th className="px-4 py-3 pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {data?.users.map((user) => (
                    <tr key={user.id} className="hover:bg-paper-sunken transition-colors group">
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-ink">{user.email}</span>
                          {(user.firstName || user.lastName) && (
                            <span className="text-xs text-ink-muted mt-0.5">
                              {user.firstName} {user.lastName}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {user.role === "ADMIN" ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-navy-tint text-navy-deep border border-navy-glow/20">
                            ADMIN
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                            {user.role}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-ink-muted">
                        <div className="flex items-center gap-3">
                          <span title="Courses">Courses: {user._count?.enrollments || 0}</span>
                          <span title="Workshops">Workshops: {user._count?.workshopBookings || 0}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-ink-muted">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        {user.role === "ADMIN" ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRoleChange(user.id, user.role)}
                            className="text-accent-coral hover:text-accent-coral hover:bg-red-50"
                          >
                            Remove Admin
                          </Button>
                        ) : (
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => handleRoleChange(user.id, user.role)}
                            className="text-navy"
                          >
                            Make Admin
                          </Button>
                        )}
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
