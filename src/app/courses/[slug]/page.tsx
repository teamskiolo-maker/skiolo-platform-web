"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { loadRazorpayScript } from "@/lib/razorpay";
import { MediaBanner } from "@/components/MediaBanner";
import { FadeUp } from "@/components/motion/FadeUp";
import { Button } from "@/components/ui/Button";
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [accessUrl, setAccessUrl] = useState<string | null>(null);

  useEffect(() => {
    async function checkEnrollment() {
      if (!isSignedIn) return;
      try {
        const token = await getToken();
        if (token) {
          const access = await apiFetch<any>(`/courses/${slug}/access`, { method: "GET", token });
          setIsEnrolled(true);
          setAccessUrl(access.accessUrl);
        }
      } catch (err) {
        // 403 expected if not enrolled
        console.log("Enrollment check:", err);
      }
    }
    checkEnrollment();
  }, [slug, isSignedIn, getToken]);

  useEffect(() => {
    async function loadCourse() {
      try {
        const data = await apiFetch<any>(`/courses/${slug}`, { method: "GET" });
        setCourse(data);
      } catch (err) {
        console.error("Failed to load course", err);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [slug]);

  const handleBuy = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setBuying(true);
    setMessage("");

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setMessage("Failed to load payment gateway. Please try again.");
        setBuying(false);
        return;
      }

      const token = await getToken();
      if (!token) {
        setMessage("Authentication error. Please sign in again.");
        setBuying(false);
        return;
      }

      const orderData = await apiFetch<any>(`/payments/course/${course.id}`, {
        method: "POST",
        token,
      });

      const options = {
        key: orderData.razorpayKeyId,
        amount: orderData.amountPaise,
        currency: orderData.currency,
        name: "SKIOLO",
        description: orderData.courseTitle,
        order_id: orderData.orderId,
        handler: function (response: any) {
          setMessage("Payment received, confirming your enrollment shortly...");
        },
        prefill: {
          email: user?.primaryEmailAddress?.emailAddress || "",
        },
        theme: { color: "#000000" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setMessage(`Payment failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "An error occurred during checkout.");
    } finally {
      setBuying(false);
    }
  };

  const handleAccess = () => {
    if (accessUrl) {
      window.open(accessUrl, "_blank");
    } else {
      setMessage("Course link will be available soon.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper text-ink flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-line border-t-navy rounded-full animate-spin mb-4" />
          <span className="text-ink-muted font-medium">Loading course...</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-paper text-ink flex flex-col items-center justify-center pt-20">
        <div className="w-16 h-16 rounded-full bg-accent-coral/10 flex items-center justify-center mb-6 text-accent-coral">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-display font-semibold mb-2">Course not found</h3>
        <p className="text-ink-muted mb-8">We couldn&apos;t find the course you&apos;re looking for.</p>
        <Link href="/courses">
          <Button variant="secondary" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to courses
          </Button>
        </Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(course.pricePaise / 100);

  return (
    <div className="min-h-screen bg-paper text-ink font-sans pb-32">
      <div className="max-w-6xl mx-auto px-6 pt-12">
        <FadeUp>
          <Link href="/courses" className="inline-flex items-center gap-2 text-ink-muted hover:text-navy font-medium text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to courses
          </Link>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Main Content (Left) */}
          <div className="lg:col-span-8">
            <FadeUp delay={0.1}>
              <div className="rounded-2xl2 overflow-hidden mb-10 shadow-soft border border-line">
                <MediaBanner 
                  imageUrl={course.thumbnail} 
                  title={course.title} 
                  variant="course" 
                  className="w-full aspect-video" 
                />
              </div>

              <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-ink tracking-tight2 mb-6 leading-tight">
                  {course.title}
                </h1>
                
                <div className="prose prose-lg prose-slate max-w-none text-ink-soft">
                  {/* Since description is likely plain text based on the previous code, we just render it with whitespace-pre-line. If it's HTML, we'd use dangerouslySetInnerHTML */}
                  <p className="whitespace-pre-line leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Sidebar CTA (Right) */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <FadeUp delay={0.2}>
              <div className="bg-white border border-line rounded-2xl2 p-8 shadow-soft-lg relative overflow-hidden">
                {/* Subtle branded accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-navy/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                
                <div className="mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-ink-muted block mb-2">Enrollment</span>
                  <div className="text-4xl font-display font-bold text-navy">
                    {formattedPrice}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {isEnrolled ? (
                    <Button 
                      variant="secondary"
                      size="lg"
                      onClick={handleAccess}
                      className="w-full justify-center py-4 text-base bg-navy-tint text-navy border-none hover:bg-navy/20"
                    >
                      Access Course
                    </Button>
                  ) : (
                    <Button 
                      variant="primary"
                      size="lg"
                      onClick={handleBuy} 
                      disabled={buying}
                      className="w-full justify-center py-4 text-base shadow-soft"
                    >
                      {buying ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : "Buy Now"}
                    </Button>
                  )}
                  
                  <p className="text-xs text-center text-ink-muted">
                    {isEnrolled 
                      ? "You already have access to this course." 
                      : "Secure payment via Razorpay. Instant access."}
                  </p>
                </div>

                {/* Status Messages */}
                {message && (
                  <FadeUp delay={0.1}>
                    <div className={`mt-6 p-4 rounded-xl border flex gap-3 text-sm leading-relaxed
                      ${message.includes("failed") || message.includes("error") || message.includes("Failed") 
                        ? "bg-accent-coral/10 text-red-800 border-accent-coral/20" 
                        : "bg-accent-green/10 text-emerald-800 border-accent-green/20"}`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {message.includes("failed") || message.includes("error") || message.includes("Failed") 
                          ? <AlertCircle className="w-4 h-4" />
                          : <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{message}</p>
                        {message.includes("Payment received") && !isEnrolled && (
                          <button 
                            onClick={async () => {
                              try {
                                const token = await getToken();
                                if (!token) return;
                                const access = await apiFetch<any>(`/courses/${slug}/access`, { method: "GET", token });
                                setIsEnrolled(true);
                                setAccessUrl(access.accessUrl);
                                setMessage("Enrollment confirmed!");
                              } catch (err) {
                                setMessage("Payment received, confirming your enrollment shortly... (still processing)");
                              }
                            }}
                            className="mt-2 text-emerald-900 underline font-semibold hover:text-emerald-700 transition-colors inline-block"
                          >
                            Refresh access
                          </button>
                        )}
                      </div>
                    </div>
                  </FadeUp>
                )}
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </div>
  );
}
