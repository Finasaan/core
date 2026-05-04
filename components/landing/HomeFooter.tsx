import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Facebook, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Topics", href: "#topics" },
      { label: "Features", href: "#features" },
      { label: "Security", href: "#security" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "mailto:hello@finasaan.com" },
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
      <section className="relative w-full overflow-hidden bg-[#0D1F17] px-6 py-28 sm:px-8 lg:px-16">
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden
        >
          <div
            className="h-[600px] w-[600px] rounded-full opacity-[0.14] blur-[140px]"
            style={{ background: "#159F63" }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="animate-fade-up delay-0 max-w-2xl">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#159F63]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#159F63]" />
                Get started today
              </span>
              <h2 className="mt-3 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.75rem]">
                Ready to take control
                <br className="hidden sm:block" />
                of your finances?
              </h2>
              <p className="mt-6 max-w-md text-base font-medium text-zinc-400">
                Join early access to Finasaan and start making better money
                decisions today — for free.
              </p>
            </div>

            <div className="animate-fade-up delay-150 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:w-auto">
              <Button
                size="lg"
                className="group h-12 rounded-full bg-[#159F63] px-7 text-[15px] font-semibold text-white shadow-xl shadow-[#159F63]/20 transition-all duration-300 hover:scale-[1.02] hover:bg-[#128a54] hover:shadow-[#159F63]/40"
                asChild
              >
                <Link href="/signup">
                  Get started
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-white/20 bg-white/5 px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/10"
                asChild
              >
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer proper ── */}
      <footer className="w-full border-t border-zinc-100 bg-white px-4 py-12 sm:px-8 sm:py-16 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16">
            <div className="flex flex-col gap-6 lg:max-w-sm">
              <Link href="/" className="inline-block w-fit">
                <Image
                  src="/logodark.svg"
                  alt="Finasaan"
                  width={424}
                  height={161}
                  className="h-7 w-auto object-contain"
                />
              </Link>
              <p className="text-sm leading-relaxed text-zinc-500">
                From budgeting to investing, Finasaan helps you understand where
                your money goes — and how to make it work harder for you. Built
                for Pakistan, designed for real life.
              </p>
              <a
                href="mailto:hello@finasaan.com"
                className="w-fit text-sm font-semibold text-[#159F63] transition-colors hover:text-[#0A6C41]"
              >
                hello@finasaan.com
              </a>

              <div className="mt-2 flex items-center gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-all duration-200 hover:scale-105 hover:border-[#159F63] hover:text-[#159F63]"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-14">
              {footerLinks.map((section) => (
                <div key={section.title} className="flex flex-col gap-5">
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

          <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-zinc-100 pt-8 sm:flex-row">
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
