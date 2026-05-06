import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  LayoutDashboard, FolderOpen, Gamepad2, MessageSquare, Settings,
  LogOut, ChevronRight, Palette, ArrowLeft
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/playground", label: "Playground", icon: Gamepad2 },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [location] = useLocation();

  const { data: user } = useQuery({ queryKey: ["/api/admin/me"] });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/logout"),
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/admin/login";
    },
  });

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <Palette size={16} className="text-background" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Portfolio</p>
              <p className="text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = location === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                data-testid={`admin-nav-${label.toLowerCase()}`}
              >
                <Icon size={16} />
                {label}
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-border flex flex-col gap-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft size={16} />
            View Portfolio
          </Link>
          <button
            onClick={() => logoutMutation.mutate()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors w-full text-left"
            data-testid="admin-logout"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-lg font-bold text-foreground">{title}</h1>
          <div className="text-sm text-muted-foreground">
            Welcome, <span className="font-semibold text-foreground">{(user as any)?.username ?? "admin"}</span>
          </div>
        </header>

        <div className="flex-1 p-8">{children}</div>
      </main>
    </div>
  );
}
