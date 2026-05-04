import Image from "next/image";

interface LogoProps {
    variant?: "light" | "dark";
    className?: string;
}

export function Logo({ variant = "dark", className }: LogoProps) {
    return (
        <Image
            src="/logodark.svg"
            alt="Finasaan"
            width={152}
            height={32}
            className={className}
            priority
        />
    );
}
