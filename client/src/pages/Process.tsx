import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { ProcessStep } from "@shared/schema";

export default function Process() {
  const { data: steps = [], isLoading } = useQuery<ProcessStep[]>({
    queryKey: ["/api/process"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs bg-muted border border-border rounded-full px-3 py-1 text-muted-foreground">How I Work</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-foreground mb-4">My Design Process</h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            A structured yet flexible approach to solving complex design challenges. Every project is unique, but these core principles guide my work.
          </p>
        </section>

        {/* Process Steps */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-20">
          {isLoading ? (
            <div className="flex flex-col gap-16">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 rounded-3xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-0">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 py-16 border-b border-border ${
                    index === steps.length - 1 ? "border-b-0" : ""
                  }`}
                  data-testid={`process-step-${step.stepNumber}`}
                >
                  {/* Content — alternates sides */}
                  <div className={`flex flex-col gap-5 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-sm font-black"
                        style={{ backgroundColor: step.color ?? "#2b7fff" }}
                      >
                        {String(step.stepNumber).padStart(2, "0")}
                      </div>
                      <span className="text-4xl font-black text-foreground/10">{String(step.stepNumber).padStart(2, "0")}</span>
                    </div>

                    <h2 className="text-3xl font-black text-foreground">{step.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>

                    {step.keyActivities && step.keyActivities.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Key Activities</p>
                        <ul className="flex flex-col gap-2">
                          {step.keyActivities.map((activity, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                              <span
                                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: step.color ?? "#2b7fff" }}
                              />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Visual placeholder */}
                  <div className={`rounded-3xl min-h-[240px] lg:min-h-[300px] ${index % 2 === 1 ? "lg:order-1" : ""}`}
                    style={{
                      background: `linear-gradient(135deg, ${step.color ?? "#2b7fff"}15 0%, ${step.color ?? "#2b7fff"}25 100%)`,
                      border: `1px solid ${step.color ?? "#2b7fff"}20`,
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-7xl font-black opacity-10" style={{ color: step.color ?? "#2b7fff" }}>
                        {String(step.stepNumber).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-muted/30 py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-4xl font-black text-foreground mb-4">Ready to work together?</h2>
            <p className="text-muted-foreground mb-8">Let's discuss how my process can help solve your design challenges</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-foreground text-background font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity"
              data-testid="process-cta"
            >
              Get in Touch
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
