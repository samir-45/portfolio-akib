import { Link } from "wouter";
import { Mail, Linkedin, Twitter, Dribbble } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/process", label: "Process" },
  { href: "/playground", label: "Playground" },
  { href: "/contact", label: "Contact" },
];

const resourceLinks = [
  { label: "Design Articles", href: "#" },
  { label: "Case Studies", href: "/work" },
  { label: "Testimonials", href: "/about" },
  { label: "Download CV", href: "#" },
];

export function Footer() {
  const { data: settings } = useQuery<Record<string, any>>({ queryKey: ["/api/settings"] });

  const name = settings?.designer_name ?? "Alex Morgan";
  const email = settings?.email ?? "alex@example.com";

  return (
    <footer className="border-t border-border bg-muted/30 mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-foreground">{name}</h2>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              UX/UI Designer crafting meaningful digital experiences through research-driven design and human-centered thinking.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href={`mailto:${email}`} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Email">
                <Mail size={18} />
              </a>
              <a href={`https://${settings?.linkedin ?? "#"}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href={`https://twitter.com/${settings?.twitter?.replace("@","") ?? "#"}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href={`https://${settings?.dribbble ?? "#"}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Dribbble">
                <Dribbble size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Navigation</h3>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Resources</h3>
            <ul className="flex flex-col gap-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 {name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
