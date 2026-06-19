"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { CourseCard } from "@/components/CourseCard";
import { FadeUp } from "@/components/motion/FadeUp";
import { BookX, AlertCircle } from "lucide-react";
import { CourseTierBanner, CourseTier, computeTier } from "@/components/CourseTierBanner";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        setError(null);
        const data = await apiFetch<any[]>("/courses", { method: "GET" });
        setCourses(data);
      } catch (err) {
        console.error("Failed to load courses", err);
        setError("We couldn't load the courses at the moment. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink font-sans">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-32">
        <FadeUp>
          <div className="mb-16 md:mb-20">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-ink tracking-tight2 mb-4">
              Master your <span className="font-serif-accent italic font-normal text-navy">systems.</span>
            </h1>
            <p className="text-lg text-ink-muted max-w-2xl">
              Practical, hands-on courses designed to help you build, scale, and optimize every part of your business.
            </p>
          </div>
        </FadeUp>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-paper-card border border-line rounded-2xl2 overflow-hidden shadow-soft animate-pulse">
                <div className="w-full aspect-video bg-line/50" />
                <div className="p-6">
                  <div className="h-6 bg-line/50 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-line/30 rounded w-full mb-2" />
                  <div className="h-4 bg-line/30 rounded w-5/6 mb-6" />
                  <div className="flex justify-between items-center pt-4 border-t border-line/50 mt-4">
                    <div className="h-6 bg-line/50 rounded w-1/3" />
                    <div className="h-9 bg-line/50 rounded w-28" />
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
        ) : courses.length === 0 ? (
          <FadeUp delay={0.1}>
            <div className="py-24 text-center flex flex-col items-center justify-center bg-paper-sunken border border-line rounded-2xl2">
              <div className="w-20 h-20 rounded-full bg-navy/5 flex items-center justify-center mb-6 text-navy/40 border border-navy/10">
                <BookX className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-display font-semibold text-ink mb-3">No courses available yet</h3>
              <p className="text-ink-muted max-w-md mx-auto">
                We&apos;re currently building our course library. Check back soon for new programs designed to scale your business.
              </p>
            </div>
          </FadeUp>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Sort so PREMIUM is at the end or basic->standard->premium visually */}
            {[...courses]
              .sort((a, b) => a.pricePaise - b.pricePaise)
              .map((course, i) => (
              <FadeUp key={course.id} delay={0.1 + (i % 3) * 0.1} className="h-full flex">
                <CourseCard course={course} tier={computeTier(course, courses)} />
              </FadeUp>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
