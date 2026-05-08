import { useState, useEffect, type ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Save, Upload } from "lucide-react";
import AdminLayout from "./Layout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface WhyCard { title: string; description: string; emoji: string; }

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
  hero_heading_prefix: string;
  hero_heading_gradient: string;
  hero_heading_suffix: string;
  hero_tagline: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  hero_stat1_label: string;
  hero_stat2_label: string;
  hero_stat3_label: string;
  why_work_title: string;
  why_work_subtitle: string;
}

const EMPTY: SettingsForm = {
  designer_name: "", designer_title: "", bio: "", bio_extended: "", bio_personal: "",
  years_experience: 5, projects_completed: 50, happy_clients: 20,
  location: "", email: "", linkedin: "", twitter: "", dribbble: "", behance: "",
  cv_url: "", availability_status: "", availability_note: "",
  trusted_companies: "", skills: "",
  hero_heading_prefix: "I design",
  hero_heading_gradient: "meaningful\ndigital",
  hero_heading_suffix: "experiences",
  hero_tagline: "Specializing in mobile apps, SaaS products, and design systems that drive business results through research-driven design.",
  hero_cta_primary: "View Case Studies",
  hero_cta_secondary: "Contact Me",
  hero_stat1_label: "Years Experience",
  hero_stat2_label: "Projects Completed",
  hero_stat3_label: "Happy Clients",
  why_work_title: "Why Work With Me",
  why_work_subtitle: "I combine design thinking with business strategy to create products that users love and companies profit from",
};

const DEFAULT_WHY_CARDS: WhyCard[] = [
  { title: "Research-driven design", description: "Every decision backed by user research, data analysis, and behavioral psychology.", emoji: "🔍" },
  { title: "Fast & scalable systems", description: "Building design systems that grow with your product and accelerate development.", emoji: "⚡" },
  { title: "Business-focused UX", description: "Balancing user needs with business goals to drive measurable results.", emoji: "📈" },
];

function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="w-full bg-card border border-border rounded-2xl p-6">
      <h2 className="text-base font-bold text-foreground mb-5">{title}</h2>
      <div className="flex flex-col gap-4 w-full">{children}</div>
    </div>
  );
}

function SettingsField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

