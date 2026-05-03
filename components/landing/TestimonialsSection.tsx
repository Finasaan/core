"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    content:
      "I always thought investing was only for the rich. Finasaan broke it all down for me in plain Urdu-English. Now I actually understand mutual funds and have started a small SIP. Genuinely life-changing.",
    author: "Sana Malik",
    role: "Graphic Designer, Lahore",
    featured: true,
  },
  {
    content:
      "The AI feels like having a knowledgeable friend who never judges you for asking basic questions. I asked about the PSX and got a clear, honest answer within seconds. No jargon.",
    author: "Bilal Ahmed",
    role: "Software Engineer, Karachi",
    featured: false,
  },
  {
    content:
      "As a fresh grad, nobody tells you how to manage your first salary. Finasaan helped me set up a realistic budget, understand taxes, and start an emergency fund. I wish I had this in university.",
    author: "Ayesha Raza",
    role: "Junior Accountant, Islamabad",
    featured: false,
  },
];


const TestimonialsSection = () => {
  const featured = testimonials[0];
  const secondary = testimonials.slice(1);

  return (
    <section
      id="testimonials"
      className="relative w-full overflow-hidden bg-[#0D1F17] px-4 py-16 sm:px-8 sm:py-24 lg:px-16"
    >
      {/* Radial glow — top right corner */}
      <div
        className="pointer-events-none absolute -top-32 -right-40 h-[500px] w-[500px] rounded-full opacity-[0.18] blur-[120px]"
        style={{ background: "#159F63" }}
      />
      {/* Faint glow — bottom left */}
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-[320px] w-[320px] rounded-full opacity-[0.08] blur-[90px]"
        style={{ background: "#159F63" }}
      />

      <div className="relative mx-auto max-w-7xl">

        {/* Section header — left-aligned, editorial */}
        <div className="mb-10 animate-slide-left delay-0 sm:mb-14">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#159F63] sm:text-xs">
            Early users
          </p>
          <h2 className="text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Don&apos;t take our<br />
            word for it.
          </h2>
        </div>

        {/* ─── Desktop: Asymmetric bento (lg+) ─── */}
        <div className="hidden lg:grid lg:grid-cols-5 lg:gap-5">

          {/* LEFT — Featured hero quote (3 cols) */}
          <div className="animate-fade-up delay-100 col-span-3 flex flex-col justify-between rounded-3xl bg-[#122B1E] p-10 ring-1 ring-white/[0.06] relative overflow-hidden">
            {/* Giant decorative quote mark */}
            <span
              className="pointer-events-none absolute -top-6 -left-2 select-none font-serif text-[180px] leading-none text-[#159F63]/10 font-black"
              aria-hidden="true"
            >
              &ldquo;
            </span>

            {/* Quote */}
            <p className="relative z-10 text-xl font-medium leading-relaxed text-zinc-100 italic sm:text-2xl mt-8">
              &ldquo;{featured.content}&rdquo;
            </p>

            {/* Author */}
            <div className="relative z-10 mt-10 flex items-center gap-4 border-t border-white/10 pt-8">
              <div>
                <p className="font-bold text-white tracking-tight">{featured.author}</p>
                <p className="text-xs font-medium text-zinc-500 mt-0.5">{featured.role}</p>
              </div>
            </div>
          </div>

          {/* RIGHT — Two stacked secondary quotes (2 cols) */}
          <div className="col-span-2 flex flex-col gap-5">
            {secondary.map((t, i) => (
              <div
                key={t.author}
                className={`animate-fade-up flex flex-1 flex-col justify-between rounded-3xl bg-[#0F2318] p-8 ring-1 ring-white/[0.06] ${
                  i === 0 ? "delay-200" : "delay-300"
                }`}
              >
                <p className="text-sm leading-relaxed text-zinc-300 font-medium">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-white/[0.08] pt-6">
                  <div>
                    <p className="text-sm font-bold text-zinc-200">{t.author}</p>
                    <p className="text-[11px] font-medium text-zinc-600 mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Mobile / Tablet: Carousel (< lg) ─── */}
        <div className="block lg:hidden animate-fade-up delay-100">
          <Carousel className="w-full" opts={{ align: "start", loop: true }}>
            <CarouselContent className="-ml-4">
              {testimonials.map((t) => (
                <CarouselItem key={t.author} className="pl-4 sm:basis-[85%] basis-full">
                  <div className="flex h-full flex-col justify-between rounded-2xl bg-[#122B1E] p-7 ring-1 ring-white/[0.08]">
                    {/* Quote mark */}
                    <span className="text-4xl font-serif font-black text-[#159F63]/30 leading-none select-none" aria-hidden>
                      &ldquo;
                    </span>
                    <p className="mt-3 text-base font-medium leading-relaxed text-zinc-200 italic">
                      &ldquo;{t.content}&rdquo;
                    </p>
                    <div className="mt-6 flex items-center gap-3 border-t border-white/[0.08] pt-6">
                      <div>
                        <p className="font-bold text-white text-sm">{t.author}</p>
                        <p className="text-[11px] font-medium text-zinc-600 mt-0.5">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Carousel controls */}
            <div className="mt-8 flex items-center gap-3">
              <CarouselPrevious className="static translate-y-0 h-10 w-10 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-[#159F63] transition-all duration-200" />
              <CarouselNext className="static translate-y-0 h-10 w-10 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-[#159F63] transition-all duration-200" />
            </div>
          </Carousel>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
