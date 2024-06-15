import { PublicMedias } from "@/app/api/public/media/route";
import ImageWithFallback from "@/components/ImageWithFallback";
import { fileToUrl } from "@/lib/file";
import { IconPhoto } from "@tabler/icons-react";

export default function Album({
    col = 1,
    media,
    aspectRatio = "1/1",
}: {
    col?: number;
    media: PublicMedias;
    aspectRatio?: string;
}) {
    return (
        <button
            className={`w-full col-span-${col} relative group overflow-hidden`}
        >
            <div className="bg-black/50 w-full h-full absolute top-0 left-0 duration-200 ease-out translate-x-[-110%] group-hover:translate-x-0 pointer-events-none z-10"></div>
            <h1 className="bg-black pl-4 pr-5 py-2 absolute bottom-0 left-0 text-white z-20 album-title max-w-[90%] flex gap-2 items-center">
                <IconPhoto stroke={1.5} className="shrink-0" />
                <span className="text-left break-words uppercase">
                    {media.title}
                </span>
            </h1>
            <ImageWithFallback
                src={fileToUrl(media.files[0].filename)}
                alt={""}
                width="0"
                height="0"
                sizes="100vw"
                className="w-full h-auto object-cover group-hover:scale-125 duration-500 ease-out"
                style={{ aspectRatio }}
            />
        </button>
    );
}
