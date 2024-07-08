"use client";
import { PublicMedias } from "@/app/api/public/media/route";
import Collage from "./Collage";
import { useState } from "react";
import AlbumCarousel from "./AlbumCarousel";

export default function MediaManager({ media }: { media: PublicMedias[][] }) {
    const [selectedAlbum, setSelectedAlbum] = useState<
        PublicMedias | undefined
    >();

    return (
        <>
            <div className="grid gap-8">
                {media.length <= 0 && (
                    <p className="text-center">
                        There are currently no media for now.
                    </p>
                )}
                {media.map((collage, i) => {
                    return (
                        <Collage
                            onSelectAlbum={(album) => {
                                setSelectedAlbum(album);
                            }}
                            collage={collage}
                            variant={i % 8}
                            key={`collage-${i}`}
                        />
                    );
                })}
            </div>
            <AlbumCarousel
                selectedAlbum={selectedAlbum}
                onClose={() => {
                    setSelectedAlbum(undefined);
                }}
            />
        </>
    );
}
