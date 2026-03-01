import HomeNav from "@/components/landing/HomeNav";
import HeroSection from "@/components/landing/HeroSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import HomeFooter from "@/components/landing/HomeFooter";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-white">
      <HomeNav />
      <main className="flex w-full flex-col items-center">
        <HeroSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <HomeFooter />
    </div>
  );
}
