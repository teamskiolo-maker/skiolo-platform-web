"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";
import { apiFetch } from "@/lib/api";
import { MediaBanner } from "@/components/MediaBanner";

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkshops() {
      try {
        const data = await apiFetch<any[]>("/workshops", { method: "GET" });
        setWorkshops(data);
      } catch (err) {
        console.error("Failed to load workshops", err);
      } finally {
        setLoading(false);
      }
    }
    loadWorkshops();
  }, []);

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

  if (loading) {
    return <div className="p-8 text-center min-h-screen flex items-center justify-center">Loading workshops...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">


      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Upcoming Workshops</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {workshops.map((ws) => (
            <div key={ws.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
              <MediaBanner imageUrl={ws.thumbnail} title={ws.title} variant="workshop" className="w-full h-48 shrink-0" />
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h2 className="text-lg font-semibold line-clamp-2">{ws.title}</h2>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 mt-1 ${ws.mode === 'ONLINE' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                    {ws.mode}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2 font-medium">
                  {formatIST(ws.startsAt)}
                </p>
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm flex-1">{ws.description}</p>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                  <span className="font-bold text-lg">₹{(ws.pricePaise / 100).toFixed(2)}</span>
                  <Link href={`/workshops/${ws.slug}`}>
                    <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition text-sm font-medium">
                      View / Book
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {workshops.length === 0 && (
            <p className="col-span-full text-center text-gray-500 py-10">No workshops available right now.</p>
          )}
        </div>
      </div>
    </div>
  );
}
