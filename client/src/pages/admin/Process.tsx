import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, PlusCircle, MinusCircle } from "lucide-react";
import AdminLayout from "./Layout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ProcessStep } from "@shared/schema";

interface FormData {
  stepNumber: number;
  title: string;
  description: string;
  keyActivities: string[];
  color: string;
  sortOrder: number;
}

const EMPTY: FormData = { stepNumber: 1, title: "", description: "", keyActivities: [""], color: "#2b7fff", sortOrder: 0 };
const inp = "px-3 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 w-full";

export default function AdminProcess() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);

  const { data: steps = [], isLoading } = useQuery<ProcessStep[]>({ queryKey: ["/api/admin/process"] });

  const reset = () => { setForm(EMPTY); setEditId(null); };

  const createMut = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/process", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/process"] }); queryClient.invalidateQueries({ queryKey: ["/api/process"] }); setShowForm(false); reset(); toast({ title: "Step created" }); },
    onError: () => toast({ title: "Error", variant: "destructive" }),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest("PATCH", `/api/admin/process/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/process"] }); queryClient.invalidateQueries({ queryKey: ["/api/process"] }); setShowForm(false); reset(); toast({ title: "Step updated" }); },
    onError: () => toast({ title: "Error", variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/process/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/process"] }); queryClient.invalidateQueries({ queryKey: ["/api/process"] }); toast({ title: "Step deleted" }); },
  });

  const handleEdit = (step: ProcessStep) => {
    setEditId(step.id);
    setForm({
      stepNumber: step.stepNumber,
      title: step.title,
      description: step.description,
      keyActivities: (step.keyActivities && step.keyActivities.length > 0) ? step.keyActivities : [""],
      color: step.color ?? "#2b7fff",
      sortOrder: step.sortOrder ?? 0,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, stepNumber: Number(form.stepNumber), sortOrder: Number(form.sortOrder), keyActivities: form.keyActivities.filter(Boolean) };
    if (editId) updateMut.mutate({ id: editId, data: payload });
    else createMut.mutate(payload);
  };

  const setActivity = (i: number, val: string) => setForm((f) => ({ ...f, keyActivities: f.keyActivities.map((a, idx) => idx === i ? val : a) }));
  const addActivity = () => setForm((f) => ({ ...f, keyActivities: [...f.keyActivities, ""] }));
  const removeActivity = (i: number) => setForm((f) => ({ ...f, keyActivities: f.keyActivities.filter((_, idx) => idx !== i) }));

  return (
    <AdminLayout title="Process Steps">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{steps.length} step{steps.length !== 1 ? "s" : ""}</p>
        <button onClick={() => { setShowForm(true); reset(); }} className="flex items-center gap-2 bg-foreground text-background text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity" data-testid="add-process-step">
          <Plus size={16} /> Add Step
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-3xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">{editId ? "Edit Step" : "Add Step"}</h2>
              <button onClick={() => { setShowForm(false); reset(); }} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">Step Number *</label>
                  <input type="number" min={1} value={form.stepNumber} required onChange={(e) => setForm((f) => ({ ...f, stepNumber: +e.target.value }))} className={inp} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: +e.target.value }))} className={inp} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Title *</label>
                <input value={form.title} required onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className={inp} data-testid="process-title" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Description *</label>
                <textarea value={form.description} required rows={3} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={`${inp} resize-y min-h-[80px]`} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Accent Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} className="h-8 w-16 rounded cursor-pointer border border-border" />
                  <span className="text-xs text-muted-foreground">{form.color}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Key Activities</label>
                <div className="flex flex-col gap-2">
                  {form.keyActivities.map((a, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input value={a} onChange={(e) => setActivity(i, e.target.value)} placeholder={`Activity ${i + 1}`} className={`${inp} flex-1`} />
                      <button type="button" onClick={() => removeActivity(i)} className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"><MinusCircle size={16} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={addActivity} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit">
                    <PlusCircle size={14} /> Add Activity
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button type="button" onClick={() => { setShowForm(false); reset(); }} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                <button type="submit" disabled={createMut.isPending || updateMut.isPending} className="px-5 py-2 bg-foreground text-background text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50" data-testid="submit-process-step">
                  {createMut.isPending || updateMut.isPending ? "Saving..." : editId ? "Update Step" : "Create Step"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 bg-muted rounded-2xl animate-pulse" />)}</div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">#</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Activities</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((step) => (
                <tr key={step.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white" style={{ backgroundColor: step.color ?? "#2b7fff" }}>
                      {String(step.stepNumber).padStart(2, "0")}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-medium text-foreground">{step.title}</td>
                  <td className="px-5 py-4 text-muted-foreground max-w-xs"><p className="truncate">{step.description}</p></td>
                  <td className="px-5 py-4 text-muted-foreground">{step.keyActivities?.length ?? 0} activities</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(step)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors" data-testid={`edit-process-${step.id}`}><Pencil size={14} /></button>
                      <button onClick={() => { if (confirm("Delete this step?")) deleteMut.mutate(step.id); }} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors" data-testid={`delete-process-${step.id}`}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {steps.length === 0 && <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">No steps yet. Add your first one!</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
