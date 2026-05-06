import { Link, useLocation } from "wouter";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useState } from "react";

const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/process", label: "Process" },
  { href: "/playground", label: "Playground" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/work") return location === "/" || location === "/work";
    return location.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity">
          AKIB AHAMED
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm font-medium transition-colors pb-0.5 ${
                isActive(link.href)
                  ? "text-foreground after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5 after:bg-foreground after:rounded-full"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`nav-link-${link.label.toLowerCase()}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground transition-colors"
            data-testid="theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-base font-medium transition-colors ${
                isActive(link.href) ? "text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
