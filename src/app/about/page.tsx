import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import MemberProfile, { MemberProfileType } from "./_components/MemberProfile";

export default function page() {
    const advisors: MemberProfileType[] = [
        {
            name: "Neil IAN UY",
            image: "/neil.jpg",
            email: "nuy@paragoniu.edu.kh",
            description:
                "Neil Ian Cadungog-Uy graduated with a Bachelor of Science Degree in Information Technology at Negros Oriental State University, Dumaguete City, Philippines.",
        },
        {
            name: "Ratana Soth",
            image: "/ratana.jpg",
            email: "rsoth@paragoniu.edu.kh",
            description:
                "Neil Ian Cadungog-Uy graduated with a Bachelor of Science Degree in Information Technology at Negros Oriental State University, Dumaguete City, Philippines. ",
        },
    ];

    return (
        <div>
            <Navbar />
            <div className="container mx-auto py-8">
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
            <div className="bg-black text-white py-8">
                <h1 className="text-center font-bold text-5xl pb-8">
                    Our Advisors
                </h1>
                <div className="flex justify-center gap-8">
                    {advisors.map((adivsor, i) => {
                        return (
                            <MemberProfile member={adivsor} variant="dark" />
                        );
                    })}
                </div>
            </div>
            <Footer />
        </div>
    );
}
