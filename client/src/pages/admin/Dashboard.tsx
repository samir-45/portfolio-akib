import { useQuery } from "@tanstack/react-query";
import { FolderOpen, Gamepad2, MessageSquare, Eye } from "lucide-react";
import AdminLayout from "./Layout";
import { Link } from "wouter";
import type { Project, PlaygroundItem, ContactMessage } from "@shared/schema";

export default function AdminDashboard() {
  const { data: projects = [] } = useQuery<Project[]>({ queryKey: ["/api/admin/projects"] });
  const { data: playground = [] } = useQuery<PlaygroundItem[]>({ queryKey: ["/api/admin/playground"] });
  const { data: messages = [] } = useQuery<ContactMessage[]>({ queryKey: ["/api/admin/messages"] });

  const unreadMessages = messages.filter((m) => !m.isRead).length;

  const stats = [
    { label: "Projects", value: projects.length, icon: FolderOpen, href: "/admin/projects", color: "bg-blue-500/10 text-blue-600" },
    { label: "Playground Items", value: playground.length, icon: Gamepad2, href: "/admin/playground", color: "bg-purple-500/10 text-purple-600" },
    { label: "Messages", value: messages.length, href: "/admin/messages", icon: MessageSquare, color: "bg-orange-500/10 text-orange-600", badge: unreadMessages },
  ];

  const recentMessages = messages.slice(0, 5);

  return (
    <AdminLayout title="Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {stats.map(({ label, value, icon: Icon, href, color, badge }) => (
          <Link key={label} href={href} className="bg-card border border-border rounded-2xl p-6 hover:border-foreground/20 transition-colors block">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{label}</p>
                <p className="text-3xl font-black text-foreground">{value}</p>
              </div>
              <div className="relative">
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                  <Icon size={18} />
                </div>
                {badge != null && badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                    {badge}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent projects */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-foreground">Recent Projects</h2>
            <Link href="/admin/projects" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {projects.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${p.iconColor ?? "#2b7fff"}22` }}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.category}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${p.isFeatured ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                  {p.isFeatured ? "Featured" : "Hidden"}
                </span>
              </div>
            ))}
            {projects.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No projects yet</p>
            )}
          </div>
        </div>

        {/* Recent messages */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-foreground">Recent Messages</h2>
            <Link href="/admin/messages" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {recentMessages.map((m) => (
              <div key={m.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{m.name}</p>
                    {!m.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{m.message}</p>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No messages yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 bg-card border border-border rounded-2xl p-6">
        <h2 className="text-base font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/projects" className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl text-sm font-medium text-foreground hover:bg-muted/70 transition-colors">
            <FolderOpen size={14} />
            Add Project
          </Link>
          <Link href="/admin/playground" className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl text-sm font-medium text-foreground hover:bg-muted/70 transition-colors">
            <Gamepad2 size={14} />
            Add Playground Item
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl text-sm font-medium text-foreground hover:bg-muted/70 transition-colors">
            Edit Profile & Settings
          </Link>
          <a href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl text-sm font-medium text-foreground hover:bg-muted/70 transition-colors">
            <Eye size={14} />
            View Portfolio
          </a>
        </div>
      </div>
    </AdminLayout>
  );
}
