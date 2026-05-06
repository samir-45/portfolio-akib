import { FeaturedWorkSection } from "./sections/FeaturedWorkSection";
import { FooterSection } from "./sections/FooterSection";
import { HeroSection } from "./sections/HeroSection";
import { WhyWorkWithMeSection } from "./sections/WhyWorkWithMeSection";

export const UxUiDesigner = (): JSX.Element => {
  return (
    <div className="w-full bg-neutral-950">
      <main className="flex flex-col bg-neutral-950">
        <HeroSection />
        <FeaturedWorkSection />
        <WhyWorkWithMeSection />
        <FooterSection />
      </main>
    </div>
  );
};
