import GridRevealImage from "@/components/Effects/GridRevealImage";
import ImageWithFallback from "@/components/ImageWithFallback";

export default function CategoryProjectLogo({
    src,
    variant = "light",
}: {
    src: string;
    variant?: string;
}) {
    return (
        <div className="relative">
            <GridRevealImage
                src={src}
                width={120}
                height={120}
                className="aspect-square object-cover border border-gray-200 relative z-10"
            />
            <div
                className={[
                    "w-[120px] h-[120px] absolute top-2 left-2 border  bg-transparent",
                    variant == "light" ? "border-black" : "border-white",
                ].join(" ")}
            ></div>
        </div>
    );
}
