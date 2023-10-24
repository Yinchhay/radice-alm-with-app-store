import Image from "next/image";
import { Roboto_Condensed, Roboto_Flex, Roboto } from "next/font/google";
import GlitchText from "@/components/GlitchText";
import Eye from "@/components/Eye";
const roboto_condensed = Roboto_Condensed({
    weight: "700",
    subsets: ["latin"],
});
const roboto_flex = Roboto_Flex({ subsets: ["latin"] });
const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"] });

export default function Home() {
    return (
        <div className="mt-[500px] max-w-full">
            <Eye />
        </div>
    );
}
