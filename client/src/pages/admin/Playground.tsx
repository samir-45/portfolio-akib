import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Upload, X, Settings2, Save } from "lucide-react";
import AdminLayout from "./Layout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PlaygroundItem } from "@shared/schema";

const CATEGORIES = ["UI Concept", "Micro-interaction", "Data Viz", "Tool"];

interface FormData { title: string; category: string; description: string; imageUrl: string; link: string; sortOrder: number; }
const EMPTY: FormData = { title: "", category: "UI Concept", description: "", imageUrl: "", link: "", sortOrder: 0 };

interface PageSettings {
  playground_badge: string;
  playground_title: string;
  playground_subtitle: string;
  playground_cta_title: string;
  playground_cta_subtitle: string;
  playground_dribbble_url: string;
  playground_behance_url: string;
}
const DEFAULT_SETTINGS: PageSettings = {
  playground_badge: "Experiments & Exploration",
  playground_title: "Design Playground",
  playground_subtitle: "A collection of experiments, daily UI challenges, and creative explorations. Not every idea makes it to production, but each one teaches something valuable.",
  playground_cta_title: "Want to see more?",
  playground_cta_subtitle: "Follow me on Dribbble and Behance for daily design inspiration",
  playground_dribbble_url: "",
  playground_behance_url: "",
};

