import GridRevealImage from "@/components/effects/GridRevealImage";
import ImageWithFallback from "@/components/ImageWithFallback";

export default function CategoryProjectLogo({
    src,
    variant = "light",
}: {
    src: string;
    variant?: "light" | "dark" | "hacker";
}) {
    return (
        <div className="relative">
            <GridRevealImage
                isAlphabet={true}
                variant={variant}
                src={src}
                width={120}
                height={120}
                rows={5}
                cols={5}
                revealSpeed={8}
                className={[
                    "aspect-square object-cover border relative z-10",
                    variant == "light"
                        ? "border-gray-200"
                        : "border-gray-100/25",
                ].join(" ")}
            />
        </div>
    );
}
