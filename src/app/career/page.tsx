import { FadeUp } from "@/components/motion/FadeUp";
import { Stagger } from "@/components/motion/Stagger";
import { Button } from "@/components/ui/Button";
import { Users, BrainCircuit, GraduationCap, CheckCircle2, ArrowRight, MessageCircle } from "lucide-react";

export default function CareerPage() {
  // Frontend-only placeholder content. All CTAs link to WhatsApp.
  const whatsappNumber = "919207000409";
  
  const createWaLink = (message: string) => {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans pb-32">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0A2350] to-[#081B40] text-white pt-24 pb-32 px-6 relative overflow-hidden">
        {/* Subtle background effects */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-blue via-accent-green to-accent-coral" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-blue/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeUp delay={0.1}>
            <p className="text-accent-blue font-bold tracking-widest uppercase text-xs sm:text-sm mb-6 flex items-center justify-center gap-2">
              <span className="w-8 h-[1px] bg-accent-blue/50" />
              SKIOLO CAREER GUIDANCE
              <span className="w-8 h-[1px] bg-accent-blue/50" />
            </p>
          </FadeUp>
          
          <FadeUp delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
              Find your <span className="font-serif-accent italic text-accent-amber font-normal">right direction.</span>
            </h1>
          </FadeUp>
          
          <FadeUp delay={0.3}>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              Expert counseling and scientific assessments to help students choose and pursue the perfect academic and career path.
            </p>
          </FadeUp>
          
          <FadeUp delay={0.4}>
            <a href={createWaLink("Hi SKIOLO, I'd like career guidance.")} target="_blank" rel="noopener noreferrer" className="inline-block">
              <Button variant="primary" size="lg" className="!bg-[#F2B53C] !text-[#050D22] hover:!bg-[#C99120] hover:!text-[#050D22] shadow-[0_0_20px_rgba(242,181,60,0.3)] font-bold">
                <MessageCircle className="w-5 h-5 mr-2" />
                Talk to a counselor
              </Button>
            </a>
          </FadeUp>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-20 space-y-24">
        
        {/* Section 1: General Counseling */}
        <FadeUp>
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-soft-lg border border-line flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <div className="w-14 h-14 bg-accent-blue/10 text-accent-blue rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h2 className="text-3xl font-display font-bold tracking-tight">General Counseling</h2>
              <p className="text-ink-muted text-lg leading-relaxed">
                Guidance for students at every stage — after SSLC, after Plus Two, after graduation, and beyond. Open to everyone looking for clarity in their educational journey.
              </p>
              
              <ul className="space-y-4 mt-8">
                {[
                  "One-on-one sessions to understand strengths, interests, and goals",
                  "Clarity on stream and subject choices after SSLC and Plus Two",
                  "Course and career options after graduation",
                  "Guidance on emerging fields and realistic career roadmaps"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent-green shrink-0 mt-0.5" />
                    <span className="text-ink-soft">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="pt-6">
                <a href={createWaLink("Hi SKIOLO, I'm interested in General Counseling.")} target="_blank" rel="noopener noreferrer" className="inline-block">
                  <Button variant="secondary" className="group">
                    Book general counseling
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="w-full md:w-2/5 shrink-0 bg-paper-sunken rounded-2xl p-8 border border-line/50 relative overflow-hidden">
               <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(#0E2F66 1px, transparent 1px), linear-gradient(90deg, #0E2F66 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
               <div className="relative z-10 flex flex-col gap-6">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-line flex items-center gap-4">
                    <div className="w-10 h-10 bg-accent-coral/10 rounded-full flex items-center justify-center text-accent-coral font-bold font-display">10th</div>
                    <p className="font-medium text-ink">Stream Selection</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-line flex items-center gap-4 ml-6">
                    <div className="w-10 h-10 bg-accent-amber/10 rounded-full flex items-center justify-center text-accent-amber font-bold font-display">12th</div>
                    <p className="font-medium text-ink">Course & College</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-line flex items-center gap-4">
                    <div className="w-10 h-10 bg-accent-green/10 rounded-full flex items-center justify-center text-accent-green font-bold font-display">UG</div>
                    <p className="font-medium text-ink">Career Pathways</p>
                  </div>
               </div>
            </div>
          </div>
        </FadeUp>

        {/* Section 2: Psychometric Test */}
        <div className="space-y-10">
          <FadeUp>
            <div className="text-center max-w-3xl mx-auto">
              <div className="w-14 h-14 bg-accent-amber/10 text-accent-amber rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BrainCircuit className="w-7 h-7" />
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">Psychometric Test</h2>
              <p className="text-ink-muted text-lg">
                Scientific assessments that reveal a student&apos;s strengths, abilities, and personality to guide better decisions.
              </p>
            </div>
          </FadeUp>
          
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Aptitude Test",
                desc: "Measures natural abilities and reasoning skills (logical, numerical, verbal, spatial) to identify suited fields.",
                color: "text-accent-blue",
                bg: "bg-accent-blue/10"
              },
              {
                title: "Multiple Intelligence Test",
                desc: "Identifies the student's dominant intelligences (linguistic, spatial, interpersonal, etc.) to align learning and career paths.",
                color: "text-accent-green",
                bg: "bg-accent-green/10"
              },
              {
                title: "Personality Test",
                desc: "Understands temperament, work style, and preferences to match careers that naturally fit the person.",
                color: "text-accent-coral",
                bg: "bg-accent-coral/10"
              }
            ].map((test, idx) => (
              <FadeUp key={idx} className="h-full">
                <div className="bg-white rounded-2xl p-8 border border-line shadow-soft hover:shadow-soft-lg transition-shadow h-full flex flex-col">
                  <div className={`w-12 h-12 ${test.bg} ${test.color} rounded-xl flex items-center justify-center mb-6`}>
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3">{test.title}</h3>
                  <p className="text-ink-soft leading-relaxed flex-1">{test.desc}</p>
                </div>
              </FadeUp>
            ))}
          </Stagger>
          
          <FadeUp className="text-center">
            <a href={createWaLink("Hi SKIOLO, I'm interested in the Psychometric Test.")} target="_blank" rel="noopener noreferrer" className="inline-block">
              <Button variant="secondary" size="lg" className="group shadow-sm">
                Take a psychometric test
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </FadeUp>
        </div>

        {/* Section 3: Admission Help Desk */}
        <FadeUp>
          <div className="bg-[#0A2350] text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-12 items-center">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-blue rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none" />
             
            <div className="flex-1 space-y-6 relative z-10">
              <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h2 className="text-3xl font-display font-bold tracking-tight">Admission Help Desk</h2>
              <p className="text-white/80 text-lg leading-relaxed">
                A complete, end-to-end admission support package. We guide students to the right entrance exam, manage the application process, and help with college selection — all the way to admission.
              </p>
              
              <ul className="space-y-4 mt-8">
                {[
                  "Identify the right path for the student's goal (e.g. becoming a doctor -> NEET)",
                  "Guidance on and assistance with entrance exam applications — NEET, JEE Main, JEE Advanced, KEAM, CUSAT, and more",
                  "Help choosing the right college and course based on results and preferences",
                  "Support through the full admission process, start to finish"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-white/90">
                    <CheckCircle2 className="w-5 h-5 text-accent-green shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="pt-6">
                <a href={createWaLink("Hi SKIOLO, I need help with admissions / entrance exams.")} target="_blank" rel="noopener noreferrer" className="inline-block">
                  <Button variant="primary" className="!bg-white !text-navy hover:!bg-paper group font-bold">
                    Get admission help
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="w-full md:w-1/3 shrink-0 relative z-10 hidden md:block">
               {/* Visual representation of an application / document */}
               <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl transform rotate-3">
                  <div className="w-1/3 h-2 bg-white/20 rounded mb-6" />
                  <div className="space-y-3 mb-8">
                    <div className="w-full h-3 bg-white/30 rounded" />
                    <div className="w-5/6 h-3 bg-white/30 rounded" />
                    <div className="w-4/6 h-3 bg-white/30 rounded" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-accent-green/80 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 border-2 border-dashed border-white/20 rounded-full" />
                  </div>
               </div>
            </div>
          </div>
        </FadeUp>
        
        {/* Final CTA */}
        <FadeUp>
          <div className="text-center bg-paper-sunken rounded-3xl p-12 border border-line relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50 pointer-events-none" />
             <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-4 text-ink">
                  Not sure where to start?
                </h2>
                <p className="text-ink-muted mb-8 max-w-md mx-auto">
                  Our counselors are ready to help you figure out the best next steps for your career journey.
                </p>
                <a href={createWaLink("Hi SKIOLO, I'm looking for career guidance.")} target="_blank" rel="noopener noreferrer" className="inline-block">
                  <Button variant="primary" size="lg" className="shadow-md">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Talk to us
                  </Button>
                </a>
             </div>
          </div>
        </FadeUp>

      </div>
    </div>
  );
}
