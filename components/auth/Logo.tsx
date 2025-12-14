import Image from "next/image";

interface LogoProps {
    variant?: "light" | "dark";
    className?: string;
}

export function Logo({ variant = "dark", className }: LogoProps) {
    return (
        <Image
            src="/logo.png"
            alt="Finasaan"
            width={152}
            height={32}
            className={className}
            style={{
                filter: variant === "light" ? "brightness(0) invert(1)" : "none",
            }}
            priority
        />
    );
}
