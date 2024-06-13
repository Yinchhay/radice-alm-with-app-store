import { PublicMedias } from "@/app/api/public/media/route";
import ImageWithFallback from "@/components/ImageWithFallback";
import { fileToUrl } from "@/lib/file";

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
        <div className={`w-full col-span-${col}`}>
            <ImageWithFallback
                src={fileToUrl(media.files[0].filename)}
                alt={""}
                width="0"
                height="0"
                sizes="100vw"
                className="w-full h-auto object-cover"
                style={{ aspectRatio }}
            />
        </div>
    );
}
