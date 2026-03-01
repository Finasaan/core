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
    <section className="w-full bg-white px-6 py-24 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[5fr_8fr] lg:gap-20">

          {/* Left column — sticky editorial heading */}
          <div className="lg:sticky lg:top-32 lg:self-start animate-slide-left delay-0">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#159F63]">
              FAQ
            </p>
            <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-zinc-900 sm:text-5xl">
              Questions,<br />
              Answered.
            </h2>
            {/* Green accent underline */}
            <div className="mt-5 h-1 w-10 rounded-full bg-[#159F63]" />
            <p className="mt-6 text-base leading-relaxed text-zinc-500 max-w-xs">
              Can&apos;t find what you&apos;re looking for?{" "}
              <a
                href="mailto:hello@finasaan.com"
                className="font-semibold text-[#159F63] underline decoration-[#159F63]/40 underline-offset-4 hover:text-[#0A6C41] transition-colors"
              >
                Reach out to us.
              </a>
            </p>
          </div>

          {/* Right column — accordion */}
          <div className="animate-fade-up delay-150">
            <Accordion type="single" collapsible className="w-full divide-y divide-zinc-200">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-none py-1 group"
                >
                  <AccordionTrigger
                    className={[
                      "py-5 text-left text-base font-semibold text-zinc-800 hover:no-underline",
                      "transition-all duration-200",
                      // The chevron rotation is handled by shadcn's built-in [data-state=open] on the SVG
                      // Open state: shift text color to brand green
                      "[&[data-state=open]]:text-[#159F63]",
                      // Add left padding + green left border when open via pl trick
                      "pl-0 [&[data-state=open]]:pl-4",
                      // Transition for the padding shift
                      "transition-[padding] duration-200",
                    ].join(" ")}
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pl-0 pb-5 text-[15px] leading-relaxed text-zinc-500 [&[data-state=open]]:pl-4 transition-[padding] duration-200">
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
