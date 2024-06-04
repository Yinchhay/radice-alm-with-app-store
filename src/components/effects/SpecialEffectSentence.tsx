"use client";
import { useEffect, useState, useRef } from "react";

export default function SpecialEffectSentence({
    originalText,
    className,
    shuffleSpeed = 35,
    delay = 750,
    randomAmount = 3,
    canStart = true,
}: {
    originalText: string;
    className?: string;
    shuffleSpeed?: number;
    delay?: number;
    randomAmount?: number;
    canStart?: boolean;
}) {
    const alphabets = "abcdefghijklmnopqrstuvwxyz";
    const [first, setFirst] = useState(false);
    const [text, setText] = useState("");
    const [count, setCount] = useState(0);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    function getRandomWord(word: string) {
        return word
            .split("")
            .map(() =>
                alphabets.charAt(Math.floor(Math.random() * alphabets.length)),
            )
            .join("");
    }

    function randomizeText() {
        const words = originalText.split(" ");
        const randomizedWords = words.map((word) => getRandomWord(word));
        setText(randomizedWords.join(" "));
    }

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (text.length === 0 && canStart) {
            randomizeText();
        }

        if (!first && canStart) {
            timeoutRef.current = setTimeout(() => setFirst(true), delay);
        }

        if (text !== originalText && first && canStart) {
            timeoutRef.current = setTimeout(() => {
                randomizeText();
                setCount(count + 1);
                if (count >= randomAmount) {
                    setText(originalText);
                    setFirst(false);
                    setCount(0);
                }
            }, shuffleSpeed);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [text, first, count, originalText, canStart]);

    useEffect(() => {
        randomizeText();
        setFirst(false);
        setCount(0);
    }, [originalText]);

    return <span className={className}>{text}</span>;
}