export default function AdminPlayground() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"items" | "settings">("items");
  const [pageSettings, setPageSettings] = useState<PageSettings>(DEFAULT_SETTINGS);
  const [settingsSaving, setSettingsSaving] = useState(false);

  const { data: items = [], isLoading } = useQuery<PlaygroundItem[]>({ queryKey: ["/api/admin/playground"] });
  const { data: rawSettings } = useQuery<Record<string, any>>({ queryKey: ["/api/admin/playground/settings"] });
  const { data: siteSettings } = useQuery<Record<string, any>>({ queryKey: ["/api/settings"] });

  useEffect(() => {
    if (rawSettings) {
      setPageSettings((prev) => ({
        ...prev,
        playground_badge: (rawSettings.playground_badge as string) ?? prev.playground_badge,
        playground_title: (rawSettings.playground_title as string) ?? prev.playground_title,
        playground_subtitle: (rawSettings.playground_subtitle as string) ?? prev.playground_subtitle,
        playground_cta_title: (rawSettings.playground_cta_title as string) ?? prev.playground_cta_title,
        playground_cta_subtitle: (rawSettings.playground_cta_subtitle as string) ?? prev.playground_cta_subtitle,
        playground_dribbble_url: (rawSettings.playground_dribbble_url as string) ?? (siteSettings?.dribbble as string) ?? "",
        playground_behance_url: (rawSettings.playground_behance_url as string) ?? (siteSettings?.behance as string) ?? "",
      }));
    } else if (siteSettings) {
      setPageSettings((prev) => ({
        ...prev,
        playground_dribbble_url: prev.playground_dribbble_url || (siteSettings.dribbble as string) || "",
        playground_behance_url: prev.playground_behance_url || (siteSettings.behance as string) || "",
      }));
    }
  }, [rawSettings, siteSettings]);

  const saveSettings = async () => {
    setSettingsSaving(true);
    try {
      await Promise.all(
        Object.entries(pageSettings).map(([key, value]) =>
          apiRequest("POST", "/api/admin/playground/settings", { key, value })
        )
      );
      queryClient.invalidateQueries({ queryKey: ["/api/admin/playground/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/playground/settings"] });
      toast({ title: "Page settings saved" });
    } catch {
      toast({ title: "Failed to save settings", variant: "destructive" });
    } finally {
      setSettingsSaving(false);
    }
  };

  const createMut = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/playground", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/playground"] }); queryClient.invalidateQueries({ queryKey: ["/api/playground"] }); setShowForm(false); setForm(EMPTY); toast({ title: "Item created" }); },
    onError: () => toast({ title: "Error", variant: "destructive" }),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest("PATCH", `/api/admin/playground/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/playground"] }); queryClient.invalidateQueries({ queryKey: ["/api/playground"] }); setShowForm(false); setEditId(null); setForm(EMPTY); toast({ title: "Item updated" }); },
    onError: () => toast({ title: "Error", variant: "destructive" }),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/playground/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/playground"] }); queryClient.invalidateQueries({ queryKey: ["/api/playground"] }); toast({ title: "Item deleted" }); },
  });

  const handleEdit = (item: PlaygroundItem) => {
    setEditId(item.id);
    setForm({
      title: item.title,
      category: item.category,
      description: item.description ?? "",
      imageUrl: item.imageUrl ?? "",
      link: item.link ?? "",
      sortOrder: item.sortOrder ?? 0,
    });
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
    const payload = {
      ...form,
      sortOrder: Number(form.sortOrder),
      imageUrl: form.imageUrl || null,
      link: form.link || null,
    };
    if (editId) updateMut.mutate({ id: editId, data: payload });
    else createMut.mutate(payload);
  };

  const CATEGORY_COLORS: Record<string, string> = {
    "UI Concept": "bg-blue-500/10 text-blue-600",
    "Micro-interaction": "bg-purple-500/10 text-purple-600",
    "Data Viz": "bg-emerald-500/10 text-emerald-600",
    "Tool": "bg-orange-500/10 text-orange-600",
  };

  const inp = "px-3 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 w-full";

  return (
    <AdminLayout title="Playground">
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-muted/50 p-1 rounded-xl w-fit border border-border">
        <button
          onClick={() => setActiveTab("items")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "items" ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`}
          data-testid="tab-items"
        >
          Items ({items.length})
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "settings" ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`}
          data-testid="tab-settings"
        >
          <Settings2 size={14} /> Page Settings
        </button>
      </div>

      {/* ── Items Tab ── */}
      {activeTab === "items" && (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">{items.length} item{items.length !== 1 ? "s" : ""}</p>
            <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY); }}
              className="flex items-center gap-2 bg-foreground text-background text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity" data-testid="add-playground-item">
              <Plus size={16} /> Add Item
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-40 bg-muted rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item.id} className="bg-card border border-border rounded-2xl overflow-hidden group">
                  <div className="aspect-video bg-muted relative">
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      : <div className="absolute inset-0 flex items-center justify-center"><span className="text-3xl font-black text-muted-foreground/20">{item.title.charAt(0)}</span></div>
                    }
                    <span className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category] ?? "bg-muted text-muted-foreground"}`}>{item.category}</span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        {item.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>}
                        <p className="text-xs text-muted-foreground/60 mt-1">Sort: {item.sortOrder ?? 0}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => handleEdit(item)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors" data-testid={`edit-playground-${item.id}`}><Pencil size={13} /></button>
                        <button onClick={() => { if (confirm("Delete this item?")) deleteMut.mutate(item.id); }} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="col-span-3 text-center py-12 text-muted-foreground">No items yet. Add your first playground item.</div>
              )}
            </div>
          )}
        </>
      )}

      {/* ── Page Settings Tab ── */}
      {activeTab === "settings" && (
        <div className="max-w-2xl flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-5">
            <h3 className="text-sm font-semibold text-foreground">Hero Section</h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Badge Text</label>
              <input value={pageSettings.playground_badge} onChange={(e) => setPageSettings((s) => ({ ...s, playground_badge: e.target.value }))} className={inp} data-testid="setting-badge" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Page Title</label>
              <input value={pageSettings.playground_title} onChange={(e) => setPageSettings((s) => ({ ...s, playground_title: e.target.value }))} className={inp} data-testid="setting-title" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Page Subtitle</label>
              <textarea value={pageSettings.playground_subtitle} rows={3} onChange={(e) => setPageSettings((s) => ({ ...s, playground_subtitle: e.target.value }))} className={`${inp} resize-none`} data-testid="setting-subtitle" />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-5">
            <h3 className="text-sm font-semibold text-foreground">"Want to see more?" Section</h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Section Title</label>
              <input value={pageSettings.playground_cta_title} onChange={(e) => setPageSettings((s) => ({ ...s, playground_cta_title: e.target.value }))} className={inp} data-testid="setting-cta-title" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Section Subtitle</label>
              <input value={pageSettings.playground_cta_subtitle} onChange={(e) => setPageSettings((s) => ({ ...s, playground_cta_subtitle: e.target.value }))} className={inp} data-testid="setting-cta-subtitle" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Dribbble URL</label>
              <input value={pageSettings.playground_dribbble_url} onChange={(e) => setPageSettings((s) => ({ ...s, playground_dribbble_url: e.target.value }))} className={inp} placeholder="https://dribbble.com/yourname" data-testid="setting-dribbble" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Behance URL</label>
              <input value={pageSettings.playground_behance_url} onChange={(e) => setPageSettings((s) => ({ ...s, playground_behance_url: e.target.value }))} className={inp} placeholder="https://behance.net/yourname" data-testid="setting-behance" />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={saveSettings}
              disabled={settingsSaving}
              className="flex items-center gap-2 bg-foreground text-background text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
              data-testid="save-playground-settings"
            >
              <Save size={15} />
              {settingsSaving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      )}

      {/* ── Item Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">{editId ? "Edit Item" : "Add Item"}</h2>
              <button onClick={() => { setShowForm(false); setEditId(null); }}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Title *</label>
                <input value={form.title} required onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className={inp} data-testid="playground-title" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Category *</label>
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className={inp}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Description</label>
                <textarea value={form.description} rows={2} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className={`${inp} resize-none`} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">External Link <span className="text-muted-foreground font-normal">(optional — opens when card is clicked)</span></label>
                <input value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                  placeholder="https://dribbble.com/shots/..." className={inp} data-testid="playground-link" />
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
    </AdminLayout>
  );
}
