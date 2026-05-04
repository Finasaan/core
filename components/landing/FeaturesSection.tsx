import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  LineChart,
  Lock,
  Receipt,
  Shield,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: LineChart,
    title: "Investing & Funds",
    description:
      "Understand how to invest in local stocks, ETFs, and mutual funds with step-by-step guidance and historic data.",
  },
  {
    icon: Shield,
    title: "Insurance Plans",
    description:
      "Learn how health, life, and car insurance actually work in Pakistan and how to choose the right coverage for you.",
  },
  {
    icon: Receipt,
    title: "Tax Filing",
    description:
      "No more confusion. Finasaan explains income tax laws, return filing, and deductions — all in clear, local context.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Guidance",
    description:
      "From “Where should I invest?” to “How do I file zakat?” — get instant, intelligent answers from our smart assistant.",
  },
  {
    icon: GraduationCap,
    title: "Personalized Learning",
    description:
      "Finasaan adapts to you — beginner, intermediate, or pro — with lessons that match your financial goals.",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description:
      "We don't sell your data. Ever. Everything is end-to-end encrypted and built with your trust in mind.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="w-full bg-white px-6 py-28 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#159F63]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#159F63]" />
            Features
          </span>
          <h2 className="mt-3 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.5rem]">
            Designed for clarity, built for better money decisions.
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group flex flex-col gap-4 rounded-3xl bg-zinc-50 p-7 ring-1 ring-zinc-100 transition-all duration-300 hover:bg-white hover:ring-zinc-200 hover:shadow-[0_8px_30px_-12px_rgba(21,159,99,0.18)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#159F63]/10 text-[#159F63] transition-colors duration-300 group-hover:bg-[#159F63] group-hover:text-white">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-zinc-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#159F63]"
          >
            Get started
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
