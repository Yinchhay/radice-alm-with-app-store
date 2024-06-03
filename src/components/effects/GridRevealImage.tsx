"use client";
import { v4 as uuidv4 } from "uuid";
import ImageWithFallback from "../ImageWithFallback";
import { useEffect, useState } from "react";

function getRandomBinary(): number {
    return Math.floor(Math.random() * 2);
}

function getRandomAlphabet(): string {
    const uppercaseAlphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseAlphabets = "abcdefghijklmnopqrstuvwxyz";

    // Generate a random number between 0 and 2
    const randomType = Math.floor(Math.random() * 3);

    if (randomType === 0) {
        // Return a random uppercase letter (1/3 probability)
        const randomIndex = Math.floor(
            Math.random() * uppercaseAlphabets.length,
        );
        return uppercaseAlphabets[randomIndex];
    } else {
        // Return a random lowercase letter (2/3 probability)
        const randomIndex = Math.floor(
            Math.random() * lowercaseAlphabets.length,
        );
        return lowercaseAlphabets[randomIndex];
    }
}

export default function GridRevealImage({
    src,
    width,
    height,
    className = "",
    alt = "",
    rows = 10,
    cols = 10,
    cellFadeSpeed = 200,
    revealSpeed = 5,
    variant = "hacker",
    isAlphabet = true,
    canReveal = false,
    fill = false,
}: {
    src: string;
    width: number;
    height: number;
    className?: string;
    alt?: string;
    rows?: number;
    cols?: number;
    cellFadeSpeed?: number;
    revealSpeed?: number;
    variant?: "hacker" | "light" | "dark";
    isAlphabet?: boolean;
    canReveal?: boolean;
    fill?: boolean;
}) {
    const [canPlay, setCanPlay] = useState("paused");

    useEffect(() => {
        if (canReveal) {
            setCanPlay("running");
        } else {
            setCanPlay("paused");
        }
    }, [canReveal]);

    const getVariantClasses = () => {
        switch (variant) {
            case "hacker":
                return "bg-black text-green-500";
            case "light":
            case "dark":
                return "bg-black text-white";
            default:
                return "";
        }
    };

    return (
        <div className={`relative w-[${width}px] h-[${height}px]`}>
            <ImageWithFallback
                fill={fill}
                src={src}
                width={fill ? undefined : width}
                height={fill ? undefined : height}
                alt={alt}
                className={className}
            />
            <div
                className="absolute top-0 left-0 z-10 grid select-none pointer-events-none grid-flow-col"
                style={{
                    width,
                    height,
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                }}
            >
                {Array.from({ length: rows * cols }).map((_, i) => (
                    <div
                        key={uuidv4()}
                        className={`transition-colors text-sm text-center ${getVariantClasses()}`}
                        style={{
                            animationPlayState: canPlay,
                            animationName: "fadeOut",
                            animationDuration: `${cellFadeSpeed}ms`,
                            animationDelay: `${i * revealSpeed}ms`,
                            animationFillMode: "forwards",
                        }}
                    >
                        {isAlphabet ? getRandomAlphabet() : getRandomBinary()}
                    </div>
                ))}
            </div>
        </div>
    );
}
