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
    <section className="w-full max-w-3xl px-6 py-16 mx-auto">
      {/* Header */}
      <div className="mb-10 text-center space-y-3">
        <h2 className="text-3xl font-semibold tracking-tight text-gray-800 sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <p className="text-base text-gray-500 max-w-xl mx-auto">
          Everything you need to know about Finasaan. Can&apos;t find your answer?{" "}
          <a
            href="mailto:hello@finasaan.com"
            className="text-[#159F63] underline underline-offset-2 hover:text-[#128a54] transition-colors"
          >
            Reach out to us.
          </a>
        </p>
      </div>

      {/* Accordion */}
      <Accordion type="single" collapsible className="w-full space-y-3">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="rounded-2xl border border-gray-200 px-5 shadow-[2px_0px_0px_rgba(0,0,0,0.06),0px_2px_0px_rgba(0,0,0,0.06)]"
          >
            <AccordionTrigger className="text-left text-sm font-semibold text-gray-900 hover:no-underline sm:text-base [&[data-state=open]>svg]:rotate-180 [&[data-state=open]]:text-[#159F63]">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm font-normal leading-relaxed text-gray-600 sm:text-base">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FAQSection;
