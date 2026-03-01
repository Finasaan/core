import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Home", href: "/" },
      { label: "Demo", href: "/demo" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-of-service" },
    ],
  },
];

const socialLinks = [
  { label: "Facebook", href: "#", icon: <Facebook size={16} /> },
  { label: "Instagram", href: "#", icon: <Instagram size={16} /> },
  { label: "LinkedIn", href: "#", icon: <Linkedin size={16} /> },
];

const HomeFooter = () => {
  return (
    <>
      {/* ── Pre-footer CTA banner ── */}
      <section className="relative w-full overflow-hidden bg-[#0D1F17] px-6 py-24 sm:px-8 lg:px-16">
        {/* Radial glow */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden
        >
          <div
            className="h-[600px] w-[600px] rounded-full opacity-[0.14] blur-[130px]"
            style={{ background: "#159F63" }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between">
            {/* Heading */}
            <div className="animate-fade-up delay-0 max-w-xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#159F63]">
                Get started today
              </p>
              <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl">
                Your financial future<br className="hidden sm:block" />
                starts here.
              </h2>
              <p className="mt-5 text-base font-medium text-zinc-400 max-w-md">
                Join thousands of Pakistanis who are learning to invest smarter,
                budget better, and build lasting wealth — for free.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="animate-fade-up delay-150 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
              <Button
                size="lg"
                className="group rounded-full bg-[#159F63] px-9 py-6 text-[15px] font-semibold text-white shadow-xl shadow-[#159F63]/20 hover:bg-[#128a54] hover:scale-[1.03] hover:shadow-[#159F63]/40 transition-all duration-300"
                asChild
              >
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-9 py-6 text-[15px] font-semibold text-white border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-[1.02]"
                asChild
              >
                <Link href="/demo">View Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer proper ── */}
      <footer className="w-full border-t border-zinc-100 bg-white px-6 py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16">

            {/* Brand column */}
            <div className="flex flex-col gap-6 lg:max-w-xs">
              <Link href="/" className="inline-block w-fit">
                <Image
                  src="/logo.png"
                  alt="Finasaan"
                  width={180}
                  height={40}
                  className="h-9 w-auto object-contain"
                />
              </Link>
              <p className="text-sm leading-relaxed text-zinc-500">
                AI-powered financial literacy, built for Pakistan. Learn,
                invest, and plan — at your own pace.
              </p>
              <a
                href="mailto:hello@finasaan.com"
                className="text-sm font-semibold text-[#159F63] hover:text-[#0A6C41] transition-colors w-fit"
              >
                hello@finasaan.com
              </a>

              {/* Socials */}
              <div className="flex items-center gap-3 mt-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-all duration-200 hover:border-[#159F63] hover:text-[#159F63] hover:scale-105"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            <div className="flex flex-wrap gap-12">
              {footerLinks.map((section) => (
                <div key={section.title} className="flex min-w-[100px] flex-col gap-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                    {section.title}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-14 border-t border-zinc-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-zinc-400">
              © {new Date().getFullYear()} Finasaan. All rights reserved.
            </p>
            <p className="text-sm text-zinc-400">Built for Pakistan.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomeFooter;
