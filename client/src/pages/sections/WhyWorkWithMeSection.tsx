import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

export const WhyWorkWithMeSection = (): JSX.Element => {
  const { data: settings } = useQuery<Record<string, any>>({ queryKey: ["/api/settings"] });
  const cards = settings?.why_work_with_me ?? [
    { title: "Research-driven design", description: "Every decision backed by user research, data analysis, and behavioral psychology.", emoji: "🔍" },
    { title: "Fast & scalable systems", description: "Building design systems that grow with your product and accelerate development.", emoji: "⚡" },
    { title: "Business-focused UX", description: "Balancing user needs with business goals to drive measurable results.", emoji: "📈" },
  ];
  const title = settings?.why_work_title ?? "Why Work With Me";
  const subtitle = settings?.why_work_subtitle ?? "I combine design thinking with business strategy to create products that users love and companies profit from";
  const trustedCompanies = settings?.trusted_companies ?? ["TechCorp", "StartupXYZ", "DesignLab", "InnovateCo"];

  return (
    <section className="relative mt-[65px] w-full bg-[#2626264c] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-10 lg:gap-[50px]">
        <header className="flex w-full max-w-[672px] flex-col items-center gap-4 text-center"><h2 className="[font-family:'Arial-Bold',Helvetica] text-4xl font-bold leading-[1.05] tracking-[0] text-[#f9f9f9] sm:text-5xl">{title}</h2><p className="[font-family:'Arial-Regular',Helvetica] text-base font-normal leading-7 tracking-[0] text-[#a0a0a0] sm:text-xl">{subtitle}</p></header>
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">{cards.map((card: any) => (<Card key={card.title} className="rounded-3xl border border-neutral-800 bg-neutral-950 shadow-none"><CardContent className="flex h-full flex-col gap-4 p-8"><div className="text-4xl">{card.emoji}</div><div className="flex flex-col gap-3"><h3 className="[font-family:'Arial-Bold',Helvetica] text-2xl font-bold leading-8 tracking-[0] text-[#f9f9f9]">{card.title}</h3><p className="[font-family:'Arial-Regular',Helvetica] text-base font-normal leading-[26px] tracking-[0] text-[#a0a0a0]">{card.description}</p></div></CardContent></Card>))}</div>
        <div className="flex flex-col items-center gap-5 text-center"><p className="[font-family:'Arial-Regular',Helvetica] text-sm font-normal leading-5 tracking-[0] text-[#a0a0a0]">Trusted by startups &amp; teams</p><nav aria-label="Trusted by companies" className="flex w-full max-w-[624.19px] flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:justify-between">{trustedCompanies.map((company: string) => (<button key={company} type="button" className="[font-family:'Arial-Bold',Helvetica] text-center text-xl font-bold leading-8 tracking-[0] text-[#f9f9f9] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:text-2xl">{company}</button>))}</nav></div>
      </div>
    </section>
  );
};
