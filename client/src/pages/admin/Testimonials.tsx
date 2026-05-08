import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import AdminLayout from "./Layout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Testimonial } from "@shared/schema";

interface FormData {
  name: string;
  company: string;
  role: string;
  content: string;
  avatarUrl: string;
  sortOrder: number;
}

const EMPTY: FormData = { name: "", company: "", role: "", content: "", avatarUrl: "", sortOrder: 0 };
const inp = "px-3 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 w-full";

export default function AdminTestimonials() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [uploading, setUploading] = useState(false);

  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({ queryKey: ["/api/admin/testimonials"] });

  const reset = () => { setForm(EMPTY); setEditId(null); };

  const createMut = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/testimonials", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] }); queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] }); setShowForm(false); reset(); toast({ title: "Testimonial created" }); },
    onError: () => toast({ title: "Error", variant: "destructive" }),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest("PATCH", `/api/admin/testimonials/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] }); queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] }); setShowForm(false); reset(); toast({ title: "Testimonial updated" }); },
    onError: () => toast({ title: "Error", variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/testimonials/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] }); queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] }); toast({ title: "Testimonial deleted" }); },
  });

  const handleEdit = (t: Testimonial) => {
    setEditId(t.id);
    setForm({ name: t.name, company: t.company ?? "", role: t.role ?? "", content: t.content, avatarUrl: t.avatarUrl ?? "", sortOrder: t.sortOrder ?? 0 });
    setShowForm(true);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      setForm((f) => ({ ...f, avatarUrl: data.url }));
      toast({ title: "Avatar uploaded" });
    } catch { toast({ title: "Upload failed", variant: "destructive" }); }
    finally { setUploading(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, sortOrder: Number(form.sortOrder), avatarUrl: form.avatarUrl || null };
    if (editId) updateMut.mutate({ id: editId, data: payload });
    else createMut.mutate(payload);
  };

  return (
    <AdminLayout title="Testimonials">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{testimonials.length} testimonial{testimonials.length !== 1 ? "s" : ""}</p>
        <button onClick={() => { setShowForm(true); reset(); }} className="flex items-center gap-2 bg-foreground text-background text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity" data-testid="add-testimonial">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-3xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">{editId ? "Edit Testimonial" : "Add Testimonial"}</h2>
              <button onClick={() => { setShowForm(false); reset(); }} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Name *</label>
                <input value={form.name} required onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inp} data-testid="testimonial-name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">Role / Title</label>
                  <input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} placeholder="Product Manager" className={inp} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">Company</label>
                  <input value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} placeholder="Acme Inc." className={inp} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Testimonial *</label>
                <textarea value={form.content} required rows={4} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} placeholder="Working with this designer was..." className={`${inp} resize-y min-h-[100px]`} data-testid="testimonial-content" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Avatar / Photo</label>
                <div className="flex items-center gap-3">
                  <input value={form.avatarUrl} onChange={(e) => setForm((f) => ({ ...f, avatarUrl: e.target.value }))} placeholder="https://... or upload" className={`${inp} flex-1`} />
                  <label className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-xl text-sm cursor-pointer hover:bg-muted/70 transition-colors whitespace-nowrap">
                    <Upload size={14} /> {uploading ? "Uploading..." : "Upload"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
                  </label>
                </div>
                {form.avatarUrl && <img src={form.avatarUrl} alt="avatar preview" className="mt-1 h-12 w-12 rounded-full object-cover border border-border" />}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Sort Order</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: +e.target.value }))} className="w-24 px-3 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button type="button" onClick={() => { setShowForm(false); reset(); }} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                <button type="submit" disabled={createMut.isPending || updateMut.isPending} className="px-5 py-2 bg-foreground text-background text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50" data-testid="submit-testimonial">
                  {createMut.isPending || updateMut.isPending ? "Saving..." : editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 bg-muted rounded-2xl animate-pulse" />)}</div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl">
          <p className="text-muted-foreground">No testimonials yet. Add your first one!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-card border border-border rounded-2xl p-5" data-testid={`testimonial-${t.id}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {t.avatarUrl ? (
                      <img src={t.avatarUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-border" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      {(t.role || t.company) && (
                        <span className="text-xs text-muted-foreground">{t.role}{t.company ? `, ${t.company}` : ""}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">"{t.content}"</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => handleEdit(t)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors" data-testid={`edit-testimonial-${t.id}`}><Pencil size={14} /></button>
                  <button onClick={() => { if (confirm("Delete this testimonial?")) deleteMut.mutate(t.id); }} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors" data-testid={`delete-testimonial-${t.id}`}><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
