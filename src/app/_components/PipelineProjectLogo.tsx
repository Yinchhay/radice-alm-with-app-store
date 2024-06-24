"use client";
import GridRevealImage from "@/components/effects/GridRevealImage";
import ScrollReveal from "@/components/effects/ScrollReveal";
import ImageWithFallback from "@/components/ImageWithFallback";
import { useState } from "react";

export default function PipelineProjectLogo({ src }: { src: string }) {
    const [canReveal, setCanReveal] = useState(false);
    return (
        <ScrollReveal
            onReveal={() => {
                //console.log("reveal");
                setCanReveal(true);
            }}
        >
            <div className="relative">
                <GridRevealImage
                    canReveal={canReveal}
                    isAlphabet={false}
                    src={src}
                    width={100}
                    height={100}
                    rows={5}
                    cols={5}
                    revealDelay={12}
                    className="aspect-square object-cover border relative z-10 border-gray-300 hover:scale-90 duration-200"
                />
            </div>
        </ScrollReveal>
    );
}
