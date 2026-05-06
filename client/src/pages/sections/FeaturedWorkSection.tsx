import { ArrowUpRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const featuredWorkItems = [
  {
    id: "finflow-mobile-banking",
    iconSrc: "/figmaAssets/container-4.svg",
    category: "Mobile App",
    title: "FinFlow Mobile Banking",
    description: "Redesigning mobile banking experience for Gen-Z users",
    statement:
      '"How might we make banking more intuitive and engaging for younger users?"',
    impact: "+45% user engagement",
    imageSrc: "/figmaAssets/container-8.svg",
  },
  {
    id: "dashboard-analytics-platform",
    iconSrc: "/figmaAssets/container-5.svg",
    category: "Web Application",
    title: "Dashboard Analytics Platform",
    description: "Enterprise SaaS dashboard for real-time data visualization",
    statement: '"Simplifying complex data analytics for non-technical users"',
    impact: "60% faster task completion",
    imageSrc: "/figmaAssets/container-9.svg",
  },
  {
    id: "e-commerce-redesign",
    iconSrc: "/figmaAssets/container-3.svg",
    category: "Web & Mobile",
    title: "E-commerce Redesign",
    description: "Improving conversion rates through UX optimization",
    statement: '"Reducing cart abandonment and increasing purchase completion"',
    impact: "+35% conversion rate",
    imageSrc: "/figmaAssets/container-7.svg",
  },
];

export const FeaturedWorkSection = (): JSX.Element => {
  return (
    <section className="relative mt-32 flex w-full flex-col items-start gap-16 px-4 sm:px-6 lg:px-8">
      <header className="flex w-full flex-col items-start gap-4">
        <div className="[font-family:'Arial-Bold',Helvetica] text-4xl font-bold leading-[48px] tracking-[0] text-[#f9f9f9] sm:text-5xl">
          Featured Work
        </div>
        <p className="max-w-[672px] [font-family:'Arial-Regular',Helvetica] text-base font-normal leading-7 tracking-[0] text-[#a0a0a0] sm:text-xl">
          Real-world problems solved through thoughtful design and user research
        </p>
      </header>
      <div className="flex w-full flex-col items-start gap-[38px]">
        {featuredWorkItems.map((item) => (
          <Card
            key={item.id}
            className="w-full rounded-3xl border border-neutral-800 bg-neutral-950 p-px shadow-none"
          >
            <CardContent className="p-0">
              <article className="grid min-h-[673px] grid-cols-1 gap-8 p-6 md:p-8 xl:grid-cols-2 xl:gap-8 xl:p-12">
                <div className="flex h-full flex-col justify-between">
                  <div className="flex flex-col items-start gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        className="h-12 w-12"
                        alt={item.category}
                        src={item.iconSrc}
                      />
                      <span className="[font-family:'Arial-Regular',Helvetica] text-sm font-normal leading-5 tracking-[0] text-[#a0a0a0]">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <h2 className="[font-family:'Arial-Bold',Helvetica] text-3xl font-bold leading-10 tracking-[0] text-[#f9f9f9] xl:text-4xl">
                        {item.title}
                      </h2>
                      <p className="[font-family:'Arial-Regular',Helvetica] text-base font-normal leading-7 tracking-[0] text-[#a0a0a0] xl:text-lg">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex w-full flex-col items-start gap-2 pt-4">
                      <div className="[font-family:'Arial-Regular',Helvetica] text-sm font-normal leading-5 tracking-[0] text-[#a0a0a0]">
                        Problem Statement
                      </div>
                      <blockquote className="w-full border-l-4 border-[#f9f9f9] pl-5 [font-family:'Arial-Italic',Helvetica] text-sm font-normal italic leading-6 tracking-[0] text-[#f9f9f9] sm:text-base">
                        {item.statement}
                      </blockquote>
                    </div>
                  </div>
                  <footer className="mt-10 flex w-full flex-col gap-4 border-t border-neutral-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col items-start gap-1">
                      <div className="[font-family:'Arial-Regular',Helvetica] text-sm font-normal leading-5 tracking-[0] text-[#a0a0a0]">
                        Impact
                      </div>
                      <div className="[font-family:'Arial-Bold',Helvetica] text-2xl font-bold leading-8 tracking-[0] text-[#00ff85]">
                        {item.impact}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-auto p-0 [font-family:'Arial-Regular',Helvetica] text-base font-normal leading-6 tracking-[0] text-[#f9f9f9] hover:bg-transparent hover:text-[#f9f9f9]"
                    >
                      <span>View Case Study</span>
                      <ArrowUpRightIcon className="ml-2 h-5 w-5" />
                    </Button>
                  </footer>
                </div>
                <div className="flex h-full items-start justify-center xl:justify-end">
                  <div
                    className="min-h-[320px] w-full rounded-2xl bg-cover bg-center sm:min-h-[420px] xl:min-h-[575px] xl:max-w-[575px]"
                    style={{ backgroundImage: `url(${item.imageSrc})` }}
                    aria-label={item.title}
                    role="img"
                  />
                </div>
              </article>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
