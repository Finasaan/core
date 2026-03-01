import Image from "next/image";

interface ChoiceCardProps {
    icon: string;
    title: string;
    description: string;
    selected?: boolean;
    onClick?: () => void;
    iconWidth?: number;
    iconHeight?: number;
}

export function ChoiceCard({
    icon,
    title,
    description,
    selected = false,
    onClick,
    iconWidth = 120,
    iconHeight = 120,
}: ChoiceCardProps) {
    return (
        <button
            type="button"
            className={`choice-card ${selected ? "choice-card-selected" : ""}`}
            onClick={onClick}
            aria-pressed={selected}
        >
            <div className="choice-card-icon">
                <Image
                    src={icon}
                    alt={title}
                    width={iconWidth}
                    height={iconHeight}
                    priority
                />
            </div>
            <div className="choice-card-text">
                <h3 className="choice-card-title">{title}</h3>
                <p className="choice-card-description">{description}</p>
            </div>
        </button>
    );
}
