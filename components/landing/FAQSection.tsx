import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "What is Finasaan?",
    answer:
      "Finasaan is an AI-powered financial literacy platform designed for Pakistanis. It helps you understand personal finance, investing, budgeting, and wealth-building through personalized guidance tailored to your knowledge level and goals.",
  },
  {
    question: "Who is Finasaan for?",
    answer:
      "Finasaan is for anyone who wants to improve their financial knowledge — whether you're a student just starting out, a working professional looking to invest, or someone who wants to better manage their money day to day.",
  },
  {
    question: "How does the AI work?",
    answer:
      "Our AI understands your financial background, goals, and knowledge level through a short onboarding process. It then provides personalized explanations, answers your finance questions in plain language, and guides you through topics at your own pace.",
  },
  {
    question: "Is Finasaan free to use?",
    answer:
      "Finasaan offers a free tier to get you started with core financial education features. Premium plans with advanced AI guidance, deeper analysis, and personalised investment education will be available at affordable pricing.",
  },
  {
    question: "What topics does Finasaan cover?",
    answer:
      "Finasaan covers a wide range of financial topics including budgeting, saving strategies, understanding the stock market (PSX), mutual funds, real estate basics, Islamic finance, inflation, and long-term wealth planning — all in a Pakistan-relevant context.",
  },
  {
    question: "Is my financial information secure?",
    answer:
      "Yes. Finasaan does not store any sensitive financial account data. The information you share during onboarding (like your occupation and interests) is used solely to personalise your experience and is never shared with third parties.",
  },
  {
    question: "Can I use Finasaan on my phone?",
    answer:
      "Absolutely. Finasaan is fully responsive and works seamlessly on mobile browsers. A dedicated mobile app is on our roadmap for the near future.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="w-full bg-zinc-50 px-6 py-28 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[5fr_8fr] lg:gap-20">
          <div className="animate-slide-left delay-0 lg:sticky lg:top-32 lg:self-start">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#159F63]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#159F63]" />
              FAQ
            </span>
            <h2 className="mt-3 text-4xl font-bold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl">
              Got questions?
              <br />
              We&apos;ve got answers.
            </h2>
            <p className="mt-6 max-w-xs text-base leading-relaxed text-zinc-500">
              Can&apos;t find what you&apos;re looking for?{" "}
              <a
                href="mailto:hello@finasaan.com"
                className="font-semibold text-[#159F63] underline decoration-[#159F63]/40 underline-offset-4 transition-colors hover:text-[#0A6C41]"
              >
                Contact us ↗
              </a>
            </p>
          </div>

          <div className="animate-fade-up delay-150">
            <Accordion type="single" collapsible className="flex w-full flex-col gap-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white px-5 transition-colors data-[state=open]:border-[#159F63]/40 data-[state=open]:bg-white"
                >
                  <AccordionTrigger
                    className={[
                      "py-5 text-left text-base font-semibold text-zinc-900 hover:no-underline",
                      "[&>svg]:text-[#159F63]",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-4">
                      <span className="text-xs font-bold tabular-nums text-[#159F63]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{faq.question}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pl-10 text-[15px] leading-relaxed text-zinc-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
