import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { ProcessStep } from "@shared/schema";

export default function Process() {
  const { data: steps = [], isLoading } = useQuery<ProcessStep[]>({ queryKey: ["/api/process"] });
  const title = "My Design Process";
  const subtitle = "A structured yet flexible approach to solving complex design challenges. Every project is unique, but these core principles guide my work.";
  const ctaTitle = "Ready to work together?";
  const ctaSubtitle = "Let's discuss how my process can help solve your design challenges";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <section className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs bg-muted border border-border rounded-full px-3 py-1 text-muted-foreground">How I Work</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-foreground mb-4">{title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">{subtitle}</p>
        </section>

        <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-20">
          {isLoading ? (
            <div className="flex flex-col gap-16">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-48 rounded-3xl bg-muted animate-pulse" />)}
            </div>
          ) : (
            <div className="w-full flex flex-col gap-0">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-10 xl:gap-16 py-16 border-b border-border ${index === steps.length - 1 ? "border-b-0" : ""}`}
                  data-testid={`process-step-${step.stepNumber}`}
                >
                  <div className={`flex flex-col gap-5 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-sm font-black" style={{ backgroundColor: step.color ?? "#2b7fff" }}>
                        {String(step.stepNumber).padStart(2, "0")}
                      </div>
                      <span className="text-4xl font-black text-foreground/10">{String(step.stepNumber).padStart(2, "0")}</span>
                    </div>
                    <h2 className="text-3xl font-black text-foreground">{step.title}</h2>
                    <p className="text-muted-foreground leading-relaxed max-w-2xl">{step.description}</p>
                    {step.keyActivities && step.keyActivities.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Key Activities</p>
                        <ul className="flex flex-col gap-2">
                          {step.keyActivities.map((activity, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: step.color ?? "#2b7fff" }} />
                              <span>{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className={`${index % 2 === 1 ? "lg:order-1" : ""} flex items-start justify-center w-full`}>
                    <div className="relative w-full">
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-foreground/5 to-transparent blur-2xl" />
                      <div className="relative rounded-3xl border border-border bg-card p-8 w-full">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-xs font-black" style={{ backgroundColor: step.color ?? "#2b7fff" }}>
                            {String(step.stepNumber).padStart(2, "0")}
                          </div>
                          <p className="text-sm font-medium text-muted-foreground">Step {step.stepNumber}</p>
                        </div>
                        <div className="min-h-[280px] rounded-2xl border border-border bg-muted/20 p-6 flex items-center justify-center">
                          <div className="text-center max-w-md">
                            <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-foreground/5 flex items-center justify-center text-2xl font-black text-foreground/20">
                              {String(step.stepNumber).padStart(2, "0")}
                            </div>
                            <p className="text-sm text-muted-foreground">Use the admin dashboard to customize this step’s content.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-20">
          <div className="rounded-3xl border border-border bg-muted/30 p-12 text-center">
            <h2 className="text-3xl font-black text-foreground mb-3">{ctaTitle}</h2>
            <p className="text-muted-foreground mb-8">{ctaSubtitle}</p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
              Get in Touch <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
