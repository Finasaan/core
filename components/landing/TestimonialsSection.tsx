import TestimonialCard from "./TestimonialCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    content:
      "I always thought investing was only for the rich. Finasaan broke it all down for me in plain Urdu-English. Now I actually understand mutual funds and have started a small SIP. Genuinely life-changing.",
    author: "Sana Malik",
    subtitle: "Graphic Designer, Lahore",
  },
  {
    content:
      "The AI feels like having a knowledgeable friend who never judges you for asking basic questions. I asked about the PSX and got a clear, honest answer within seconds. No jargon.",
    author: "Bilal Ahmed",
    subtitle: "Software Engineer, Karachi",
  },
  {
    content:
      "As a fresh grad, nobody tells you how to manage your first salary. Finasaan helped me set up a realistic budget, understand taxes, and start an emergency fund. I wish I had this in university.",
    author: "Ayesha Raza",
    subtitle: "Junior Accountant, Islamabad",
  },
];

const TestimonialsSection = () => {
  return (
    <section
      id="testimonials"
      className="w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-10"
    >
      {/* Header */}
      <div className="mb-16 space-y-4 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-gray-700 sm:text-4xl lg:text-5xl">
          What people say about us
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-500 sm:text-base">
          Finasaan aims to make financial education accessible and actionable for
          every Pakistani — regardless of their background. Here&apos;s what
          early users think.
        </p>
      </div>

      {/* Mobile: Carousel (shadcn/ui) */}
      <div className="block sm:hidden">
        <Carousel className="mx-auto w-full max-w-[17rem] shadow-[2px_0px_0px_rgba(0,0,0,0.08),-2px_0px_0px_rgba(0,0,0,0.08)]">
          <CarouselContent>
            {testimonials.map((t, i) => {
              const initials = t.author
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
              return (
                <CarouselItem key={i}>
                  <Card className="border-none shadow-none">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 shrink-0">
                            <AvatarFallback className="bg-[#159F63]/15 text-[#159F63] font-semibold text-sm">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-left">
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {t.author}
                            </h4>
                            <p className="text-xs text-gray-500">{t.subtitle}</p>
                          </div>
                        </div>
                        <p className="text-left text-sm leading-relaxed text-gray-600">
                          {t.content}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="-left-10 h-8 w-8 border-2 border-gray-200 bg-white shadow-md hover:border-[#159F63] hover:text-[#159F63] disabled:opacity-30" />
          <CarouselNext className="-right-10 h-8 w-8 border-2 border-gray-200 bg-white shadow-md hover:border-[#159F63] hover:text-[#159F63] disabled:opacity-30" />
        </Carousel>
      </div>

      {/* Desktop: Masonry grid */}
      <div className="masonry masonry-sm md:masonry-md hidden sm:block">
        {testimonials.map((t, i) => (
          <TestimonialCard
            key={i}
            content={t.content}
            author={t.author}
            subtitle={t.subtitle}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 flex justify-center">
        <Link href="/signup">
          <Button
            size="lg"
            className="rounded-full bg-[#159F63] px-8 py-6 text-base font-semibold text-white shadow-lg shadow-[#159F63]/25 hover:bg-[#128a54] transition-colors"
          >
            Get Started — It&apos;s Free
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default TestimonialsSection;
