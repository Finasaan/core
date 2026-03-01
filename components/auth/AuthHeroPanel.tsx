import Image from "next/image";

interface AuthHeroPanelProps {
    tagline?: string;
    testimonial?: string;
}

export function AuthHeroPanel({
    tagline = "Learn. Invest. Grow",
    testimonial = '"Finasaan transformed how I think about money. The lessons are simple yet powerful."',
}: AuthHeroPanelProps) {
    return (
        <aside className="auth-hero-panel">
            {/* Plain img — no Next.js wrapper divs that escape border-radius clipping */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/original.jpg"
                alt=""
                className="auth-hero-image"
            />

            {/* Dark gradient overlay */}
            <div className="auth-hero-overlay" aria-hidden="true" />

            {/* Logo */}
            <div className="auth-hero-logo">
                <Image
                    src="/loginlogo.png"
                    alt="Finasaan"
                    width={140}
                    height={44}
                    priority
                />
            </div>

            {/* Bottom content */}
            <div className="auth-hero-content">
                <h2 className="auth-hero-tagline">{tagline}</h2>
                <p className="auth-hero-testimonial">{testimonial}</p>
            </div>
        </aside>
    );
}
