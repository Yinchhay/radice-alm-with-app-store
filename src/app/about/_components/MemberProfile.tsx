"use client";
import ImageWithFallback from "@/components/ImageWithFallback";
import GridRevealImage from "@/components/effects/GridRevealImage";
import ScrollReveal from "@/components/effects/ScrollReveal";
import SpecialEffectSentence from "@/components/effects/SpecialEffectSentence";
import { Roboto_Condensed, Roboto_Flex } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export interface MemberProfileType {
    firstName: string;
    lastName: string;
    profileUrl: string;
    title?: string;
    email: string;
    description: string;
}

const roboto_condensed = Roboto_Condensed({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
});
const roboto_flex = Roboto_Flex({ subsets: ["latin"] });

export default function MemberProfile({
    member,
    variant,
    useTitle = false,
}: {
    useTitle?: boolean;
    member: any;
    variant: string;
}) {
    const [reveal, setReveal] = useState(false);

    switch (variant) {
        case "light":
            return (
                <div className="flex flex-col items-center w-[400px]">
                    <Link
                        href={`/member/${member.id}`}
                        className="w-[180px] h-[220px] relative"
                    >
                        <ScrollReveal
                            onReveal={() => {
                                console.log("reveal");
                                setReveal(true);
                            }}
                        >
                            <GridRevealImage
                                variant="light"
                                isAlphabet={false}
                                canReveal={reveal}
                                src={
                                    member.profileUrl
                                        ? member.profileUrl
                                        : "/wrath.jpg"
                                }
                                cols={9}
                                rows={11}
                                width={180}
                                height={220}
                                revealDelay={8}
                                fill
                                className="object-cover"
                            />
                        </ScrollReveal>
                    </Link>
                    <h1
                        className={`font-bold text-xl mt-2 ${roboto_flex.className}`}
                    >
                        {member.firstName + " " + member.lastName}
                    </h1>
                    <h2 className={`${roboto_flex.className}`}>
                        {useTitle ? member.title : member.email}
                    </h2>
                    <p className="text-sm text-center">{member.description}</p>
                </div>
            );
        case "dark":
            return (
                <div className="flex flex-col items-center w-[400px]">
                    <div className="w-[180px] h-[220px] relative">
                        <ImageWithFallback
                            alt=""
                            src={
                                member.profileUrl
                                    ? member.profileUrl
                                    : "/wrath.jpg"
                            }
                            fill
                            className="object-cover"
                        />
                    </div>
                    <h1
                        className={`font-bold text-xl mt-2 ${roboto_flex.className}`}
                    >
                        {member.firstName + " " + member.lastName}
                    </h1>
                    <h2
                        className={`font-bold ${roboto_condensed.className} text-lg`}
                    >
                        {useTitle ? member.title : member.email}
                    </h2>
                    <p className="text-sm text-center text-gray-200">
                        {member.description}
                    </p>
                </div>
            );
    }
}