export default function AdminSettings() {
  const { toast } = useToast();
  const { data: settings } = useQuery<Record<string, any>>({ queryKey: ["/api/settings"] });
  const [form, setForm] = useState<SettingsForm>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [whyCards, setWhyCards] = useState<WhyCard[]>(DEFAULT_WHY_CARDS);

  useEffect(() => {
    if (!settings) return;
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
      hero_heading_prefix: settings.hero_heading_prefix ?? "I design",
      hero_heading_gradient: settings.hero_heading_gradient ?? "meaningful\ndigital",
      hero_heading_suffix: settings.hero_heading_suffix ?? "experiences",
      hero_tagline: settings.hero_tagline ?? "Specializing in mobile apps, SaaS products, and design systems that drive business results through research-driven design.",
      hero_cta_primary: settings.hero_cta_primary ?? "View Case Studies",
      hero_cta_secondary: settings.hero_cta_secondary ?? "Contact Me",
      hero_stat1_label: settings.hero_stat1_label ?? "Years Experience",
      hero_stat2_label: settings.hero_stat2_label ?? "Projects Completed",
      hero_stat3_label: settings.hero_stat3_label ?? "Happy Clients",
      why_work_title: settings.why_work_title ?? "Why Work With Me",
      why_work_subtitle: settings.why_work_subtitle ?? "I combine design thinking with business strategy to create products that users love and companies profit from",
    });
    setAvatarUrl(settings.avatarUrl ?? settings.avatar_url ?? "");
    if (Array.isArray(settings.why_work_with_me) && settings.why_work_with_me.length > 0) {
      setWhyCards(
        settings.why_work_with_me.map((c: any, i: number) => ({
          title: c.title ?? "",
          description: c.description ?? "",
          emoji: c.emoji ?? DEFAULT_WHY_CARDS[i]?.emoji ?? "⭐",
        }))
      );
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data: SettingsForm) => {
      const saves: [string, any][] = [
        ["designer_name", data.designer_name],
        ["designer_title", data.designer_title],
        ["bio", data.bio],
        ["bio_extended", data.bio_extended],
        ["bio_personal", data.bio_personal],
        ["years_experience", Number(data.years_experience)],
        ["projects_completed", Number(data.projects_completed)],
        ["happy_clients", Number(data.happy_clients)],
        ["location", data.location],
        ["email", data.email],
        ["linkedin", data.linkedin],
        ["twitter", data.twitter],
        ["dribbble", data.dribbble],
        ["behance", data.behance],
        ["cv_url", data.cv_url],
        ["availability_status", data.availability_status],
        ["availability_note", data.availability_note],
        ["trusted_companies", data.trusted_companies.split(",").map((s) => s.trim()).filter(Boolean)],
        ["skills", data.skills.split(",").map((s) => s.trim()).filter(Boolean)],
        ["hero_heading_prefix", data.hero_heading_prefix],
        ["hero_heading_gradient", data.hero_heading_gradient],
        ["hero_heading_suffix", data.hero_heading_suffix],
        ["hero_tagline", data.hero_tagline],
        ["hero_cta_primary", data.hero_cta_primary],
        ["hero_cta_secondary", data.hero_cta_secondary],
        ["hero_stat1_label", data.hero_stat1_label],
        ["hero_stat2_label", data.hero_stat2_label],
        ["hero_stat3_label", data.hero_stat3_label],
        ["why_work_title", data.why_work_title],
        ["why_work_subtitle", data.why_work_subtitle],
        ["why_work_with_me", whyCards],
      ];
      if (avatarUrl) saves.push(["avatarUrl", avatarUrl]);
      await Promise.all(saves.map(([key, value]) => apiRequest("POST", "/api/admin/settings", { key, value })));
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

  const setCard = (i: number, field: keyof WhyCard) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setWhyCards((cards) => cards.map((c, idx) => idx === i ? { ...c, [field]: e.target.value } : c));

  const inp = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20";
  const ta = `${inp} resize-y min-h-[80px]`;

  return (
    <AdminLayout title="Settings">
      <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="w-full flex flex-col gap-8">
        <SettingsSection title="Profile">
          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs font-medium text-muted-foreground">Profile Photo</label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {avatarUrl && <img src={avatarUrl} alt="avatar" className="h-20 w-20 rounded-full object-cover border border-border" />}
              <label className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 bg-muted border border-border rounded-xl text-sm cursor-pointer hover:bg-muted/70">
                <Upload size={14} /> {uploading ? "Uploading..." : "Upload Photo"}
                <input type="file" accept="image/*" className="hidden" onChange={handleUploadAvatar} disabled={uploading} />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingsField label="Name"><input value={form.designer_name} onChange={set("designer_name")} className={inp} data-testid="setting-name" /></SettingsField>
            <SettingsField label="Title / Badge"><input value={form.designer_title} onChange={set("designer_title")} className={inp} /></SettingsField>
          </div>
          <SettingsField label="Bio"><textarea value={form.bio} onChange={set("bio")} rows={4} className={ta} data-testid="setting-bio" /></SettingsField>
          <SettingsField label="Bio Extended"><textarea value={form.bio_extended} onChange={set("bio_extended")} rows={4} className={ta} /></SettingsField>
          <SettingsField label="Personal Note"><textarea value={form.bio_personal} onChange={set("bio_personal")} rows={3} className={ta} /></SettingsField>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SettingsField label="Years Experience"><input type="number" value={form.years_experience} onChange={(e) => setForm((f) => ({ ...f, years_experience: +e.target.value }))} className={inp} /></SettingsField>
            <SettingsField label="Projects Completed"><input type="number" value={form.projects_completed} onChange={(e) => setForm((f) => ({ ...f, projects_completed: +e.target.value }))} className={inp} /></SettingsField>
            <SettingsField label="Happy Clients"><input type="number" value={form.happy_clients} onChange={(e) => setForm((f) => ({ ...f, happy_clients: +e.target.value }))} className={inp} /></SettingsField>
          </div>
        </SettingsSection>

        <SettingsSection title="Hero Section">
          <p className="text-xs text-muted-foreground -mt-2">Control every piece of text that appears in the homepage hero.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SettingsField label="Heading — Line 1 (plain)"><input value={form.hero_heading_prefix} onChange={set("hero_heading_prefix")} className={inp} placeholder="I design" /></SettingsField>
            <SettingsField label="Heading — Gradient text"><input value={form.hero_heading_gradient} onChange={set("hero_heading_gradient")} className={inp} placeholder="meaningful digital" /></SettingsField>
            <SettingsField label="Heading — Last line (plain)"><input value={form.hero_heading_suffix} onChange={set("hero_heading_suffix")} className={inp} placeholder="experiences" /></SettingsField>
          </div>
          <SettingsField label="Tagline / Subtitle"><textarea value={form.hero_tagline} onChange={set("hero_tagline")} rows={3} className={ta} /></SettingsField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingsField label="Primary CTA Button"><input value={form.hero_cta_primary} onChange={set("hero_cta_primary")} className={inp} placeholder="View Case Studies" /></SettingsField>
            <SettingsField label="Secondary CTA Button"><input value={form.hero_cta_secondary} onChange={set("hero_cta_secondary")} className={inp} placeholder="Contact Me" /></SettingsField>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SettingsField label="Stat 1 Label"><input value={form.hero_stat1_label} onChange={set("hero_stat1_label")} className={inp} placeholder="Years Experience" /></SettingsField>
            <SettingsField label="Stat 2 Label"><input value={form.hero_stat2_label} onChange={set("hero_stat2_label")} className={inp} placeholder="Projects Completed" /></SettingsField>
            <SettingsField label="Stat 3 Label"><input value={form.hero_stat3_label} onChange={set("hero_stat3_label")} className={inp} placeholder="Happy Clients" /></SettingsField>
          </div>
        </SettingsSection>

        <SettingsSection title="Why Work With Me">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingsField label="Section Title"><input value={form.why_work_title} onChange={set("why_work_title")} className={inp} /></SettingsField>
            <SettingsField label="Section Subtitle"><input value={form.why_work_subtitle} onChange={set("why_work_subtitle")} className={inp} /></SettingsField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {whyCards.map((card, i) => (
              <div key={i} className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-background">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Card {i + 1}</p>
                <SettingsField label="Emoji Icon"><input value={card.emoji} onChange={setCard(i, "emoji")} className={inp} placeholder="🔍" maxLength={4} /></SettingsField>
                <SettingsField label="Title"><input value={card.title} onChange={setCard(i, "title")} className={inp} /></SettingsField>
                <SettingsField label="Description"><textarea value={card.description} onChange={setCard(i, "description")} rows={3} className={ta} /></SettingsField>
              </div>
            ))}
          </div>
        </SettingsSection>

        <SettingsSection title="Contact & Social">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingsField label="Location"><input value={form.location} onChange={set("location")} className={inp} /></SettingsField>
            <SettingsField label="Email"><input type="email" value={form.email} onChange={set("email")} className={inp} /></SettingsField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingsField label="LinkedIn URL"><input value={form.linkedin} onChange={set("linkedin")} className={inp} /></SettingsField>
            <SettingsField label="Twitter / X"><input value={form.twitter} onChange={set("twitter")} className={inp} /></SettingsField>
            <SettingsField label="Dribbble URL"><input value={form.dribbble} onChange={set("dribbble")} className={inp} /></SettingsField>
            <SettingsField label="Behance URL"><input value={form.behance} onChange={set("behance")} className={inp} /></SettingsField>
          </div>
          <SettingsField label="CV / Resume URL"><input value={form.cv_url} onChange={set("cv_url")} className={inp} /></SettingsField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingsField label="Availability Status"><input value={form.availability_status} onChange={set("availability_status")} className={inp} placeholder="Currently Available" /></SettingsField>
            <SettingsField label="Availability Note"><input value={form.availability_note} onChange={set("availability_note")} className={inp} /></SettingsField>
          </div>
          <SettingsField label="Trusted Companies (comma separated)">
            <input value={form.trusted_companies} onChange={set("trusted_companies")} className={inp} placeholder="TechCorp, StartupXYZ, DesignLab" />
          </SettingsField>
          <SettingsField label="Skills (comma separated)">
            <textarea value={form.skills} onChange={set("skills")} rows={3} className={ta} />
          </SettingsField>
        </SettingsSection>

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
