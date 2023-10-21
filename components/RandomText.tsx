"use client";
import Image from "next/image";
import { Roboto_Condensed, Roboto_Flex, Roboto } from "next/font/google";
import { useEffect, useState } from "react";
const roboto_condensed = Roboto_Condensed({
    weight: "700",
    subsets: ["latin"],
});
const roboto_flex = Roboto_Flex({ subsets: ["latin"] });
const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"] });

export default function RandomText({ originalText }: { originalText: string }) {
    const alphabets = "abcdefghijklmnopqrstuvwxyz";
    const randomAmount = 3;
    const delay = 500;
    const randomSpeed = 35;
    const [first, setFirst] = useState(false);
    const [text, setText] = useState("");
    const [index, setIndex] = useState(0);
    const [count, setCount] = useState(0);

    function randomOneByOne() {
        if (count < randomAmount) {
            if (count == 0) {
                setText(
                    text + alphabets.charAt(Math.floor(Math.random() * 26))
                );
            } else {
                setText(
                    text.slice(0, -1) +
                        alphabets.charAt(Math.floor(Math.random() * 26))
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
        if (text.length == 0) {
            let randText = "";
            for (let i = 0; i < originalText.length; i++) {
                let isUpper = Math.floor(Math.random() * 2);
                if (isUpper) {
                    randText += alphabets
                        .charAt(Math.floor(Math.random() * alphabets.length))
                        .toUpperCase();
                } else {
                    randText += alphabets.charAt(
                        Math.floor(Math.random() * alphabets.length)
                    );
                }
            }
            setText(randText);
        }
        if (!first) {
            setTimeout(() => setFirst(true), delay);
        }
        if (text != originalText && first) {
            setTimeout(() => {
                if (count < randomAmount) {
                    let newStringArray = text.split("");
                    let isUpper = Math.floor(Math.random() * 2);
                    if (isUpper) {
                        newStringArray[index] = alphabets
                            .charAt(
                                Math.floor(Math.random() * alphabets.length)
                            )
                            .toUpperCase();
                    } else {
                        newStringArray[index] = alphabets.charAt(
                            Math.floor(Math.random() * alphabets.length)
                        );
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
            }, randomSpeed);
        }
    }, [count, text, index, first, originalText]);
    return <div>{text}</div>;
}
