"use client";
import { v4 as uuidv4 } from "uuid";
import ImageWithFallback from "../ImageWithFallback";
import { useEffect, useState } from "react";

export default function GridRevealImage({
    src,
    width,
    height,
    className = "",
    alt = "",
    rows = 10,
    cols = 10,
    cellFadeSpeed = 200,
    revealDelay = 5,
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
    revealDelay?: number;
    variant?: "hacker" | "light" | "dark";
    isAlphabet?: boolean;
    canReveal?: boolean;
    fill?: boolean;
}) {
    const [randomContent, setRandomContent] = useState<string[]>([]);

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

    useEffect(() => {
        // Generate random content on the client side
        const content = Array.from({ length: rows * cols }).map(() =>
            isAlphabet ? getRandomAlphabet() : getRandomBinary().toString(),
        );
        setRandomContent(content);
    }, [isAlphabet, rows, cols, src]);

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

    function getPlayState(canReveal: boolean) {
        if (canReveal) {
            return "running";
        } else {
            return "paused";
        }
    }

    return (
        <div className={`relative w-[${width}px] h-[${height}px]`}>
            <ImageWithFallback
                fill={fill}
                src={src}
                width={fill ? undefined : width}
                height={fill ? undefined : height}
                alt={alt}
                className={[className, canReveal ? " " : " brightness-0"].join(
                    " ",
                )}
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
                {randomContent.map((content, i) => (
                    <div
                        key={uuidv4()}
                        className={`transition-colors text-sm text-center ${getVariantClasses()}`}
                        style={{
                            animationPlayState: getPlayState(canReveal),
                            animationName: "fadeOut",
                            animationDuration: `${cellFadeSpeed}ms`,
                            animationDelay: `${i * revealDelay}ms`,
                            animationFillMode: "forwards",
                        }}
                    >
                        {content}
                    </div>
                ))}
            </div>
        </div>
    );
}
