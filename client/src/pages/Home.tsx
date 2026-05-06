import { Link } from "wouter";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { Project } from "@shared/schema";
import heroImagePath from "@assets/UI_Designer_Portfolio_Website_1778060655592.png";

function ProjectCard({ project }: { project: Project }) {
  const colors: Record<string, string> = {
    "#2b7fff": "bg-blue-500",
    "#ad46ff": "bg-purple-500",
    "#ff6b35": "bg-orange-500",
    "#00c896": "bg-emerald-500",
  };
  const bgColor = colors[project.iconColor ?? "#2b7fff"] ?? "bg-blue-500";

  return (
    <article className="group rounded-3xl border border-border bg-card overflow-hidden hover:border-foreground/20 transition-colors">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-0">
        <div className="flex flex-col justify-between p-8 xl:p-12">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              {project.iconUrl ? (
                <div className="h-10 w-10 rounded-xl border border-border bg-muted/20 p-1.5 flex items-center justify-center overflow-hidden">
                  <img src={project.iconUrl} alt={`${project.title} icon`} className="h-full w-full object-contain" />
                </div>
              ) : (
                <div className={`h-10 w-10 rounded-xl ${bgColor} flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">{project.category.charAt(0)}</span>
                </div>
              )}
              <span className="text-sm text-muted-foreground">{project.category}</span>
            </div>
            <div>
              <h2 className="text-2xl xl:text-3xl font-bold text-foreground mb-2">{project.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{project.description}</p>
            </div>
            {project.problemStatement && (
              <div className="flex flex-col gap-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Problem Statement</span>
                <blockquote className="border-l-4 border-foreground pl-4 text-sm text-foreground italic leading-relaxed">"{project.problemStatement}"</blockquote>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Impact</p>
              <p className="text-xl font-bold text-emerald-500">{project.impact}</p>
            </div>
            <Link href={`/work/${project.slug}`} className="flex items-center gap-2 text-sm font-medium text-foreground hover:gap-3 transition-all" data-testid={`view-case-study-${project.id}`}>
              View Case Study
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <div className="relative min-h-[300px] xl:min-h-[480px] bg-muted overflow-hidden">
          {project.imageUrl ? <img src={project.imageUrl} alt={project.title} className="absolute inset-0 w-full h-full object-cover" /> : <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${project.iconColor ?? "#2b7fff"}22 0%, ${project.iconColor ?? "#2b7fff"}44 100%)` }}><div className="absolute inset-0 flex items-center justify-center"><div className="text-6xl xl:text-8xl font-black opacity-10 text-foreground select-none">{project.title.charAt(0)}</div></div><div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.3) 1px, transparent 1px)", backgroundSize: "32px 32px" }} /></div>}
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const { data: settings } = useQuery<Record<string, any>>({ queryKey: ["/api/settings"] });
  const { data: featuredProjects = [], isLoading } = useQuery<Project[]>({ queryKey: ["/api/projects/featured"] });

  const name = settings?.designer_name ?? "Alex Morgan";
  const title = settings?.designer_title ?? "UX/UI Designer";
  const yearsExp = settings?.years_experience ?? 5;
  const projectsDone = settings?.projects_completed ?? 50;
  const happyClients = settings?.happy_clients ?? 20;
  const trustedCompanies: string[] = settings?.trusted_companies ?? ["TechCorp", "StartupXYZ", "DesignLab", "InnovateCo"];
  const whyWorkCards: any[] = settings?.why_work_with_me ?? [];
  const heroImage = settings?.avatarUrl || settings?.avatar_url || heroImagePath;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative min-h-screen bg-neutral-950 text-white overflow-hidden pt-16">
        <div className="absolute inset-0 hero-glow opacity-40 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "linear-gradient(135deg, #2b7fff, #ad46ff)" }} />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start">
            <div className="flex flex-col gap-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 w-fit">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-white/70">{title}</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
                I design<br />
                <span className="gradient-text">meaningful<br />digital</span><br />
                experiences
              </h1>
              <p className="text-lg text-white/60 max-w-lg leading-relaxed">Specializing in mobile apps, SaaS products, and design systems that drive business results through research-driven design.</p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/work" className="flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors" data-testid="hero-cta-work">View Case Studies<ArrowUpRight size={16} /></Link>
                <Link href="/contact" className="flex items-center gap-2 border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/5 transition-colors" data-testid="hero-cta-contact">Contact Me</Link>
              </div>
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
                <div><p className="text-3xl font-black text-white">{yearsExp}+</p><p className="text-sm text-white/50 mt-1">Years Experience</p></div>
                <div><p className="text-3xl font-black text-white">{projectsDone}+</p><p className="text-sm text-white/50 mt-1">Projects Completed</p></div>
                <div><p className="text-3xl font-black text-white">{happyClients}+</p><p className="text-sm text-white/50 mt-1">Happy Clients</p></div>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end animate-fade-in">
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 opacity-80" />
                <div className="relative overflow-hidden rounded-3xl border border-white/10 w-full max-w-md">
                  <img src={heroImage} alt={name} className="w-full h-auto object-cover object-top max-h-[520px]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3">
                  <p className="text-2xl font-black text-white">{yearsExp}+</p>
                  <p className="text-xs text-white/60">Years of Experience</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 flex justify-center"><div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/30 pt-2 animate-bounce"><ArrowDown size={12} className="text-white/50" /></div></div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
        <div className="mb-12"><h2 className="text-4xl lg:text-5xl font-black text-foreground">Featured Work</h2><p className="mt-3 text-lg text-muted-foreground">Real-world problems solved through thoughtful design and user research</p></div>
        <div className="flex flex-col gap-8">{isLoading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-80 rounded-3xl bg-muted animate-pulse" />) : featuredProjects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
      </section>
      <section className="bg-muted/30 border-y border-border py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-14"><h2 className="text-4xl lg:text-5xl font-black text-foreground">Why Work With Me</h2><p className="mt-3 text-lg text-muted-foreground max-w-lg mx-auto">I combine design thinking with business strategy to create products that users love and companies profit from</p></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{(whyWorkCards.length > 0 ? whyWorkCards : [{ title: "Research-driven design", description: "Every decision backed by user research, data analysis, and behavioral psychology.", icon: "search" }, { title: "Fast & scalable systems", description: "Building design systems that grow with your product and accelerate development.", icon: "zap" }, { title: "Business-focused UX", description: "Balancing user needs with business goals to drive measurable results.", icon: "trending-up" }]).map((card: any, i: number) => <div key={i} className="rounded-3xl border border-border bg-card p-8 hover:border-foreground/20 transition-colors"><div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-5"><span className="text-2xl">{i === 0 ? "🔍" : i === 1 ? "⚡" : "📈"}</span></div><h3 className="text-xl font-bold text-foreground mb-3">{card.title}</h3><p className="text-muted-foreground leading-relaxed">{card.description}</p></div>)}</div>
          <div className="mt-16 text-center"><p className="text-sm text-muted-foreground mb-6">Trusted by startups & teams</p><div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">{trustedCompanies.map((company: string) => <span key={company} className="text-xl lg:text-2xl font-black text-foreground/30 hover:text-foreground/60 transition-colors">{company}</span>)}</div></div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
