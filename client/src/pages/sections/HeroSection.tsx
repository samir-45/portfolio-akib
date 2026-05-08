import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroImagePath from "@assets/UI_Designer_Portfolio_Website_1778060655592.png";

export const HeroSection = (): JSX.Element => {
  const { data: settings } = useQuery<Record<string, any>>({ queryKey: ["/api/settings"] });
  const name = settings?.designer_name ?? "Alex Morgan";
  const title = settings?.designer_title ?? "UX/UI Designer";
  const heroPrefix = settings?.hero_heading_prefix ?? "I design";
  const heroGradient = settings?.hero_heading_gradient ?? "meaningful\ndigital";
  const heroSuffix = settings?.hero_heading_suffix ?? "experiences";
  const heroTagline = settings?.hero_tagline ?? "Specializing in mobile apps, SaaS products, and design systems that drive business results through research-driven design.";
  const ctaPrimary = settings?.hero_cta_primary ?? "View Case Studies";
  const ctaSecondary = settings?.hero_cta_secondary ?? "Contact Me";
  const stat1Label = settings?.hero_stat1_label ?? "Years Experience";
  const stat2Label = settings?.hero_stat2_label ?? "Projects Completed";
  const stat3Label = settings?.hero_stat3_label ?? "Happy Clients";
  const yearsExp = settings?.years_experience ?? 5;
  const projectsDone = settings?.projects_completed ?? 50;
  const happyClients = settings?.happy_clients ?? 20;
  const avatarImage = settings?.avatarUrl || settings?.avatar_url || heroImagePath;

  return (
    <section className="relative w-full overflow-hidden bg-transparent text-[#f9f9f9]">
      <div className="absolute left-1/2 top-[268px] h-[848px] w-[848px] -translate-x-1/2 rotate-[27.54deg] rounded-[33554400px] bg-[linear-gradient(135deg,rgba(43,127,255,0.2)_0%,rgba(173,70,255,0.2)_100%)] blur-3xl" />
      <div className="relative mx-auto flex min-h-[944px] w-full max-w-[1534px] flex-col px-6 pb-[22px] pt-[126px] sm:px-10 lg:px-[60px] xl:px-[90px] 2xl:px-[151px]">
        <div className="grid flex-1 items-start gap-10 lg:grid-cols-[minmax(0,592px)_minmax(0,670.73px)] lg:gap-[7.3px]">
          <header className="flex min-w-0 flex-col items-start gap-8">
            <div className="flex w-full flex-col items-start">
              <Card className="h-auto rounded-[33554400px] border-0 bg-[#fafafa0d] shadow-none">
                <CardContent className="px-4 py-[10px]"><p className="[font-family:'Arial-Regular',Helvetica] text-sm font-normal leading-5 tracking-[0] text-[#f9f9f9] whitespace-nowrap">{title}</p></CardContent>
              </Card>
              <div className="mt-14 w-full">
                <h1 className="[font-family:'Arial-Bold',Helvetica] text-5xl font-bold leading-[1.05] tracking-[0] text-[#f9f9f9] sm:text-6xl lg:text-7xl lg:leading-[90px]"><span className="block">{heroPrefix}</span><span className="block bg-[linear-gradient(135deg,#2b7fff_0%,#ad46ff_100%)] bg-clip-text text-transparent">{heroGradient}</span><span className="block">{heroSuffix}</span></h1>
              </div>
              <p className="mt-[18px] max-w-[576px] [font-family:'Arial-Regular',Helvetica] text-base font-normal leading-7 tracking-[0] text-[#a0a0a0] sm:text-lg lg:text-xl">{heroTagline}</p>
            </div>
            <nav aria-label="Hero actions" className="flex w-full flex-wrap items-center gap-4">
              <Button type="button" variant="ghost" className="h-auto rounded-lg bg-[#f9f9f9] px-3.5 py-[9px] text-neutral-900 hover:bg-[#f9f9f9]/90">{ctaPrimary}</Button>
              <Button type="button" variant="ghost" className="h-auto rounded-lg border border-neutral-800 bg-[#2626264c] px-[17px] py-2 text-[#f9f9f9] hover:bg-[#26262666]">{ctaSecondary}</Button>
            </nav>
            <section className="grid w-full grid-cols-1 gap-8 border-t border-neutral-800 pt-[33px] sm:grid-cols-3 sm:gap-6">
              {[{ value: `${yearsExp}+`, label: stat1Label }, { value: `${projectsDone}+`, label: stat2Label }, { value: `${happyClients}+`, label: stat3Label }].map((stat) => (<div key={stat.label} className="flex flex-col items-start"><div className="[font-family:'Arial-Bold',Helvetica] text-3xl font-bold leading-9 tracking-[0] text-[#f9f9f9] whitespace-nowrap">{stat.value}</div><div className="mt-1 [font-family:'Arial-Regular',Helvetica] text-sm font-normal leading-5 tracking-[0] text-[#a0a0a0]">{stat.label}</div></div>))}
            </section>
          </header>
          <div className="flex w-full items-start justify-center lg:justify-end"><img className="mt-0 h-auto w-full max-w-[670.73px] lg:mt-[56.5px]" alt={name} src={avatarImage} /></div>
        </div>
        <div className="mt-8 flex w-full justify-center lg:mt-0"><div className="flex h-10 w-6 items-start justify-center rounded-[33554400px] border-2 border-solid border-[#a0a0a0] px-0 pb-0 pt-[19.92px]"><div className="h-1.5 w-1 rounded-[33554400px] bg-[#a0a0a0]" /></div></div>
      </div>
    </section>
  );
};
