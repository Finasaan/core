import HomeNav from "@/components/landing/HomeNav";
import HeroSection from "@/components/landing/HeroSection";
import TrustBar from "@/components/landing/TrustBar";
import TrackSection from "@/components/landing/TrackSection";
import AIAssistantSection from "@/components/landing/AIAssistantSection";
import LearnSection from "@/components/landing/LearnSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import LevelsSection from "@/components/landing/LevelsSection";
import SecuritySection from "@/components/landing/SecuritySection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import HomeFooter from "@/components/landing/HomeFooter";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 font-sans selection:bg-[#159F63]/20">
      <HomeNav />
      <main className="flex w-full flex-col items-center overflow-hidden">
        <HeroSection />
        <TrustBar />
        <TrackSection />
        <AIAssistantSection />
        <LearnSection />
        <FeaturesSection />
        <LevelsSection />
        <SecuritySection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <HomeFooter />
    </div>
  );
}
