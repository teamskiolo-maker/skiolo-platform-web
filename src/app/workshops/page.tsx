"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { WorkshopCard } from "@/components/WorkshopCard";
import { FadeUp } from "@/components/motion/FadeUp";
import { Users, AlertCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWorkshops() {
      try {
        setError(null);
        const data = await apiFetch<any[]>("/workshops", { method: "GET" });
        setWorkshops(data);
      } catch (err) {
        console.error("Failed to load workshops", err);
        setError("We couldn't load the workshops at the moment. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadWorkshops();
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink font-sans">
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-32">
        <FadeUp>
          <div className="mb-16 md:mb-20">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-ink tracking-tight2 mb-4">
              Upcoming <span className="font-serif-accent italic font-normal text-navy">workshops.</span>
            </h1>
            <p className="text-lg text-ink-muted max-w-2xl">
              Immersive, high-impact sessions designed to implement systems directly into your business.
            </p>
          </div>
        </FadeUp>

        {loading ? (
          <div className="flex flex-col gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col md:flex-row bg-paper-card border border-line rounded-2xl2 overflow-hidden shadow-soft animate-pulse">
                <div className="w-full md:w-2/5 aspect-video md:aspect-auto bg-line/50 shrink-0" />
                <div className="p-8 md:p-10 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-8 bg-line/50 rounded w-2/3" />
                    <div className="h-6 bg-line/30 rounded w-20" />
                  </div>
                  <div className="flex gap-8 mb-6">
                    <div className="h-4 bg-line/30 rounded w-32" />
                    <div className="h-4 bg-line/30 rounded w-24" />
                  </div>
                  <div className="h-4 bg-line/30 rounded w-full mb-2" />
                  <div className="h-4 bg-line/30 rounded w-5/6 mb-8" />
                  <div className="mt-auto pt-6 border-t border-line/50 flex justify-between items-center">
                    <div className="h-10 bg-line/50 rounded w-24" />
                    <div className="h-12 bg-line/50 rounded w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <FadeUp delay={0.1}>
            <div className="py-20 text-center flex flex-col items-center justify-center bg-paper-sunken border border-line rounded-2xl2">
              <div className="w-16 h-16 rounded-full bg-accent-coral/10 flex items-center justify-center mb-6 text-accent-coral">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-display font-semibold text-ink mb-2">Oops, something went wrong</h3>
              <p className="text-ink-muted">{error}</p>
            </div>
          </FadeUp>
        ) : workshops.length === 0 ? (
          <FadeUp delay={0.1}>
            <div className="py-24 text-center flex flex-col items-center justify-center bg-paper-sunken border border-line rounded-2xl2">
              <div className="w-20 h-20 rounded-full bg-navy/5 flex items-center justify-center mb-6 text-navy/40 border border-navy/10">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-display font-semibold text-ink mb-3">No workshops scheduled right now</h3>
              <p className="text-ink-muted max-w-md mx-auto">
                We&apos;re planning our next set of live sessions. Please check back later.
              </p>
            </div>
          </FadeUp>
        ) : (
          <div className="flex flex-col gap-8 md:gap-10">
            {workshops.map((ws, i) => (
              <FadeUp key={ws.id} delay={0.1 + (i % 3) * 0.1}>
                <WorkshopCard workshop={ws} />
              </FadeUp>
            ))}
          </div>
        )}

        {/* CLOSING CTA PANEL */}
        {!loading && (
          <FadeUp delay={0.4} className="mt-20">
            <div className="bg-gradient-to-br from-[#FAFAF8] to-white border border-line rounded-2xl2 p-10 md:p-12 text-center relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-amber/5 rounded-full blur-[60px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-blue/5 rounded-full blur-[60px] pointer-events-none translate-y-1/3 -translate-x-1/3" />
              
              <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
                <div className="w-14 h-14 bg-navy/5 rounded-full flex items-center justify-center mb-6">
                  <MessageSquare className="w-6 h-6 text-navy" />
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-ink mb-4 tracking-tight2">
                  Want a workshop for your team?
                </h3>
                <p className="text-ink-muted text-lg mb-8 leading-relaxed">
                  We run custom, closed-door implementation workshops for organizations. Get in touch to schedule a private session.
                </p>
                <a href="https://wa.me/918304807856?text=Hi%20SKIOLO%2C%20I%27d%20like%20to%20enquire%20about%20a%20custom%20team%20workshop" target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="lg" className="px-8 shadow-sm font-semibold">
                    Get in touch
                  </Button>
                </a>
              </div>
            </div>
          </FadeUp>
        )}
      </div>
    </div>
  );
}
