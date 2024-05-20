import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import MemberProfile, { MemberProfileType } from "./_components/MemberProfile";
import { getMembers } from "./fetch";

export default async function page() {
    const members = await getMembers();

    const advisors: MemberProfileType[] = [
        {
            firstName: "Neil IAN",
            lastName: "UY",
            profileURL: "/neil.jpg",
            email: "nuy@paragoniu.edu.kh",
            description:
                "Neil Ian Cadungog-Uy graduated with a Bachelor of Science Degree in Information Technology at Negros Oriental State University, Dumaguete City, Philippines.",
        },
        {
            firstName: "Ratana",
            lastName: "Soth",
            profileURL: "/ratana.jpg",
            email: "rsoth@paragoniu.edu.kh",
            description:
                "Neil Ian Cadungog-Uy graduated with a Bachelor of Science Degree in Information Technology at Negros Oriental State University, Dumaguete City, Philippines. ",
        },
    ];

    return (
        <div>
            <Navbar />
            <div className="container mx-auto py-12">
                <h1 className="text-center font-bold text-5xl pb-8">
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
                <h1 className="text-center font-bold text-5xl pb-8">
                    Our Advisors
                </h1>
                <div className="flex justify-center gap-8 mt-4">
                    {advisors.map((adivsor, i) => {
                        return (
                            <MemberProfile member={adivsor} variant="dark" />
                        );
                    })}
                </div>
            </div>
            <div className="container mx-auto py-12">
                <h1 className="text-center font-bold text-5xl pb-8">
                    Our Members
                </h1>
                <div className="flex justify-center gap-8 mt-4">
                    {members.map((member, i) => {
                        return (
                            <MemberProfile member={member} variant="light" />
                        );
                    })}
                </div>
            </div>
            <Footer />
        </div>
    );
}
