import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Save, Upload } from "lucide-react";
import AdminLayout from "./Layout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SettingsForm {
  designer_name: string;
  designer_title: string;
  bio: string;
  bio_extended: string;
  bio_personal: string;
  years_experience: number;
  projects_completed: number;
  happy_clients: number;
  location: string;
  email: string;
  linkedin: string;
  twitter: string;
  dribbble: string;
  behance: string;
  cv_url: string;
  availability_status: string;
  availability_note: string;
  trusted_companies: string;
  skills: string;
}

const EMPTY: SettingsForm = {
  designer_name: "", designer_title: "", bio: "", bio_extended: "", bio_personal: "",
  years_experience: 5, projects_completed: 50, happy_clients: 20,
  location: "", email: "", linkedin: "", twitter: "", dribbble: "", behance: "",
  cv_url: "", availability_status: "", availability_note: "",
  trusted_companies: "", skills: "",
};

export default function AdminSettings() {
  const { toast } = useToast();
  const { data: settings } = useQuery<Record<string, any>>({ queryKey: ["/api/settings"] });
  const [form, setForm] = useState<SettingsForm>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (settings) {
      setForm({
        designer_name: settings.designer_name ?? "",
        designer_title: settings.designer_title ?? "",
        bio: settings.bio ?? "",
        bio_extended: settings.bio_extended ?? "",
        bio_personal: settings.bio_personal ?? "",
        years_experience: settings.years_experience ?? 5,
        projects_completed: settings.projects_completed ?? 50,
        happy_clients: settings.happy_clients ?? 20,
        location: settings.location ?? "",
        email: settings.email ?? "",
        linkedin: settings.linkedin ?? "",
        twitter: settings.twitter ?? "",
        dribbble: settings.dribbble ?? "",
        behance: settings.behance ?? "",
        cv_url: settings.cv_url ?? "",
        availability_status: settings.availability_status ?? "",
        availability_note: settings.availability_note ?? "",
        trusted_companies: Array.isArray(settings.trusted_companies) ? settings.trusted_companies.join(", ") : settings.trusted_companies ?? "",
        skills: Array.isArray(settings.skills) ? settings.skills.join(", ") : settings.skills ?? "",
      });
      setAvatarUrl(settings.avatarUrl ?? settings.avatar_url ?? "");
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data: SettingsForm) => {
      const entries: Record<string, any> = {
        designer_name: data.designer_name,
        designer_title: data.designer_title,
        bio: data.bio,
        bio_extended: data.bio_extended,
        bio_personal: data.bio_personal,
        years_experience: Number(data.years_experience),
        projects_completed: Number(data.projects_completed),
        happy_clients: Number(data.happy_clients),
        location: data.location,
        email: data.email,
        linkedin: data.linkedin,
        twitter: data.twitter,
        dribbble: data.dribbble,
        behance: data.behance,
        cv_url: data.cv_url,
        availability_status: data.availability_status,
        availability_note: data.availability_note,
        trusted_companies: data.trusted_companies.split(",").map((s) => s.trim()).filter(Boolean),
        skills: data.skills.split(",").map((s) => s.trim()).filter(Boolean),
      };
      await apiRequest("POST", "/api/admin/settings", { key: "site_profile", value: entries });
      if (avatarUrl) await apiRequest("POST", "/api/admin/settings", { key: "avatarUrl", value: avatarUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: "Settings saved!" });
    },
    onError: () => toast({ title: "Error saving settings", variant: "destructive" }),
  });

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      setAvatarUrl(data.url);
      await apiRequest("POST", "/api/admin/settings", { key: "avatarUrl", value: data.url });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: "Avatar uploaded" });
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const set = (key: keyof SettingsForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20";
  const textareaCls = `${inputCls} min-h-[96px] resize-y`;

  return (
    <AdminLayout title="Settings">
      <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="w-full max-w-none flex flex-col gap-8">
        <div className="w-full bg-card border border-border rounded-2xl p-6">
          <h2 className="text-base font-bold text-foreground mb-5">Profile</h2>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-xs font-medium text-foreground">Profile Photo</label>
              <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center">
                {avatarUrl && <img src={avatarUrl} alt="avatar" className="h-20 w-20 rounded-full object-cover border border-border" />}
                <label className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 bg-muted border border-border rounded-xl text-sm cursor-pointer hover:bg-muted/70">
                  <Upload size={14} /> {uploading ? "Uploading..." : "Upload Photo"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleUploadAvatar} disabled={uploading} />
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-medium text-foreground">Name</label>
                <input value={form.designer_name} onChange={set("designer_name")} className={inputCls} data-testid="setting-name" />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-medium text-foreground">Title</label>
                <input value={form.designer_title} onChange={set("designer_title")} className={inputCls} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-medium text-foreground">Bio</label>
              <textarea value={form.bio} onChange={set("bio")} rows={4} className={textareaCls} data-testid="setting-bio" />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-medium text-foreground">Bio Extended</label>
              <textarea value={form.bio_extended} onChange={set("bio_extended")} rows={4} className={textareaCls} />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-medium text-foreground">Personal Note</label>
              <textarea value={form.bio_personal} onChange={set("bio_personal")} rows={3} className={textareaCls} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              {(["years_experience", "projects_completed", "happy_clients"] as const).map((key) => (
                <div key={key} className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-medium text-foreground capitalize">{key.replace(/_/g, " ")}</label>
                  <input type="number" value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: +e.target.value }))} className={inputCls} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={saveMutation.isPending}
          className="flex items-center gap-2 bg-foreground text-background font-semibold px-6 py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity w-fit"
          data-testid="save-settings"
        >
          <Save size={16} />
          {saveMutation.isPending ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </AdminLayout>
  );
}
