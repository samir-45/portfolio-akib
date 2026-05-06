import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { Testimonial } from "@shared/schema";
import heroImagePath from "@assets/UI_Designer_Portfolio_Website_1778060655592.png";

const TOOL_ICONS: Record<string, string> = {
  figma: "🎨",
  adobexd: "🖌️",
  sketch: "💎",
  framer: "⚡",
  notion: "📝",
  miro: "🗂️",
};

const BEYOND_ICONS: Record<string, string> = {
  users: "👥",
  coffee: "☕",
  music: "🎵",
  camera: "📷",
  book: "📚",
};

export default function About() {
  const { data: settings } = useQuery<Record<string, any>>({ queryKey: ["/api/settings"] });
  const { data: testimonials = [] } = useQuery<Testimonial[]>({ queryKey: ["/api/testimonials"] });

  const name = settings?.designer_name ?? "Alex Morgan";
  const bio = settings?.bio ?? "";
  const bioExtended = settings?.bio_extended ?? "";
  const bioPersonal = settings?.bio_personal ?? "";
  const yearsExp = settings?.years_experience ?? 5;
  const cvUrl = settings?.cv_url ?? "#";
  const skills: string[] = settings?.skills ?? [];
  const tools: any[] = settings?.tools ?? [];
  const beyondDesign: any[] = settings?.beyond_design ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Hero Bio */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Portrait */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-border bg-muted aspect-[4/5] max-w-md">
                <img
                  src={heroImagePath}
                  alt={name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute bottom-6 right-6 lg:-right-6 bg-card border border-border rounded-2xl px-5 py-4 shadow-lg">
                <p className="text-3xl font-black text-foreground">{yearsExp}+</p>
                <p className="text-sm text-muted-foreground">Years of Experience</p>
              </div>
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-6 pt-4">
              <div className="inline-flex items-center gap-2 bg-muted border border-border rounded-full px-4 py-2 w-fit">
                <span className="text-sm text-muted-foreground">About Me</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-foreground">Hi, I'm {name}</h1>
              <div className="flex flex-col gap-4 text-muted-foreground leading-relaxed">
                {bio && <p>{bio}</p>}
                {bioExtended && <p>{bioExtended}</p>}
                {bioPersonal && <p>{bioPersonal}</p>}
              </div>
              <a
                href={cvUrl}
                className="inline-flex items-center gap-2 bg-foreground text-background font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity w-fit"
                data-testid="download-cv"
              >
                <Download size={16} />
                Download CV
              </a>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="border-t border-border bg-muted/30 py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-foreground">Skills & Expertise</h2>
              <p className="mt-2 text-muted-foreground">A diverse toolkit for solving complex design challenges</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {(skills.length > 0 ? skills : [
                "User Research", "Wireframing", "Prototyping", "UI Design",
                "Design Systems", "Usability Testing", "Information Architecture", "Interaction Design"
              ]).map((skill: string) => (
                <span
                  key={skill}
                  className="px-4 py-2 bg-card border border-border rounded-full text-sm text-foreground hover:border-foreground/30 transition-colors"
                  data-testid={`skill-${skill.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Tools */}
        <section className="border-t border-border py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-foreground">Tools I Use</h2>
              <p className="mt-2 text-muted-foreground">Mastering the right tools to bring ideas to life</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(tools.length > 0 ? tools : [
                { name: "Figma", icon: "figma" },
                { name: "Adobe XD", icon: "adobexd" },
                { name: "Sketch", icon: "sketch" },
                { name: "Framer", icon: "framer" },
              ]).map((tool: any) => (
                <div
                  key={tool.name}
                  className="flex items-center gap-3 p-4 bg-card border border-border rounded-2xl hover:border-foreground/20 transition-colors"
                  data-testid={`tool-${tool.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <span className="text-2xl">{TOOL_ICONS[tool.icon] ?? "🔧"}</span>
                  <span className="text-sm font-medium text-foreground">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Beyond Design */}
        {(beyondDesign.length > 0 || true) && (
          <section className="border-t border-border bg-muted/30 py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mb-10">
                <h2 className="text-3xl font-black text-foreground">Beyond Design</h2>
                <p className="mt-2 text-muted-foreground">What I do when I'm not designing</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(beyondDesign.length > 0 ? beyondDesign : [
                  { title: "Design Communities", icon: "users" },
                  { title: "Coffee Brewing", icon: "coffee" },
                  { title: "Music Production", icon: "music" },
                ]).map((item: any) => (
                  <div
                    key={item.title}
                    className="flex flex-col items-center gap-3 p-8 bg-card border border-border rounded-3xl hover:border-foreground/20 transition-colors text-center"
                  >
                    <span className="text-4xl">{BEYOND_ICONS[item.icon] ?? "✨"}</span>
                    <span className="text-sm font-semibold text-foreground">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className="border-t border-border py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mb-10">
                <h2 className="text-3xl font-black text-foreground">What People Say</h2>
                <p className="mt-2 text-muted-foreground">Feedback from clients and collaborators</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((t) => (
                  <div key={t.id} className="p-8 bg-card border border-border rounded-3xl">
                    <p className="text-foreground leading-relaxed mb-6">"{t.content}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}{t.company ? `, ${t.company}` : ""}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
