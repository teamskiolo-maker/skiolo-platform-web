"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth, RedirectToSignIn } from "@clerk/nextjs";
import { apiFetch } from "@/lib/api";
import { CourseTierBanner, CourseTier } from "@/components/CourseTierBanner";
import { FadeUp } from "@/components/motion/FadeUp";
import { Stagger } from "@/components/motion/Stagger";
import { Button } from "@/components/ui/Button";
import { BookOpen } from "lucide-react";

export default function MyCoursesPage() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMyCourses() {
      if (!isLoaded || !isSignedIn) return;
      try {
        const token = await getToken();
        if (token) {
          const data = await apiFetch<any[]>("/me/courses", { method: "GET", token });
          setCourses(data);
        }
      } catch (err) {
        console.error("Failed to load my courses", err);
      } finally {
        setLoading(false);
      }
    }
    if (isLoaded) {
      loadMyCourses();
    }
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded) {
    return <div className="p-8 text-center min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  const getTier = (pricePaise?: number): CourseTier => {
    if (!pricePaise) return "STANDARD";
    return pricePaise >= 1000000 ? "PREMIUM" : pricePaise >= 400000 ? "STANDARD" : "BASIC";
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans pb-32">
      <div className="max-w-6xl mx-auto px-6 pt-12 md:pt-20">
        <FadeUp>
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight2 mb-4">
              My <span className="font-serif-accent text-navy italic">Courses</span>
            </h1>
            <p className="text-ink-muted text-lg max-w-2xl">
              Everything you&apos;ve unlocked, in one place.
            </p>
          </div>
        </FadeUp>

        {loading ? (
          <div className="text-center py-20 text-ink-muted flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-navy/20 border-t-navy rounded-full animate-spin mb-4" />
            <p className="font-medium">Loading your courses...</p>
          </div>
        ) : (
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {courses.map((course) => {
              const tier = getTier(course.pricePaise);
              return (
                <FadeUp key={course.id} className="h-full">
                  <div className="relative h-full flex flex-col bg-paper-card border border-line rounded-2xl2 overflow-hidden shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1">
                    <CourseTierBanner 
                      tier={tier} 
                      className="w-full aspect-video" 
                    />
                    <div className="p-6 flex flex-col flex-1">
                      <h2 className="text-xl font-display font-semibold text-ink tracking-tight2 line-clamp-2 mb-6 flex-1">
                        {course.title}
                      </h2>
                      <Link href={`/courses/${course.slug}`} className="mt-auto">
                        <Button variant="primary" className="w-full justify-center shadow-sm">
                          Access Course
                        </Button>
                      </Link>
                    </div>
                  </div>
                </FadeUp>
              );
            })}
            
            {courses.length === 0 && (
              <div className="col-span-full py-24 px-6 text-center bg-white rounded-2xl2 border border-line shadow-sm">
                <div className="w-16 h-16 bg-navy/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-navy">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-display font-semibold text-ink mb-2">No courses yet</h3>
                <p className="text-ink-muted mb-8 max-w-md mx-auto">
                  You haven&apos;t enrolled in any courses yet. Start your journey by exploring our available programs.
                </p>
                <Link href="/courses">
                  <Button variant="primary" size="lg" className="shadow-soft">
                    Browse Courses
                  </Button>
                </Link>
              </div>
            )}
          </Stagger>
        )}
      </div>
    </div>
  );
}
