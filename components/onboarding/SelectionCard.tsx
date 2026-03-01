import Image from "next/image";

interface SelectionCardProps {
    icon: string;
    title: string;
    description: string;
    selected?: boolean;
    onClick?: () => void;
}

export function SelectionCard({
    icon,
    title,
    description,
    selected = false,
    onClick,
}: SelectionCardProps) {
    return (
        <button
            type="button"
            className={`selection-card ${selected ? "selection-card-selected" : ""}`}
            onClick={onClick}
            aria-pressed={selected}
        >
            <div className="selection-card-icon">
                <Image
                    src={icon}
                    alt={title}
                    width={80}
                    height={80}
                    priority
                />
            </div>
            <div className="selection-card-text">
                <h3 className="selection-card-title">{title}</h3>
                <p className="selection-card-description">{description}</p>
            </div>
        </button>
    );
}
