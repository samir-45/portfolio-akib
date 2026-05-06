import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import AdminLayout from "./Layout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PlaygroundItem } from "@shared/schema";

const CATEGORIES = ["UI Concept", "Micro-interaction", "Data Viz", "Tool"];

interface FormData { title: string; category: string; description: string; imageUrl: string; sortOrder: number; }
const EMPTY: FormData = { title: "", category: "UI Concept", description: "", imageUrl: "", sortOrder: 0 };

export default function AdminPlayground() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [uploading, setUploading] = useState(false);

  const { data: items = [], isLoading } = useQuery<PlaygroundItem[]>({ queryKey: ["/api/admin/playground"] });

  const createMut = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/playground", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/playground"] }); setShowForm(false); setForm(EMPTY); toast({ title: "Item created" }); },
    onError: () => toast({ title: "Error", variant: "destructive" }),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest("PATCH", `/api/admin/playground/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/playground"] }); setShowForm(false); setEditId(null); setForm(EMPTY); toast({ title: "Item updated" }); },
    onError: () => toast({ title: "Error", variant: "destructive" }),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/playground/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/playground"] }); toast({ title: "Item deleted" }); },
  });

  const handleEdit = (item: PlaygroundItem) => {
    setEditId(item.id);
    setForm({ title: item.title, category: item.category, description: item.description ?? "", imageUrl: item.imageUrl ?? "", sortOrder: item.sortOrder ?? 0 });
    setShowForm(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      setForm((f) => ({ ...f, imageUrl: data.url }));
      toast({ title: "Image uploaded" });
    } catch { toast({ title: "Upload failed", variant: "destructive" }); }
    finally { setUploading(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, sortOrder: Number(form.sortOrder), imageUrl: form.imageUrl || null };
    if (editId) updateMut.mutate({ id: editId, data: payload });
    else createMut.mutate(payload);
  };

  const CATEGORY_COLORS: Record<string, string> = {
    "UI Concept": "bg-blue-500/10 text-blue-600",
    "Micro-interaction": "bg-purple-500/10 text-purple-600",
    "Data Viz": "bg-emerald-500/10 text-emerald-600",
    "Tool": "bg-orange-500/10 text-orange-600",
  };

  return (
    <AdminLayout title="Playground">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{items.length} item{items.length !== 1 ? "s" : ""}</p>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY); }}
          className="flex items-center gap-2 bg-foreground text-background text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity" data-testid="add-playground-item">
          <Plus size={16} /> Add Item
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">{editId ? "Edit Item" : "Add Item"}</h2>
              <button onClick={() => { setShowForm(false); setEditId(null); }}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Title *</label>
                <input value={form.title} required onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="px-3 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" data-testid="playground-title" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Category *</label>
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="px-3 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Description</label>
                <textarea value={form.description} rows={2} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="px-3 py-2 bg-background border border-border rounded-xl text-sm text-foreground resize-none focus:outline-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Image</label>
                <div className="flex items-center gap-2">
                  <input value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                    placeholder="URL or upload"
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none" />
                  <label className="flex items-center gap-1 px-3 py-2 bg-muted border border-border rounded-xl text-xs cursor-pointer hover:bg-muted/70">
                    <Upload size={12} /> {uploading ? "..." : "Upload"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                  </label>
                </div>
                {form.imageUrl && <img src={form.imageUrl} alt="" className="mt-1 h-20 rounded-lg object-cover" />}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Sort Order</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: +e.target.value }))}
                  className="w-20 px-3 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                <button type="submit" disabled={createMut.isPending || updateMut.isPending}
                  className="px-5 py-2 bg-foreground text-background text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50" data-testid="submit-playground">
                  {createMut.isPending || updateMut.isPending ? "Saving..." : editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-40 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-2xl overflow-hidden group">
              <div className="aspect-video bg-muted relative">
                {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />}
                <span className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category] ?? "bg-muted text-muted-foreground"}`}>{item.category}</span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    {item.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => handleEdit(item)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors" data-testid={`edit-playground-${item.id}`}><Pencil size={13} /></button>
                    <button onClick={() => { if (confirm("Delete?")) deleteMut.mutate(item.id); }} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-3 text-center py-12 text-muted-foreground">No items yet.</div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
