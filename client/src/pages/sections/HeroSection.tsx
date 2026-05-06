import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { value: "5+", label: "Years Experience" },
  { value: "50+", label: "Projects Completed" },
  { value: "20+", label: "Happy Clients" },
];

const ctaButtons = [
  {
    label: "View Case Studies",
    icon: "/figmaAssets/icon-3.svg",
    variant: "primary" as const,
  },
  {
    label: "Contact Me",
    icon: "/figmaAssets/icon-1.svg",
    variant: "secondary" as const,
  },
];

export const HeroSection = (): JSX.Element => {
  return (
    <section className="relative w-full overflow-hidden bg-transparent text-[#f9f9f9]">
      <div className="absolute left-1/2 top-[268px] h-[848px] w-[848px] -translate-x-1/2 rotate-[27.54deg] rounded-[33554400px] bg-[linear-gradient(135deg,rgba(43,127,255,0.2)_0%,rgba(173,70,255,0.2)_100%)] blur-3xl" />
      <div className="relative mx-auto flex min-h-[944px] w-full max-w-[1534px] flex-col px-6 pb-[22px] pt-[126px] sm:px-10 lg:px-[60px] xl:px-[90px] 2xl:px-[151px]">
        <div className="grid flex-1 items-start gap-10 lg:grid-cols-[minmax(0,592px)_minmax(0,670.73px)] lg:gap-[7.3px]">
          <header className="flex min-w-0 flex-col items-start gap-8">
            <div className="flex w-full flex-col items-start">
              <Card className="h-auto rounded-[33554400px] border-0 bg-[#fafafa0d] shadow-none">
                <CardContent className="px-4 py-[10px]">
                  <p className="[font-family:'Arial-Regular',Helvetica] text-sm font-normal leading-5 tracking-[0] text-[#f9f9f9] whitespace-nowrap">
                    UX/UI Designer
                  </p>
                </CardContent>
              </Card>
              <div className="mt-14 w-full">
                <h1 className="[font-family:'Arial-Bold',Helvetica] text-5xl font-bold leading-[1.05] tracking-[0] text-[#f9f9f9] sm:text-6xl lg:text-7xl lg:leading-[90px]">
                  <span className="block">I design meaningful</span>
                  <span className="block bg-[linear-gradient(135deg,#2b7fff_0%,#ad46ff_100%)] bg-clip-text text-transparent">
                    digital experiences
                  </span>
                  <span className="block">that people love</span>
                </h1>
              </div>
              <p className="mt-[18px] max-w-[576px] [font-family:'Arial-Regular',Helvetica] text-base font-normal leading-7 tracking-[0] text-[#a0a0a0] sm:text-lg lg:text-xl">
                Specializing in mobile apps, SaaS products, and design systems
                that drive business results through research-driven design.
              </p>
            </div>
            <nav
              aria-label="Hero actions"
              className="flex w-full flex-wrap items-center gap-4"
            >
              {ctaButtons.map((button) => (
                <Button
                  key={button.label}
                  type="button"
                  variant="ghost"
                  className={
                    button.variant === "primary"
                      ? "h-auto rounded-lg bg-[#f9f9f9] px-3.5 py-[9px] text-neutral-900 hover:bg-[#f9f9f9]/90"
                      : "h-auto rounded-lg border border-neutral-800 bg-[#2626264c] px-[17px] py-2 text-[#f9f9f9] hover:bg-[#26262666]"
                  }
                >
                  <span className="flex items-center gap-[14px]">
                    {button.variant === "secondary" && (
                      <img
                        className="h-4 w-4"
                        alt=""
                        aria-hidden="true"
                        src={button.icon}
                      />
                    )}
                    <span className="[font-family:'Arial-Regular',Helvetica] text-sm font-normal leading-5 tracking-[0]">
                      {button.label}
                    </span>
                    {button.variant === "primary" && (
                      <img
                        className="h-4 w-4"
                        alt=""
                        aria-hidden="true"
                        src={button.icon}
                      />
                    )}
                  </span>
                </Button>
              ))}
            </nav>
            <section className="grid w-full grid-cols-1 gap-8 border-t border-neutral-800 pt-[33px] sm:grid-cols-3 sm:gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-start">
                  <div className="[font-family:'Arial-Bold',Helvetica] text-3xl font-bold leading-9 tracking-[0] text-[#f9f9f9] whitespace-nowrap">
                    {stat.value}
                  </div>
                  <div className="mt-1 [font-family:'Arial-Regular',Helvetica] text-sm font-normal leading-5 tracking-[0] text-[#a0a0a0]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </section>
          </header>
          <div className="flex w-full items-start justify-center lg:justify-end">
            <img
              className="mt-0 h-auto w-full max-w-[670.73px] lg:mt-[56.5px]"
              alt="Portrait container"
              src="/figmaAssets/container-6.svg"
            />
          </div>
        </div>
        <div className="mt-8 flex w-full justify-center lg:mt-0">
          <div className="flex h-10 w-6 items-start justify-center rounded-[33554400px] border-2 border-solid border-[#a0a0a0] px-0 pb-0 pt-[19.92px]">
            <div className="h-1.5 w-1 rounded-[33554400px] bg-[#a0a0a0]" />
          </div>
        </div>
      </div>
    </section>
  );
};
