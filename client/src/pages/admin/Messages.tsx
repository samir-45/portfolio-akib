import { useQuery, useMutation } from "@tanstack/react-query";
import { Trash2, MailOpen, Mail } from "lucide-react";
import AdminLayout from "./Layout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ContactMessage } from "@shared/schema";

export default function AdminMessages() {
  const { toast } = useToast();
  const { data: messages = [], isLoading } = useQuery<ContactMessage[]>({ queryKey: ["/api/admin/messages"] });

  const markReadMut = useMutation({
    mutationFn: (id: string) => apiRequest("PATCH", `/api/admin/messages/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/messages/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] }); toast({ title: "Message deleted" }); },
  });

  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <AdminLayout title="Messages">
      <div className="flex items-center gap-3 mb-6">
        <p className="text-sm text-muted-foreground">{messages.length} total</p>
        {unread > 0 && (
          <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-600 rounded-full font-semibold">{unread} unread</span>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl">
          <Mail size={40} className="mx-auto text-muted-foreground mb-4 opacity-30" />
          <p className="text-muted-foreground">No messages yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`bg-card border rounded-2xl p-5 transition-colors ${!m.isRead ? "border-blue-500/30 bg-blue-500/5" : "border-border"}`}
              data-testid={`message-${m.id}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-foreground">{m.name}</p>
                      {!m.isRead && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                      <span className="text-xs text-muted-foreground">{m.email}</span>
                    </div>
                    <p className="text-sm text-foreground mt-2 leading-relaxed">{m.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {m.createdAt ? new Date(m.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!m.isRead && (
                    <button
                      onClick={() => markReadMut.mutate(m.id)}
                      className="p-2 text-muted-foreground hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950"
                      title="Mark as read"
                      data-testid={`mark-read-${m.id}`}
                    >
                      <MailOpen size={15} />
                    </button>
                  )}
                  <a
                    href={`mailto:${m.email}`}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
                    title="Reply"
                  >
                    <Mail size={15} />
                  </a>
                  <button
                    onClick={() => { if (confirm("Delete this message?")) deleteMut.mutate(m.id); }}
                    className="p-2 text-muted-foreground hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950"
                    title="Delete"
                    data-testid={`delete-message-${m.id}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
