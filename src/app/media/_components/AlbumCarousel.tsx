"use client";
import Image from "next/image";
import { PublicMedias } from "@/app/api/public/media/route";
import ImageWithFallback from "@/components/ImageWithFallback";
import Overlay from "@/components/Overlay";
import { fileToUrl } from "@/lib/file";
import { useEffect, useState } from "react";
import { Roboto_Condensed } from "next/font/google";
import { dateToString } from "@/lib/utils";
import { IconX } from "@tabler/icons-react";

const roboto_condensed = Roboto_Condensed({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
});

export default function AlbumCarousel({
    selectedAlbum,
    onClose,
}: {
    selectedAlbum: PublicMedias | undefined;
    onClose: () => void;
}) {
    const [currentImage, setCurrentImage] = useState(0);

    return (
        <>
            {selectedAlbum && (
                <div className="fixed top-0 left-0 transition-all z-40">
                    <Overlay
                        onClose={() => {
                            setCurrentImage(0);
                            onClose();
                        }}
                    >
                        <div className="w-[70vw] bg-black overflow-hidden pb-4 relative">
                            <button
                                className="absolute top-0 right-0 border p-1 border-gray-200 group z-10"
                                onClick={() => {
                                    setCurrentImage(0);
                                    onClose();
                                }}
                            >
                                <Image
                                    width={50}
                                    height={50}
                                    src={"/x.svg"}
                                    className="invert group-hover:scale-[.85] group-active:scale-100 duration-200"
                                    alt=""
                                />
                            </button>
                            <div
                                className="w-full flex transition-all"
                                style={{
                                    transform: `translateX(-${100 * currentImage}%)`,
                                }}
                            >
                                {selectedAlbum.files.map((file, i) => {
                                    return (
                                        <div
                                            className="w-full aspect-[16/7] flex-shrink-0"
                                            key={`carousel-image-${selectedAlbum.id}-${i}`}
                                        >
                                            <ImageWithFallback
                                                src={fileToUrl(file.filename)}
                                                alt={""}
                                                width="0"
                                                height="0"
                                                sizes="100vw"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex gap-2 border-t border-gray-400">
                                <div className="flex shrink-0">
                                    <button
                                        onClick={() => {
                                            if (currentImage <= 0) return;
                                            setCurrentImage(currentImage - 1);
                                        }}
                                        className={`-scale-100 select-none w-[60px] h-[60px] border border-gray-200 grid place-items-center group ${currentImage == 0 ? "pointer-events-none opacity-50" : "opacity-100"}`}
                                    >
                                        <Image
                                            src={"/arrow.svg"}
                                            width={16}
                                            height={29}
                                            alt=""
                                            className="group-hover:scale-75 group-active:scale-100 duration-200 select-none"
                                        />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (
                                                currentImage + 1 ==
                                                selectedAlbum.files.length
                                            )
                                                return;
                                            setCurrentImage(currentImage + 1);
                                        }}
                                        className={`w-[60px] select-none h-[60px] border border-gray-200 grid place-items-center group ${currentImage + 1 == selectedAlbum.files.length ? "pointer-events-none opacity-50" : "opacity-100"}`}
                                    >
                                        <Image
                                            src={"/arrow.svg"}
                                            width={16}
                                            height={29}
                                            alt=""
                                            className="group-hover:scale-75 group-active:scale-100 duration-200 select-none"
                                        />
                                    </button>
                                </div>
                                <div className="text-white px-4 py-2">
                                    <h1
                                        className={`text-2xl mt-1 font-bold ${roboto_condensed.className}`}
                                    >
                                        {selectedAlbum.title}
                                    </h1>
                                    <h2 className="mb-2">
                                        {dateToString(selectedAlbum.date)}
                                    </h2>
                                    <p>{selectedAlbum.description}</p>
                                </div>
                            </div>
                        </div>
                    </Overlay>
                </div>
            )}
        </>
    );
}
