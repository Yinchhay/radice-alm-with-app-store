"use client";
import { useEffect, useState, useRef } from "react";

export default function SpecialEffectText({
    originalText,
    className,
    shuffleSpeed = 35,
    delay = 750,
    randomAmount = 3,
}: {
    originalText: string;
    className?: string;
    shuffleSpeed?: number;
    delay?: number;
    randomAmount?: number;
}) {
    const alphabets = "abcdefghijklmnopqrstuvwxyz";
    const [first, setFirst] = useState(false);
    const [text, setText] = useState("");
    const [index, setIndex] = useState(0);
    const [count, setCount] = useState(0);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    function randomOneByOne() {
        if (count < randomAmount) {
            if (count == 0) {
                setText(
                    text + alphabets.charAt(Math.floor(Math.random() * 26)),
                );
            } else {
                setText(
                    text.slice(0, -1) +
                        alphabets.charAt(Math.floor(Math.random() * 26)),
                );
            }

            setCount(count + 1);
        } else {
            setText(text.slice(0, -1) + originalText.charAt(index));
            setIndex(index + 1);
            setCount(0);
        }
    }

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (text.length === 0) {
            let randText = "";
            for (let i = 0; i < originalText.length; i++) {
                let isUpper = Math.floor(Math.random() * 2);
                if (isUpper) {
                    randText += alphabets
                        .charAt(Math.floor(Math.random() * alphabets.length))
                        .toUpperCase();
                } else {
                    randText += alphabets
                        .charAt(Math.floor(Math.random() * alphabets.length))
                        .toUpperCase();
                }
            }
            setText(randText);
        }

        if (!first) {
            timeoutRef.current = setTimeout(() => setFirst(true), delay);
        }

        if (text !== originalText && first) {
            timeoutRef.current = setTimeout(() => {
                if (count < randomAmount) {
                    let newStringArray = text.split("");
                    let isUpper = Math.floor(Math.random() * 2);
                    if (isUpper) {
                        newStringArray[index] = alphabets
                            .charAt(
                                Math.floor(Math.random() * alphabets.length),
                            )
                            .toUpperCase();
                    } else {
                        newStringArray[index] = alphabets
                            .charAt(
                                Math.floor(Math.random() * alphabets.length),
                            )
                            .toUpperCase();
                    }
                    setText(newStringArray.join(""));
                    setCount(count + 1);
                } else {
                    let newStringArray = text.split("");
                    newStringArray[index] = originalText.charAt(index);
                    setText(newStringArray.join(""));
                    setIndex(index + 1);
                    setCount(0);
                }
            }, shuffleSpeed);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [count, text, index, first, originalText]);

    useEffect(() => {
        setText("");
        setIndex(0);
        setFirst(false);
        setCount(0);
    }, [originalText]);

    return <span className={className}>{text}</span>;
}
