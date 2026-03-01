import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  {
    title: "Quick Links",
    links: [{ label: "Home", href: "/" }],
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
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

const HomeFooter = () => {
  return (
    <footer className="w-full border-t border-gray-100 bg-white px-[7.5%] py-16 lg:px-[10%]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 lg:flex-row lg:gap-20">
        {/* Brand column */}
        <div className="flex flex-col gap-6 lg:w-1/2">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Finasaan"
              width={152}
              height={32}
              style={{ objectFit: "contain", width: "auto", height: "2rem" }}
            />
          </Link>

          <p className="max-w-sm text-sm leading-relaxed text-gray-500">
            Finasaan is your AI-guided companion for mastering personal finance
            in Pakistan. Build confidence with money, invest wisely, and take
            control of your financial future.
          </p>

          {/* Social links */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-gray-700">Follow Us</p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-[#159F63] hover:text-[#159F63]"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Link columns */}
        <div className="flex flex-wrap gap-12 lg:w-1/2 lg:justify-end">
          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <p className="text-sm font-semibold text-gray-800">
                {section.title}
              </p>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 transition-colors hover:text-[#159F63]"
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
      <div className="mx-auto mt-12 w-full max-w-7xl border-t border-gray-100 pt-6">
        <p className="text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Finasaan. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default HomeFooter;
