import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { PlaygroundItem } from "@shared/schema";

const CATEGORIES = ["All", "UI Concept", "Micro-interaction", "Data Viz", "Tool"];
const CATEGORY_COLORS: Record<string, string> = {
  "UI Concept": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "Micro-interaction": "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "Data Viz": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "Tool": "bg-orange-500/10 text-orange-600 dark:text-orange-400",
};
const CATEGORY_GRADIENTS: Record<string, string> = {
  "UI Concept": "from-blue-500/20 to-blue-600/10",
  "Micro-interaction": "from-purple-500/20 to-purple-600/10",
  "Data Viz": "from-emerald-500/20 to-emerald-600/10",
  "Tool": "from-orange-500/20 to-orange-600/10",
};

function PlaygroundCard({ item }: { item: PlaygroundItem }) {
  return (
    <div
      className="group rounded-3xl border border-border bg-card overflow-hidden hover:border-foreground/20 transition-all hover:-translate-y-1"
      data-testid={`playground-card-${item.id}`}
    >
      <div className={`relative aspect-[4/3] bg-gradient-to-br ${CATEGORY_GRADIENTS[item.category] ?? "from-muted to-muted/50"} overflow-hidden`}>
        {item.imageUrl
          ? <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
          : <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-5xl font-black opacity-5 text-foreground select-none">{item.title.charAt(0)}</div>
            </div>
        }
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
            <ExternalLink size={12} className="text-background" />
          </div>
        </div>
        <div className="absolute top-3 left-3">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${CATEGORY_COLORS[item.category] ?? "bg-muted text-muted-foreground"}`}>
            {item.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-foreground">{item.title}</h3>
        {item.description && <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.description}</p>}
      </div>
    </div>
  );
}

export default function Playground() {
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: items = [], isLoading } = useQuery<PlaygroundItem[]>({ queryKey: ["/api/playground"] });
  const { data: pgSettings } = useQuery<Record<string, any>>({ queryKey: ["/api/playground/settings"] });
  const { data: siteSettings } = useQuery<Record<string, any>>({ queryKey: ["/api/settings"] });

  const filtered = activeCategory === "All" ? items : items.filter((i) => i.category === activeCategory);

  // Page text — from playground settings with fallbacks
  const badge = (pgSettings?.playground_badge as string) ?? "Experiments & Exploration";
  const pageTitle = (pgSettings?.playground_title as string) ?? "Design Playground";
  const pageSubtitle = (pgSettings?.playground_subtitle as string) ?? "A collection of experiments, daily UI challenges, and creative explorations. Not every idea makes it to production, but each one teaches something valuable.";
  const ctaTitle = (pgSettings?.playground_cta_title as string) ?? "Want to see more?";
  const ctaSubtitle = (pgSettings?.playground_cta_subtitle as string) ?? "Follow me on Dribbble and Behance for daily design inspiration";

  // Social links — prefer playground settings, fall back to global site settings
  const dribbbleUrl = (pgSettings?.playground_dribbble_url as string) || (siteSettings?.dribbble as string) || "#";
  const behanceUrl = (pgSettings?.playground_behance_url as string) || (siteSettings?.behance as string) || "#";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">

        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs bg-muted border border-border rounded-full px-3 py-1 text-muted-foreground">{badge}</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-foreground mb-4">{pageTitle}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">{pageSubtitle}</p>
        </section>

        {/* Filter tabs */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground border border-border"}`}
                data-testid={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-20">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="rounded-3xl bg-muted animate-pulse aspect-[4/3]" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No items in this category yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => <PlaygroundCard key={item.id} item={item} />)}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-20">
          <div className="rounded-3xl border border-border bg-muted/30 p-12 text-center">
            <h2 className="text-3xl font-black text-foreground mb-3">{ctaTitle}</h2>
            <p className="text-muted-foreground mb-8">{ctaSubtitle}</p>
            <div className="flex items-center justify-center gap-4">
              <a
                href={dribbbleUrl}
                target={dribbbleUrl !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="bg-foreground text-background font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
                data-testid="view-dribbble"
              >
                View on Dribbble
              </a>
              <a
                href={behanceUrl}
                target={behanceUrl !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="border border-border text-foreground font-semibold px-6 py-3 rounded-xl hover:bg-muted transition-colors"
                data-testid="view-behance"
              >
                View on Behance
              </a>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}
