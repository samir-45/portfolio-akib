import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Plus, Save, Trash2 } from "lucide-react";
import AdminLayout from "./Layout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ProcessStep, InsertProcessStep } from "@shared/schema";

type ProcessStepDraft = Partial<InsertProcessStep> & { id?: string };

const EMPTY_STEP: Partial<InsertProcessStep> = {
  stepNumber: 1,
  title: "",
  description: "",
  keyActivities: [],
  color: "#2b7fff",
  sortOrder: 0,
};

export default function AdminProcessPage() {
  const { toast } = useToast();
  const { data: steps = [], isLoading } = useQuery<ProcessStep[]>({ queryKey: ["/api/process"] });
  const [drafts, setDrafts] = useState<ProcessStepDraft[]>([]);

  useEffect(() => {
    setDrafts(steps.map((step) => ({ ...step, keyActivities: step.keyActivities ?? [] })));
  }, [steps]);

  const saveMutation = useMutation({
    mutationFn: async (payload: ProcessStepDraft[]) => {
      await Promise.all(
        payload.map((step) => {
          const body = {
            stepNumber: Number(step.stepNumber),
            title: String(step.title ?? ""),
            description: String(step.description ?? ""),
            keyActivities: Array.isArray(step.keyActivities)
              ? step.keyActivities.filter(Boolean).map((item) => String(item).trim()).filter(Boolean)
              : [],
            color: step.color || "#2b7fff",
            sortOrder: Number(step.sortOrder ?? 0),
          };
          return step.id
            ? apiRequest("PATCH", `/api/admin/process/${step.id}`, body)
            : apiRequest("POST", "/api/admin/process", body);
        })
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/process"] });
      toast({ title: "Process page saved" });
    },
    onError: () => toast({ title: "Error saving process page", variant: "destructive" }),
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/admin/process/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/process"] }),
  });

  const sortedDrafts = useMemo(() => [...drafts].sort((a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0)), [drafts]);

  const updateDraft = (index: number, key: keyof InsertProcessStep, value: string | number | string[]) => {
    setDrafts((current) => current.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  const addStep = () => setDrafts((current) => [...current, { ...EMPTY_STEP, stepNumber: current.length + 1, sortOrder: current.length + 1 }]);

  const deleteStep = (index: number) => {
    const item = drafts[index];
    if (item?.id) {
      removeMutation.mutate(String(item.id));
    }
    setDrafts((current) => current.filter((_, i) => i !== index));
  };

  return (
    <AdminLayout title="Process Page">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-foreground">Customize the full Process page</h2>
            <p className="text-sm text-muted-foreground">Edit the page copy and every individual step from one place.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={addStep} className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted" data-testid="button-add-process-step">
              <Plus size={16} /> Add Step
            </button>
            <button onClick={() => saveMutation.mutate(drafts)} disabled={saveMutation.isPending} className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50" data-testid="button-save-process-page">
              <Save size={16} /> {saveMutation.isPending ? "Saving..." : "Save All"}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="h-40 rounded-2xl bg-muted animate-pulse" />
        ) : (
          <div className="grid gap-4">
            {sortedDrafts.map((step, index) => {
              const actualIndex = drafts.findIndex((item) => item === step || item.id === step.id);
              const activities = Array.isArray(step.keyActivities) ? step.keyActivities.join("\n") : "";
              return (
                <div key={step.id ?? index} className="rounded-2xl border border-border bg-card p-5 grid gap-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">Step {index + 1}</p>
                    <button onClick={() => deleteStep(actualIndex)} className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950" data-testid={`button-delete-process-step-${step.id ?? index}`}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" value={String(step.stepNumber ?? "")} onChange={(e) => updateDraft(actualIndex, "stepNumber", Number(e.target.value))} placeholder="Step number" data-testid={`input-step-number-${step.id ?? index}`} />
                    <input className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" value={String(step.color ?? "")} onChange={(e) => updateDraft(actualIndex, "color", e.target.value)} placeholder="#2b7fff" data-testid={`input-step-color-${step.id ?? index}`} />
                    <input className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm md:col-span-2" value={String(step.title ?? "")} onChange={(e) => updateDraft(actualIndex, "title", e.target.value)} placeholder="Step title" data-testid={`input-step-title-${step.id ?? index}`} />
                    <textarea className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm md:col-span-2 min-h-28" value={String(step.description ?? "")} onChange={(e) => updateDraft(actualIndex, "description", e.target.value)} placeholder="Step description" data-testid={`textarea-step-description-${step.id ?? index}`} />
                    <textarea className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm md:col-span-2 min-h-28" value={activities} onChange={(e) => updateDraft(actualIndex, "keyActivities", e.target.value.split("\n").map((item) => item.trim()).filter(Boolean))} placeholder="One activity per line" data-testid={`textarea-step-activities-${step.id ?? index}`} />
                  </div>
                </div>
              );
            })}
            {sortedDrafts.length === 0 && <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No steps yet. Add one to start customizing the Process page.</div>}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
