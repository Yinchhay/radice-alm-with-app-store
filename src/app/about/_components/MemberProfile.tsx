"use client";
import GridRevealImage from "@/components/effects/GridRevealImage";
import ScrollReveal from "@/components/effects/ScrollReveal";
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
                <Link
                    href={`/member/${member.id}`}
                    className="flex flex-col items-center w-[400px]"
                >
                    <div className="w-[180px] h-[220px] relative">
                        <ScrollReveal
                            onReveal={() => {
                                setReveal(true);
                            }}
                        >
                            <GridRevealImage
                                variant="light"
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
                                fill
                                className="object-cover"
                            />
                        </ScrollReveal>
                    </div>
                    <h1
                        className={`font-bold text-xl mt-2 ${roboto_flex.className}`}
                    >
                        {member.firstName + " " + member.lastName}
                    </h1>
                    <h2 className={`font-bold ${roboto_flex.className}`}>
                        {useTitle ? member.title : member.email}
                    </h2>
                    <p className="text-sm text-center text-gray-800">
                        {member.description}
                    </p>
                </Link>
            );
        case "dark":
            return (
                <div className="flex flex-col items-center w-[400px]">
                    <div className="w-[180px] h-[220px] relative">
                        <ScrollReveal
                            onReveal={() => {
                                setReveal(true);
                            }}
                        >
                            <GridRevealImage
                                variant="light"
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
                                cellFadeSpeed={150}
                                fill
                                className="object-cover"
                            />
                        </ScrollReveal>
                    </div>
                    <h1
                        className={`font-bold text-xl mt-2 ${roboto_flex.className}`}
                    >
                        {member.firstName + " " + member.lastName}
                    </h1>
                    <h2 className={`font-bold ${roboto_flex.className}`}>
                        {useTitle ? member.title : member.email}
                    </h2>
                    <p className="text-sm text-center text-gray-200">
                        {member.description}
                    </p>
                </div>
            );
    }
}
