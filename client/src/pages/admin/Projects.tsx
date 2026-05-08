import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Star, StarOff, Upload, X, PlusCircle, MinusCircle } from "lucide-react";
import AdminLayout from "./Layout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@shared/schema";

interface ResultItem { label: string; value: string; }

interface ProjectFormData {
  title: string;
  slug: string;
  description: string;
  category: string;
  problemStatement: string;
  impact: string;
  iconColor: string;
  iconUrl: string;
  isFeatured: boolean;
  sortOrder: number;
  role: string;
  duration: string;
  team: string;
  theProblem: string;
  theSolution: string;
  tags: string;
  imageUrl: string;
  wireframesImageUrl: string;
  results: ResultItem[];
  keyLearnings: string[];
}

const EMPTY_FORM: ProjectFormData = {
  title: "", slug: "", description: "", category: "", problemStatement: "",
  impact: "", iconColor: "#2b7fff", iconUrl: "", isFeatured: false, sortOrder: 0,
  role: "", duration: "", team: "", theProblem: "", theSolution: "", tags: "",
  imageUrl: "", wireframesImageUrl: "",
  results: [{ label: "", value: "" }],
  keyLearnings: [""],
};

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const inp = "px-3 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 w-full";
const ta = `${inp} resize-y min-h-[80px]`;

