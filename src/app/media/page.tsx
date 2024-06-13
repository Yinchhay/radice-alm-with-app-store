import Navbar from "@/components/Navbar";
import { getMedia } from "./fetch";
import Footer from "@/components/Footer";
import { Roboto_Condensed } from "next/font/google";
import ImageWithFallback from "@/components/ImageWithFallback";
import { fileToUrl } from "@/lib/file";
import Album from "./_components/Album";
import { PublicMedias } from "../api/public/media/route";
import { splitArray } from "@/lib/utils";
import Collage from "./_components/Collage";

export const dynamic = "force-dynamic";

const roboto_condensed = Roboto_Condensed({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
});

export default async function MediaPage() {
    // const fetchMedia = await getMedia();
    // if (!fetchMedia.success) return;
    // const media = fetchMedia.data.medias;
    const generateMediaArray = (num: number): PublicMedias[] => {
        const mediaArray: PublicMedias[] = [];
        for (let i = 1; i <= num; i++) {
            mediaArray.push({
                id: i,
                title: `Sample Media ${i}`,
                description: `This is a description for sample media ${i}`,
                date: new Date(
                    `2023-06-${String(i).padStart(2, "0")}T12:00:00Z`,
                ),
                files: [
                    { filename: "https://placehold.co/600x400?text=Media" },
                ],
            });
        }
        return mediaArray;
    };
    function getRandomIntInclusive(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const medias: PublicMedias[] = generateMediaArray(
        getRandomIntInclusive(50, 70),
    );

    let media = splitArray(medias, 5);

    media.forEach((collage) => {
        collage.forEach((media_, i) => {
            media_.files[0].filename = `https://placehold.co/600x600?text=${i + 1}`;
        });
    });
    return (
        <div>
            <Navbar />
            <div className="w-full max-w-[1100px] min-h-[70vh] mx-auto py-8">
                <h1
                    className={`text-center font-bold text-5xl pb-8 ${roboto_condensed.className}`}
                >
                    Media
                </h1>
                <div className="grid gap-8">
                    {media.map((collage, i) => {
                        return (
                            <Collage
                                collage={collage}
                                variant={i % 8}
                                key={`collage-${i}`}
                            />
                        );
                    })}
                </div>
            </div>
            <Footer />
        </div>
    );
}
