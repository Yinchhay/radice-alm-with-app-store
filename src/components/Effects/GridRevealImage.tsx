"use client";
import { v4 as uuidv4 } from "uuid";

import ImageWithFallback from "../ImageWithFallback";
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
}) {
    return (
        <div className="relative">
            <ImageWithFallback
                src={src}
                width={width}
                height={height}
                className={className}
                alt={alt}
            />
            <div
                className={[
                    `w-[${width}px]`,
                    `h-[${height}px]`,
                    "absolute top-0 left-0 z-10 grid select-none pointer-events-none grid-flow-col",
                ].join(" ")}
                style={{
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                }}
            >
                {Array.from({ length: rows * cols }).map((_, i) => (
                    <div
                        key={uuidv4()}
                        className={[
                            "transition-colors text-sm text-center",
                            variant == "hacker"
                                ? "bg-black text-green-500"
                                : "",
                            variant == "light" || variant == "dark"
                                ? "bg-black text-white"
                                : "",
                        ].join(" ")}
                        style={{
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
