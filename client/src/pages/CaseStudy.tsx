import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { Project } from "@shared/schema";

export default function CaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", slug],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${slug}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
  });

  if (isLoading) {
    return <div className="min-h-screen bg-background"><Navbar /><div className="pt-16 mx-auto max-w-4xl px-6 py-20"><div className="flex flex-col gap-6"><div className="h-8 w-48 bg-muted rounded-xl animate-pulse" /><div className="h-16 w-full bg-muted rounded-xl animate-pulse" /><div className="h-64 w-full bg-muted rounded-3xl animate-pulse" /></div></div></div>;
  }

  if (!project) {
    return <div className="min-h-screen bg-background"><Navbar /><div className="pt-16 mx-auto max-w-4xl px-6 py-20 text-center"><h1 className="text-4xl font-black text-foreground mb-4">Case Study Not Found</h1><p className="text-muted-foreground mb-8">This project doesn't exist or has been removed.</p><Link href="/work" className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"><ArrowLeft size={16} /> Back to Work</Link></div></div>;
  }

  const DESIGN_PROCESS_STEPS = ["Discover", "Define", "Design", "Test", "Deliver"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 py-12">
          <Link href="/work" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10" data-testid="back-to-work"><ArrowLeft size={16} /> Back to Work</Link>
          {project.tags && project.tags.length > 0 && <div className="flex flex-wrap gap-2 mb-6">{project.tags.map((tag) => <span key={tag} className="text-xs px-3 py-1 bg-muted border border-border rounded-full text-muted-foreground">{tag}</span>)}</div>}
          <h1 className="text-4xl lg:text-5xl font-black text-foreground mb-4">{project.title}</h1>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">{project.description}</p>
          <div className="w-full aspect-video rounded-3xl overflow-hidden mb-12 border border-border" style={{ background: project.imageUrl ? undefined : `linear-gradient(135deg, ${project.iconColor ?? "#2b7fff"}22 0%, ${project.iconColor ?? "#2b7fff"}44 100%)` }}>{project.imageUrl ? <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="text-9xl font-black opacity-10 text-foreground">{project.title.charAt(0)}</span></div>}</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 bg-muted/30 rounded-3xl border border-border mb-12">{project.role && <div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">My Role</p><p className="text-sm font-semibold text-foreground">{project.role}</p></div>}{project.duration && <div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Duration</p><p className="text-sm font-semibold text-foreground">{project.duration}</p></div>}{project.team && <div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Team</p><p className="text-sm font-semibold text-foreground">{project.team}</p></div>}</div>
          {project.theProblem && <section className="mb-14"><h2 className="text-2xl font-black text-foreground mb-4">The Problem</h2><div className="border-l-4 pl-6" style={{ borderColor: project.iconColor ?? "#2b7fff" }}><p className="text-muted-foreground leading-relaxed">{project.theProblem}</p></div></section>}
          <section className="mb-14"><h2 className="text-2xl font-black text-foreground mb-6">Design Process</h2><div className="flex items-center gap-2 flex-wrap">{DESIGN_PROCESS_STEPS.map((step, i) => <div key={step} className="flex items-center gap-2"><div className="flex flex-col items-center gap-1"><div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: `linear-gradient(135deg, ${project.iconColor ?? "#2b7fff"}, #ad46ff)` }}>{i + 1}</div><span className="text-xs text-muted-foreground whitespace-nowrap">{step}</span></div>{i < DESIGN_PROCESS_STEPS.length - 1 && <div className="w-8 h-px bg-border -mt-4" />}</div>)}</div></section>
          {project.wireframesImageUrl ? <section className="mb-14"><h2 className="text-2xl font-black text-foreground mb-6">Wireframes & Iterations</h2><div className="rounded-3xl overflow-hidden border border-border bg-muted aspect-video"><img src={project.wireframesImageUrl} alt="Wireframes" className="w-full h-full object-cover" /></div></section> : <section className="mb-14"><h2 className="text-2xl font-black text-foreground mb-6">Wireframes & Iterations</h2><div className="rounded-3xl border border-border bg-muted/30 aspect-video flex items-center justify-center"><span className="text-muted-foreground text-sm">Wireframes coming soon</span></div></section>}
          {project.theSolution && <section className="mb-14"><h2 className="text-2xl font-black text-foreground mb-4">The Solution</h2><p className="text-muted-foreground leading-relaxed">{project.theSolution}</p></section>}
          {project.results && project.results.length > 0 && <section className="mb-14"><h2 className="text-2xl font-black text-foreground mb-6">Impact & Results</h2><div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{project.results.map((r, i) => <div key={i} className="p-6 rounded-3xl bg-muted/30 border border-border text-center"><p className="text-4xl font-black mb-2" style={{ color: project.iconColor ?? "#2b7fff" }}>{r.value}</p><p className="text-sm text-muted-foreground">{r.label}</p></div>)}</div></section>}
          {project.keyLearnings && project.keyLearnings.length > 0 && <section className="mb-14"><h2 className="text-2xl font-black text-foreground mb-6">Key Learnings</h2><div className="flex flex-col gap-3">{project.keyLearnings.map((learning, i) => <div key={i} className="flex items-start gap-3 p-4 bg-muted/30 rounded-2xl border border-border"><div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5" style={{ backgroundColor: project.iconColor ?? "#2b7fff" }}>{i + 1}</div><p className="text-sm text-foreground leading-relaxed">{learning}</p></div>)}</div></section>}
          <div className="flex justify-end pt-8 border-t border-border"><Link href="/work" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:opacity-70 transition-opacity">View All Projects<ArrowUpRight size={16} /></Link></div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
