import { PublicMedias } from "@/app/api/public/media/route";
import Album from "./Album";

export default function Collage({
    collage,
    variant,
}: {
    collage: PublicMedias[];
    variant: number;
}) {
    switch (variant) {
        case 0:
            return (
                <div className="grid grid-cols-2 gap-8 w-full">
                    <div className="grid grid-cols-2 gap-8">
                        {collage[0] ? (
                            <Album
                                aspectRatio="6/5"
                                col={2}
                                media={collage[0]}
                            />
                        ) : (
                            <div></div>
                        )}
                        {collage[2] ? (
                            <Album aspectRatio="6/5" media={collage[2]} />
                        ) : (
                            <div></div>
                        )}
                        {collage[3] ? (
                            <Album aspectRatio="6/5" media={collage[3]} />
                        ) : (
                            <div></div>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        {collage[1] ? (
                            <Album aspectRatio="6/5" media={collage[1]} />
                        ) : (
                            <div></div>
                        )}
                        <div></div>
                        {collage[4] ? (
                            <Album
                                aspectRatio="6/5"
                                col={2}
                                media={collage[4]}
                            />
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
            );
        case 1:
            return (
                <div className="grid gap-8">
                    <div className="grid gap-8 grid-cols-3">
                        {collage[0] ? (
                            <Album
                                aspectRatio="2/1"
                                col={2}
                                media={collage[0]}
                            />
                        ) : (
                            <div></div>
                        )}
                        <div className="grid gap-8">
                            {collage[1] ? (
                                <Album
                                    aspectRatio="2.085/1"
                                    media={collage[1]}
                                />
                            ) : (
                                <div></div>
                            )}
                            {collage[2] ? (
                                <Album
                                    aspectRatio="2.085/1"
                                    media={collage[2]}
                                />
                            ) : (
                                <div></div>
                            )}
                        </div>
                        {collage[3] ? (
                            <Album aspectRatio="1/1" media={collage[3]} />
                        ) : (
                            <div></div>
                        )}
                        {collage[4] ? (
                            <Album
                                aspectRatio="2.085/1"
                                col={2}
                                media={collage[4]}
                            />
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
            );
        case 2:
            return (
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 grid grid-cols-3 gap-8">
                        {collage[0] ? (
                            <Album
                                aspectRatio="3.25/2"
                                col={3}
                                media={collage[0]}
                            />
                        ) : (
                            <div></div>
                        )}
                        <div></div>
                        {collage[2] ? (
                            <Album aspectRatio="1/1" media={collage[2]} />
                        ) : (
                            <div></div>
                        )}
                        {collage[3] ? (
                            <Album aspectRatio="1/1" media={collage[3]} />
                        ) : (
                            <div></div>
                        )}
                    </div>
                    <div className="grid gap-8">
                        {collage[1] ? (
                            <Album aspectRatio="1.8/1" media={collage[1]} />
                        ) : (
                            <div></div>
                        )}
                        {collage[4] ? (
                            <Album aspectRatio="1/1.368" media={collage[4]} />
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
            );
        case 3:
            return (
                <div className="grid grid-cols-2 gap-8">
                    <div className="col-span-2 grid grid-cols-3 gap-8">
                        {collage[0] ? (
                            <Album aspectRatio="1/1" media={collage[0]} />
                        ) : (
                            <div></div>
                        )}
                        {collage[1] ? (
                            <Album aspectRatio="1/1" media={collage[1]} />
                        ) : (
                            <div></div>
                        )}
                        {collage[2] ? (
                            <Album aspectRatio="1/1" media={collage[2]} />
                        ) : (
                            <div></div>
                        )}
                    </div>
                    {collage[3] ? (
                        <Album aspectRatio="2/1" media={collage[3]} />
                    ) : (
                        <div></div>
                    )}
                    {collage[4] ? (
                        <Album aspectRatio="2/1" media={collage[4]} />
                    ) : (
                        <div></div>
                    )}
                </div>
            );
        case 4:
            return (
                <div className="grid grid-cols-2 gap-8">
                    <div className="grid gap-8">
                        {collage[0] ? (
                            <Album aspectRatio="1/1" media={collage[0]} />
                        ) : (
                            <div></div>
                        )}
                        {collage[3] ? (
                            <Album aspectRatio="2/1" media={collage[3]} />
                        ) : (
                            <div></div>
                        )}
                    </div>
                    <div className="grid gap-8 grid-cols-2">
                        {collage[1] ? (
                            <Album aspectRatio="1/1" media={collage[1]} />
                        ) : (
                            <div></div>
                        )}
                        {collage[2] ? (
                            <Album aspectRatio="1/1" media={collage[2]} />
                        ) : (
                            <div></div>
                        )}
                        {collage[4] ? (
                            <Album
                                col={2}
                                aspectRatio="1/1.026"
                                media={collage[4]}
                            />
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
            );
        case 5:
            return (
                <div className="grid gap-8 grid-cols-4">
                    <div className="grid gap-8 col-span-3 grid-cols-3">
                        {collage[0] ? (
                            <Album aspectRatio="1/2" media={collage[0]} />
                        ) : (
                            <div></div>
                        )}
                        {collage[1] ? (
                            <Album
                                col={2}
                                aspectRatio="1/.94"
                                media={collage[1]}
                            />
                        ) : (
                            <div></div>
                        )}
                        {collage[3] ? (
                            <Album aspectRatio="1/1" media={collage[3]} />
                        ) : (
                            <div></div>
                        )}
                        {collage[4] ? (
                            <Album
                                col={2}
                                aspectRatio="2.13/1"
                                media={collage[4]}
                            />
                        ) : (
                            <div></div>
                        )}
                    </div>
                    <div className="grid gap-8">
                        {collage[2] ? (
                            <Album aspectRatio="1/1" media={collage[2]} />
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
            );
        case 6:
            return (
                <div className="grid gap-8 grid-cols-4">
                    {collage[0] ? (
                        <Album aspectRatio="1/1" media={collage[0]} />
                    ) : (
                        <div></div>
                    )}
                    {collage[1] ? (
                        <Album aspectRatio="1/1" media={collage[1]} />
                    ) : (
                        <div></div>
                    )}
                    {collage[2] ? (
                        <Album aspectRatio="1/1" media={collage[2]} />
                    ) : (
                        <div></div>
                    )}
                    <div></div>
                    <div className="col-span-4 grid gap-8 grid-cols-3">
                        {collage[3] ? (
                            <Album aspectRatio="1/1.675" media={collage[3]} />
                        ) : (
                            <div></div>
                        )}
                        {collage[4] ? (
                            <Album
                                col={2}
                                aspectRatio="1/.8"
                                media={collage[4]}
                            />
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
            );
        case 7:
            return (
                <div className="grid grid-cols-4 gap-8">
                    <div className="grid gap-8">
                        {collage[0] ? (
                            <Album aspectRatio="1/1" media={collage[0]} />
                        ) : (
                            <div></div>
                        )}
                        {collage[2] ? (
                            <Album aspectRatio="1/2.165" media={collage[2]} />
                        ) : (
                            <div></div>
                        )}
                    </div>
                    <div className="grid col-span-3 gap-8">
                        {collage[1] ? (
                            <Album
                                col={3}
                                aspectRatio="1.5/1"
                                media={collage[1]}
                            />
                        ) : (
                            <div></div>
                        )}
                        {collage[3] ? (
                            <Album
                                col={2}
                                aspectRatio="2.125/1"
                                media={collage[3]}
                            />
                        ) : (
                            <div></div>
                        )}
                        {collage[4] ? (
                            <Album aspectRatio="1/1" media={collage[4]} />
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
            );
    }
}
