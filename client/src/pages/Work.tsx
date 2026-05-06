import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { Project } from "@shared/schema";

export default function Work() {
  const { data: projects = [], isLoading } = useQuery<Project[]>({ queryKey: ["/api/projects"] });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <section className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
          <h1 className="text-5xl lg:text-6xl font-black text-foreground mb-4">Featured Work</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-14">Real-world problems solved through thoughtful design and user research</p>

          {isLoading ? <div className="flex flex-col gap-8">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-80 rounded-3xl bg-muted animate-pulse" />)}</div> : <div className="flex flex-col gap-8">{projects.map((project) => { const colors: Record<string, string> = { "#2b7fff": "bg-blue-500", "#ad46ff": "bg-purple-500", "#ff6b35": "bg-orange-500", "#00c896": "bg-emerald-500" }; const bgColor = colors[project.iconColor ?? "#2b7fff"] ?? "bg-blue-500"; return (<article key={project.id} className="group rounded-3xl border border-border bg-card overflow-hidden hover:border-foreground/20 transition-colors"><div className="grid grid-cols-1 xl:grid-cols-2 gap-0"><div className="flex flex-col justify-between p-8 xl:p-12"><div className="flex flex-col gap-5"><div className="flex items-center gap-3">{project.iconUrl ? <div className="h-10 w-10 rounded-xl border border-border bg-muted/20 p-1.5 flex items-center justify-center overflow-hidden"><img src={project.iconUrl} alt={`${project.title} icon`} className="h-full w-full object-contain" /></div> : <div className={`h-10 w-10 rounded-xl ${bgColor} flex items-center justify-center`}><span className="text-white text-xs font-bold">{project.category.charAt(0)}</span></div>}<span className="text-sm text-muted-foreground">{project.category}</span></div><div><h2 className="text-2xl xl:text-3xl font-bold text-foreground mb-2">{project.title}</h2><p className="text-muted-foreground leading-relaxed">{project.description}</p></div>{project.problemStatement && (<div className="flex flex-col gap-2"><span className="text-xs text-muted-foreground uppercase tracking-wider">Problem Statement</span><blockquote className="border-l-4 border-foreground pl-4 text-sm text-foreground italic leading-relaxed">"{project.problemStatement}"</blockquote></div>)}</div><div className="flex items-center justify-between pt-6 mt-6 border-t border-border"><div><p className="text-xs text-muted-foreground mb-1">Impact</p><p className="text-xl font-bold text-emerald-500">{project.impact}</p></div><Link href={`/work/${project.slug}`} className="flex items-center gap-2 text-sm font-medium text-foreground hover:gap-3 transition-all" data-testid={`view-case-study-${project.id}`}>View Case Study<ArrowUpRight size={16} /></Link></div></div><div className="relative min-h-[300px] xl:min-h-[480px] bg-muted overflow-hidden">{project.imageUrl ? <img src={project.imageUrl} alt={project.title} className="absolute inset-0 w-full h-full object-cover" /> : <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${project.iconColor ?? "#2b7fff"}22 0%, ${project.iconColor ?? "#2b7fff"}44 100%)` }}><div className="absolute inset-0 flex items-center justify-center"><div className="text-6xl xl:text-8xl font-black opacity-10 text-foreground select-none">{project.title.charAt(0)}</div></div><div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.3) 1px, transparent 1px)", backgroundSize: "32px 32px" }} /></div>}</div></div></article>);})}</div>}
        </section>
      </div>
      <Footer />
    </div>
  );
}
