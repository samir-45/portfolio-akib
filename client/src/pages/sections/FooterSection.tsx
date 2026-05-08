import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const FooterSection = (): JSX.Element => {
  const { data: settings } = useQuery<Record<string, any>>({ queryKey: ["/api/settings"] });
  const name = settings?.designer_name ?? "Alex Morgan";
  const footerText = settings?.footer_text ?? "UX/UI Designer crafting meaningful digital experiences through research-driven design and human-centered thinking.";
  const copyright = settings?.footer_copyright ?? `© 2026 ${name}. All rights reserved.`;
  const navigationItems = ["Work", "About", "Process", "Playground", "Contact"];
  const resourceItems = ["Design Articles", "Case Studies", "Testimonials", "Download CV"];
  const legalItems = ["Privacy Policy", "Terms of Service"];

  return (
    <footer className="relative mt-[100px] w-full border-t border-neutral-800 bg-[#2626264c] px-4 pt-px sm:px-6 lg:px-[127px]"><Card className="border-0 bg-transparent shadow-none"><CardContent className="flex w-full flex-col gap-12 px-0 pb-0 pt-16"><section className="grid w-full grid-cols-1 gap-12 lg:grid-cols-[minmax(0,592px)_272px_272px] lg:justify-between lg:gap-12"><div className="flex max-w-[592px] flex-col"><h2 className="[font-family:'Arial-Bold',Helvetica] text-2xl font-bold leading-8 tracking-[0] text-[#f9f9f9]">{name}</h2><p className="mt-4 max-w-[448px] [font-family:'Arial-Regular',Helvetica] text-base font-normal leading-6 tracking-[0] text-[#a0a0a0]">{footerText}</p></div><nav aria-label="Footer navigation" className="flex flex-col gap-4"><h3 className="[font-family:'Arial-Bold',Helvetica] text-base font-bold leading-6 tracking-[0] text-[#f9f9f9]">Navigation</h3><ul className="flex flex-col gap-3">{navigationItems.map((item) => (<li key={item}><button type="button" className="[font-family:'Arial-Regular',Helvetica] h-auto p-0 text-left text-base font-normal leading-6 tracking-[0] text-[#a0a0a0] transition-colors hover:text-[#f9f9f9] focus:outline-none">{item}</button></li>))}</ul></nav><section className="flex flex-col gap-4"><h3 className="[font-family:'Arial-Bold',Helvetica] text-base font-bold leading-6 tracking-[0] text-[#f9f9f9]">Resources</h3><ul className="flex flex-col gap-3">{resourceItems.map((item) => (<li key={item}><button type="button" className="[font-family:'Arial-Regular',Helvetica] h-auto p-0 text-left text-base font-normal leading-6 tracking-[0] text-[#a0a0a0] transition-colors hover:text-[#f9f9f9] focus:outline-none">{item}</button></li>))}</ul></section></section><div className="w-full"><Separator className="bg-neutral-800" /><div className="flex min-h-[53px] w-full flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center sm:py-0"><p className="[font-family:'Arial-Regular',Helvetica] text-sm font-normal leading-5 tracking-[0] text-[#a0a0a0]">{copyright}</p><nav aria-label="Legal links"><ul className="flex flex-wrap items-center gap-6">{legalItems.map((item) => (<li key={item}><button type="button" className="[font-family:'Arial-Regular',Helvetica] h-auto p-0 text-sm font-normal leading-5 tracking-[0] text-[#a0a0a0] transition-colors hover:text-[#f9f9f9] focus:outline-none">{item}</button></li>))}</ul></nav></div></div></CardContent></Card></footer>
  );
};
