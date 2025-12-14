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
            <div className="auth-hero-logo">
                <Image
                    src="/loginlogo.png"
                    alt="Finasaan"
                    width={152}
                    height={48}
                    priority
                />
            </div>

            <div className="auth-hero-content">
                <h2 className="auth-hero-tagline">{tagline}</h2>
                <p className="auth-hero-testimonial">{testimonial}</p>
            </div>

            <div className="auth-hero-glow" aria-hidden="true" />
        </aside>
    );
}
