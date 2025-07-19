"use client";
import ImageWithFallback from "@/components/ImageWithFallback";
import GridRevealImage from "@/components/effects/GridRevealImage";
import ScrollReveal from "@/components/effects/ScrollReveal";
import SpecialEffectSentence from "@/components/effects/SpecialEffectSentence";
import { fileToUrl } from "@/lib/file";
import { UserType } from "@/types/user";
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
    userType = "member",
    customTitle = "",
}: {
    useTitle?: boolean;
    member: any;
    variant: string;
    userType?: "member" | "partner";
    customTitle?: string;
}) {
    const [reveal, setReveal] = useState(false);

    switch (variant) {
        case "light":
            return (
                <div className="flex flex-col items-center w-[250px]">
                    <Link
                        href={`/${userType}/${member.id}`}
                        className="relative"
                        style={{
                            width: 180,
                            height: userType === UserType.PARTNER ? 180 : 240,
                        }}
                        target="_blank"
                    >
                        <ScrollReveal
                            onReveal={() => {
                                //console.log("reveal");
                                setReveal(true);
                            }}
                        >
                            <GridRevealImage
                                variant="light"
                                isAlphabet={false}
                                canReveal={reveal}
                                src={fileToUrl(
                                    member.profileUrl,
                                    userType === UserType.PARTNER
                                        ? "/placeholders/logo_placeholder.png"
                                        : "/placeholders/missing-profile.png",
                                )}
                                cols={userType === UserType.PARTNER ? 8 : 9}
                                rows={userType === UserType.PARTNER ? 8 : 11}
                                width={180}
                                height={
                                    userType === UserType.PARTNER ? 180 : 240
                                }
                                revealDelay={6}
                                fill
                                className={
                                    userType == "member"
                                        ? "object-cover"
                                        : "object-contain"
                                }
                            />
                        </ScrollReveal>
                    </Link>
                    <h1
                        className={`font-bold text-xl mt-2 ${roboto_flex.className} text-center`}
                    >
                        {member.firstName + " " + member.lastName}
                    </h1>
                    <h2
                        className={
                            useTitle
                                ? `font-bold ${roboto_condensed.className} text-lg leading-[0.9] mb-2 text-center`
                                : "text-sm text-center"
                        }
                    >
                        {useTitle
                            ? customTitle.length > 0
                                ? customTitle
                                : member.title || ""
                            : member.email || ""}
                    </h2>
                    <p className="text-sm text-center">{member.description}</p>
                </div>
            );
        case "dark":
            return (
                <div className="flex flex-col items-center w-[250px]">
                    <Link
                        href={`/${userType}/${member.id}`}
                        className="w-[180px] h-[240px] relative"
                        target="_blank"
                    >
                        <ScrollReveal
                            onReveal={() => {
                                //console.log("reveal");
                                setReveal(true);
                            }}
                        >
                            <GridRevealImage
                                variant="light"
                                isAlphabet={false}
                                canReveal={reveal}
                                src={fileToUrl(
                                    member.profileUrl,
                                    "/placeholders/missing-profile.png",
                                )}
                                cols={9}
                                rows={11}
                                width={180}
                                height={240}
                                revealDelay={6}
                                fill
                                className="object-cover"
                            />
                        </ScrollReveal>
                    </Link>
                    <h1
                        className={`font-bold text-xl mt-2 ${roboto_flex.className} text-center`}
                    >
                        {member.firstName + " " + member.lastName}
                    </h1>
                    <h2
                        className={
                            useTitle
                                ? `font-bold ${roboto_condensed.className} text-lg leading-[0.9]  mb-2 text-center`
                                : "text-sm"
                        }
                    >
                        {useTitle
                            ? customTitle.length > 0
                                ? customTitle
                                : member.title || ""
                            : member.email || ""}
                    </h2>
                    <p className="text-sm text-center text-gray-200">
                        {member.description}
                    </p>
                </div>
            );
    }
}