export default function AdminProjects() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectFormData>(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [iconUploading, setIconUploading] = useState(false);
  const [wireframesUploading, setWireframesUploading] = useState(false);

  const { data: projects = [], isLoading } = useQuery<Project[]>({ queryKey: ["/api/admin/projects"] });

  const resetForm = () => { setForm(EMPTY_FORM); setEditId(null); };

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/projects", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] }); queryClient.invalidateQueries({ queryKey: ["/api/projects/featured"] }); setShowForm(false); resetForm(); toast({ title: "Project created" }); },
    onError: () => toast({ title: "Error creating project", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest("PATCH", `/api/admin/projects/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] }); queryClient.invalidateQueries({ queryKey: ["/api/projects/featured"] }); setShowForm(false); resetForm(); toast({ title: "Project updated" }); },
    onError: () => toast({ title: "Error updating project", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/projects/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] }); queryClient.invalidateQueries({ queryKey: ["/api/projects/featured"] }); toast({ title: "Project deleted" }); },
  });

  const handleEdit = (project: Project) => {
    setEditId(project.id);
    setForm({
      title: project.title,
      slug: project.slug,
      description: project.description,
      category: project.category,
      problemStatement: project.problemStatement ?? "",
      impact: project.impact ?? "",
      iconColor: project.iconColor ?? "#2b7fff",
      iconUrl: project.iconUrl ?? "",
      isFeatured: project.isFeatured ?? false,
      sortOrder: project.sortOrder ?? 0,
      role: project.role ?? "",
      duration: project.duration ?? "",
      team: project.team ?? "",
      theProblem: project.theProblem ?? "",
      theSolution: project.theSolution ?? "",
      tags: (project.tags ?? []).join(", "),
      imageUrl: project.imageUrl ?? "",
      wireframesImageUrl: project.wireframesImageUrl ?? "",
      results: (project.results && project.results.length > 0) ? project.results : [{ label: "", value: "" }],
      keyLearnings: (project.keyLearnings && project.keyLearnings.length > 0) ? project.keyLearnings : [""],
    });
    setShowForm(true);
  };

  const uploadFile = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    return (await res.json()).url as string;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try { setForm((f) => ({ ...f, imageUrl: "" })); const url = await uploadFile(file); setForm((f) => ({ ...f, imageUrl: url })); toast({ title: "Image uploaded" }); }
    catch { toast({ title: "Upload failed", variant: "destructive" }); }
    finally { setUploading(false); }
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setIconUploading(true);
    try { const url = await uploadFile(file); setForm((f) => ({ ...f, iconUrl: url, iconColor: "" })); toast({ title: "Icon uploaded" }); }
    catch { toast({ title: "Icon upload failed", variant: "destructive" }); }
    finally { setIconUploading(false); }
  };

  const handleWireframesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setWireframesUploading(true);
    try { const url = await uploadFile(file); setForm((f) => ({ ...f, wireframesImageUrl: url })); toast({ title: "Wireframes image uploaded" }); }
    catch { toast({ title: "Upload failed", variant: "destructive" }); }
    finally { setWireframesUploading(false); }
  };

  const setResult = (i: number, field: keyof ResultItem, value: string) =>
    setForm((f) => ({ ...f, results: f.results.map((r, idx) => idx === i ? { ...r, [field]: value } : r) }));

  const addResult = () => setForm((f) => ({ ...f, results: [...f.results, { label: "", value: "" }] }));
  const removeResult = (i: number) => setForm((f) => ({ ...f, results: f.results.filter((_, idx) => idx !== i) }));

  const setLearning = (i: number, value: string) =>
    setForm((f) => ({ ...f, keyLearnings: f.keyLearnings.map((l, idx) => idx === i ? value : l) }));

  const addLearning = () => setForm((f) => ({ ...f, keyLearnings: [...f.keyLearnings, ""] }));
  const removeLearning = (i: number) => setForm((f) => ({ ...f, keyLearnings: f.keyLearnings.filter((_, idx) => idx !== i) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      sortOrder: Number(form.sortOrder),
      imageUrl: form.imageUrl || null,
      wireframesImageUrl: form.wireframesImageUrl || null,
      iconUrl: form.iconUrl || null,
      iconColor: form.iconUrl ? null : form.iconColor,
      results: form.results.filter((r) => r.label || r.value),
      keyLearnings: form.keyLearnings.filter(Boolean),
    };
    if (editId) updateMutation.mutate({ id: editId, data: payload });
    else createMutation.mutate(payload);
  };

  const sectionLabel = "text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2 mb-1";

  return (
    <AdminLayout title="Projects">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        <button onClick={() => { setShowForm(true); resetForm(); }} className="flex items-center gap-2 bg-foreground text-background text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity" data-testid="add-project">
          <Plus size={16} /> Add Project
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-3xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">{editId ? "Edit Project" : "Add Project"}</h2>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="text-muted-foreground hover:text-foreground" data-testid="close-project-form"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">

              {/* ── Basic Info ── */}
              <p className={sectionLabel}>Basic Info</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">Title *</label>
                  <input value={form.title} required onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: editId ? f.slug : slugify(e.target.value) }))} className={inp} data-testid="project-title" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">Slug *</label>
                  <input value={form.slug} required onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className={inp} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Description *</label>
                <textarea value={form.description} required rows={2} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={ta} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">Category *</label>
                  <input value={form.category} required onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={inp} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">Impact (summary badge)</label>
                  <input value={form.impact} onChange={(e) => setForm((f) => ({ ...f, impact: e.target.value }))} placeholder="+45% engagement" className={inp} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Problem Statement</label>
                <input value={form.problemStatement} onChange={(e) => setForm((f) => ({ ...f, problemStatement: e.target.value }))} className={inp} />
              </div>

              {/* ── Case Study Details ── */}
              <p className={sectionLabel}>Case Study Details</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5"><label className="text-xs font-medium text-foreground">Role</label><input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className={inp} /></div>
                <div className="flex flex-col gap-1.5"><label className="text-xs font-medium text-foreground">Duration</label><input value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} className={inp} /></div>
                <div className="flex flex-col gap-1.5"><label className="text-xs font-medium text-foreground">Team</label><input value={form.team} onChange={(e) => setForm((f) => ({ ...f, team: e.target.value }))} className={inp} /></div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">The Problem</label>
                <textarea value={form.theProblem} rows={3} onChange={(e) => setForm((f) => ({ ...f, theProblem: e.target.value }))} className={ta} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">The Solution</label>
                <textarea value={form.theSolution} rows={3} onChange={(e) => setForm((f) => ({ ...f, theSolution: e.target.value }))} className={ta} />
              </div>

              {/* ── Impact & Results ── */}
              <p className={sectionLabel}>Impact & Results</p>
              <div className="flex flex-col gap-2">
                {form.results.map((r, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input value={r.value} onChange={(e) => setResult(i, "value", e.target.value)} placeholder="60% faster" className={`${inp} flex-1`} />
                    <input value={r.label} onChange={(e) => setResult(i, "label", e.target.value)} placeholder="Task Completion" className={`${inp} flex-1`} />
                    <button type="button" onClick={() => removeResult(i)} className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"><MinusCircle size={16} /></button>
                  </div>
                ))}
                <button type="button" onClick={addResult} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit">
                  <PlusCircle size={14} /> Add Result
                </button>
              </div>

              {/* ── Key Learnings ── */}
              <p className={sectionLabel}>Key Learnings</p>
              <div className="flex flex-col gap-2">
                {form.keyLearnings.map((l, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input value={l} onChange={(e) => setLearning(i, e.target.value)} placeholder={`Learning ${i + 1}`} className={`${inp} flex-1`} />
                    <button type="button" onClick={() => removeLearning(i)} className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"><MinusCircle size={16} /></button>
                  </div>
                ))}
                <button type="button" onClick={addLearning} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit">
                  <PlusCircle size={14} /> Add Learning
                </button>
              </div>

              {/* ── Tags ── */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Tags (comma separated)</label>
                <input value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="UX Research, Mobile App, Prototyping" className={inp} />
              </div>

              {/* ── Images ── */}
              <p className={sectionLabel}>Images</p>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Hero / Cover Image</label>
                <div className="flex items-center gap-3">
                  <input value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} placeholder="https://... or upload" className={`${inp} flex-1`} />
                  <label className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-xl text-sm cursor-pointer hover:bg-muted/70 transition-colors whitespace-nowrap">
                    <Upload size={14} /> {uploading ? "Uploading..." : "Upload"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                  </label>
                </div>
                {form.imageUrl && <img src={form.imageUrl} alt="preview" className="mt-2 h-24 w-auto rounded-xl object-cover" />}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Wireframes Image</label>
                <div className="flex items-center gap-3">
                  <input value={form.wireframesImageUrl} onChange={(e) => setForm((f) => ({ ...f, wireframesImageUrl: e.target.value }))} placeholder="https://... or upload" className={`${inp} flex-1`} />
                  <label className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-xl text-sm cursor-pointer hover:bg-muted/70 transition-colors whitespace-nowrap">
                    <Upload size={14} /> {wireframesUploading ? "Uploading..." : "Upload"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleWireframesUpload} disabled={wireframesUploading} />
                  </label>
                </div>
                {form.wireframesImageUrl && <img src={form.wireframesImageUrl} alt="wireframes preview" className="mt-2 h-24 w-auto rounded-xl object-cover" />}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Custom Icon</label>
                <div className="flex items-center gap-3">
                  <input value={form.iconUrl} onChange={(e) => setForm((f) => ({ ...f, iconUrl: e.target.value, iconColor: e.target.value ? "" : f.iconColor }))} placeholder="https://... or upload" className={`${inp} flex-1`} />
                  <label className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-xl text-sm cursor-pointer hover:bg-muted/70 transition-colors whitespace-nowrap">
                    <Upload size={14} /> {iconUploading ? "Uploading..." : "Upload"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleIconUpload} disabled={iconUploading} />
                  </label>
                </div>
                {form.iconUrl && (
                  <div className="mt-2 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-muted/30 p-2">
                    <img src={form.iconUrl} alt="icon preview" className="max-h-full max-w-full object-contain" />
                  </div>
                )}
              </div>

              {/* ── Options ── */}
              <p className={sectionLabel}>Options</p>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">Icon Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.iconColor || "#2b7fff"} disabled={!!form.iconUrl} onChange={(e) => setForm((f) => ({ ...f, iconColor: e.target.value }))} className="h-8 w-16 rounded cursor-pointer border border-border disabled:opacity-40" />
                    <span className="text-xs text-muted-foreground">{form.iconUrl ? "Custom icon active" : form.iconColor}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: +e.target.value }))} className="w-20 px-3 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none" />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <input type="checkbox" id="featured" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))} className="w-4 h-4 rounded" />
                  <label htmlFor="featured" className="text-sm text-foreground">Featured on homepage</label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-5 py-2 bg-foreground text-background text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity" data-testid="submit-project">
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : editId ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-muted rounded-2xl animate-pulse" />)}</div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Impact</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {p.iconUrl ? (
                        <div className="h-10 w-10 rounded-xl border border-border bg-muted/20 p-1.5 flex items-center justify-center overflow-hidden">
                          <img src={p.iconUrl} alt={`${p.title} icon`} className="h-full w-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold" style={{ backgroundColor: `${p.iconColor ?? "#2b7fff"}22`, color: p.iconColor ?? "#2b7fff" }}>
                          {p.title.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-foreground">{p.title}</p>
                        <p className="text-xs text-muted-foreground">/{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{p.category}</td>
                  <td className="px-5 py-4 font-semibold text-emerald-600">{p.impact}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${p.isFeatured ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                      {p.isFeatured ? "Featured" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => updateMutation.mutate({ id: p.id, data: { isFeatured: !p.isFeatured } })} className="p-1.5 text-muted-foreground hover:text-yellow-500 transition-colors" title={p.isFeatured ? "Unfeature" : "Feature"}>
                        {p.isFeatured ? <Star size={14} className="fill-current" /> : <StarOff size={14} />}
                      </button>
                      <button onClick={() => handleEdit(p)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors" data-testid={`edit-project-${p.id}`}><Pencil size={14} /></button>
                      <button onClick={() => { if (confirm("Delete this project?")) deleteMutation.mutate(p.id); }} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors" data-testid={`delete-project-${p.id}`}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">No projects yet. Add your first one!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
