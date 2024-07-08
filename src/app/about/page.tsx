import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import MemberProfile, { MemberProfileType } from "./_components/MemberProfile";
import { getMembers } from "./fetch";
import { Roboto_Condensed, Roboto_Flex } from "next/font/google";
import SpecialEffectSentence from "@/components/effects/SpecialEffectSentence";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
    title: "Who we are - Radice",
    description: "Radice About Page",
};
const roboto_condensed = Roboto_Condensed({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
});

export default async function page() {
    const fetchMembers = await getMembers();

    if (!fetchMembers.success) return;
    const members = fetchMembers.data.members;
    const executive: MemberProfileType[] = [
        {
            firstName: "Bradley Jensen",
            lastName: "MURG",
            profileUrl: "/bradley.jpg",
            title: "Rector",
            email: "bmurg@paragoniu.edu.kh",
            description:
                "Dr. Bradley J. Murg is Interim Rector and Provost at Paragon International University.",
        },
    ];

    const advisors: MemberProfileType[] = [
        {
            firstName: "Neil IAN",
            lastName: "UY",
            profileUrl: "/neil.jpg",
            title: "Consultant",
            email: "nuy@paragoniu.edu.kh",
            description:
                "Neil Ian Cadungog-Uy graduated with a Bachelor of Science Degree in Information Technology at Negros Oriental State University. He is also a co-founder of Radice and professor at Paragon International University.",
        },
        {
            firstName: "Ratana",
            lastName: "Soth",
            profileUrl: "/ratana_soth.png",
            email: "rsoth@paragoniu.edu.kh",
            title: "Director",
            description:
                "Ratana Soth is the director and co-founder of Radice. He is also a professor at Paragon International University.",
        },
    ];

    return (
        <div>
            <Navbar />
            <div className="container mx-auto py-12">
                <h1
                    className={`text-center font-bold text-6xl pb-8 ${roboto_condensed.className}`}
                >
                    Who We Are
                </h1>
                <p className="text-center mx-auto max-w-[800px]">
                    At Radice, we are a dynamic hub of innovation and
                    exploration, dedicated to revolutionizing the landscape of
                    research and development. Our journey is defined by a rich
                    tapestry of achievements, where each milestone represents a
                    testament to our unwavering commitment to excellence. With a
                    history steeped in collaboration, ingenuity, and forward
                    thinking, we stand at the forefront of cutting-edge
                    solutions that shape the future. Our core values of
                    integrity, creativity, and impact drive every endeavor,
                    propelling us towards a horizon of endless possibilities. As
                    we navigate the ever-evolving realm of research and
                    development, our mission remains clear: to inspire,
                    innovate, and leave a lasting legacy of progress for
                    generations to come.
                </p>
            </div>
            <div className="bg-black text-white py-12">
                <h1
                    className={`text-center font-bold text-6xl pb-8 ${roboto_condensed.className}`}
                >
                    Executive Board
                </h1>
                <div className="flex justify-center gap-8 mt-4">
                    {executive.map((member, i) => {
                        return (
                            <MemberProfile
                                key={member.email + i}
                                member={member}
                                variant="dark"
                                useTitle
                            />
                        );
                    })}
                </div>
            </div>
            <div className="mx-auto py-12 max-w-[1200px]">
                <h1
                    className={`text-center font-bold text-6xl pb-8 ${roboto_condensed.className}`}
                >
                    Co-Founders
                </h1>
                <div className="flex justify-center gap-8 mt-4">
                    {advisors.map((adivsor, i) => {
                        return (
                            <MemberProfile
                                key={adivsor.email + i}
                                member={adivsor}
                                variant="light"
                                useTitle
                            />
                        );
                    })}
                </div>
            </div>
            {members.length > 0 && (
                <div className="mx-auto pb-12 max-w-[1200px]">
                    <h1
                        className={`text-center font-bold text-6xl pb-8 ${roboto_condensed.className}`}
                    >
                        Our Members
                    </h1>
                    <div className="flex justify-center gap-8 mt-4">
                        {members.map((member, i) => {
                            return (
                                <MemberProfile
                                    key={member.id}
                                    member={member}
                                    variant="light"
                                />
                            );
                        })}
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}
