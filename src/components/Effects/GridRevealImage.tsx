"use client";
import { v4 as uuidv4 } from "uuid";

import ImageWithFallback from "../ImageWithFallback";
import { useEffect, useRef, useState } from "react";

export default function GridRevealImage({
    src,
    width,
    height,
    className = "",
    alt = "",
    rows = 10,
    cols = 10,
    revealSpeed = 10, // Default reveal speed in milliseconds
}: {
    src: string;
    width: number;
    height: number;
    className?: string;
    alt?: string;
    rows?: number;
    cols?: number;
    revealSpeed?: number; // New prop for reveal speed
}) {
    const [currentCell, setCurrentCell] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        let cell = 0;
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        if (currentCell < rows * cols && intervalRef.current) {
            intervalRef.current = setInterval(() => {
                cell++;
                setCurrentCell(cell);
                if (currentCell >= rows * cols) {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                }
            }, revealSpeed);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [src]);

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
                    "absolute top-0 left-0 z-10 grid",
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
                            "bg-white transition-all opacity-100",
                            i <= currentCell ? "opacity-0" : "",
                        ].join(" ")}
                    ></div>
                ))}
            </div>
        </div>
    );
}
