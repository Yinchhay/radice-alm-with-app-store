"use client";
import GridRevealImage from "@/components/effects/GridRevealImage";
import ScrollReveal from "@/components/effects/ScrollReveal";
import ImageWithFallback from "@/components/ImageWithFallback";
import { useState } from "react";

export default function CategoryProjectLogo({
    src,
    variant = "light",
}: {
    src: string;
    variant?: "light" | "dark" | "hacker";
}) {
    const [canReveal, setCanReveal] = useState(false);
    return (
        <ScrollReveal
            onReveal={() => {
                console.log("reveal");
                setCanReveal(true);
            }}
        >
            <div className="relative">
                <GridRevealImage
                    canReveal={canReveal}
                    isAlphabet={false}
                    variant={variant}
                    src={src}
                    width={160}
                    height={160}
                    rows={5}
                    cols={5}
                    revealDelay={12}
                    className={[
                        "aspect-square object-cover border relative z-10",
                        variant == "light"
                            ? "border-gray-300"
                            : "border-gray-100/25",
                    ].join(" ")}
                />
                <div className="w-[160px] h-[160px] border border-black absolute top-2 left-2"></div>
            </div>
        </ScrollReveal>
    );
}
