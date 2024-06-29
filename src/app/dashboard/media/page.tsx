import { getAuthUser } from "@/auth/lucia";
import Card from "@/components/Card";
import ImageWithFallback from "@/components/ImageWithFallback";
import { fileToUrl } from "@/lib/file";
import { hasPermission } from "@/lib/IAM";
import { Permissions } from "@/types/IAM";
import { Suspense } from "react";
import { CreateMediaOverlay } from "./create_media";
import { fetchMedia } from "./fetch";
import { media } from "@/drizzle/schema";
import Pagination from "@/components/Pagination";
import { DeleteMediaOverlay } from "./delete_media";
import { EditMediaOverlay } from "./edit_media";
import { dateToString } from "@/lib/utils";
import NoMedia from "./no_media";
import SearchBar from "@/components/SearchBar";
import { Metadata } from "next";
import DashboardPageTitle from "@/components/DashboardPageTitle";
import Loading from "@/components/Loading";
export const metadata: Metadata = {
    title: "Manage Media - Dashboard - Radice",
};
type ManageMediaProps = {
    searchParams?: {
        page?: string;
        search?: string;
    };
};

export default async function ManageMedia({ searchParams }: ManageMediaProps) {
    const user = await getAuthUser();

    if (!user) {
        throw new Error("Unauthorized to access this page");
    }

    let page = Number(searchParams?.page) || 1;
    if (page < 1) {
        page = 1;
    }

    const result = await fetchMedia(page, 5, searchParams?.search);
    if (!result.success) {
        throw new Error(result.message);
    }

    const [createMediaPermission, editMediaPermission, deleteMediaPermission] =
        await Promise.all([
            hasPermission(user.id, new Set([Permissions.CREATE_MEDIA])),
            hasPermission(user.id, new Set([Permissions.EDIT_MEDIA])),
            hasPermission(user.id, new Set([Permissions.DELETE_MEDIA])),
        ]);

    const canCreateMedia = createMediaPermission.canAccess;
    const canEditMedia = editMediaPermission.canAccess;
    const canDeleteMedia = deleteMediaPermission.canAccess;

    const MediaLists = result.data.medias.map((mediaOne) => {
        return (
            <Media
                key={mediaOne.id}
                mediaOne={mediaOne}
                canEditMedia={canEditMedia}
                canDeleteMedia={canDeleteMedia}
            />
        );
    });

    const showPagination =
        result.data.maxPage >= page && result.data.maxPage > 1;

    return (
        <div className="w-full max-w-[1000px] mx-auto">
            <Suspense fallback={<Loading />}>
                <div className="flex flex-row justify-between">
                    <DashboardPageTitle title="Media" />
                    {canCreateMedia && <CreateMediaOverlay />}
                </div>
                <div className="mt-4">
                    <SearchBar placeholder="Search media" />
                </div>
                {result.data.medias.length > 0 ? (
                    <div className="my-4 w-full flex gap-4 flex-col">
                        {MediaLists}
                    </div>
                ) : (
                    <NoMedia page={page} />
                )}
                {showPagination && (
                    <div className="float-right mb-4">
                        <Pagination page={page} maxPage={result.data.maxPage} />
                    </div>
                )}
            </Suspense>
        </div>
    );
}

function Media({
    mediaOne,
    canEditMedia,
    canDeleteMedia,
}: {
    mediaOne: typeof media.$inferSelect;
    canEditMedia: boolean;
    canDeleteMedia: boolean;
}) {
    const image = mediaOne.files[0].filename;

    return (
        <Card square>
            <div className="flex flex-row gap-4 relative">
                <ImageWithFallback
                    className="aspect-square object-cover rounded-sm w-32 h-32"
                    src={fileToUrl(image)}
                    alt={"media logo"}
                    width={128}
                    height={128}
                />
                <div className="flex pr-8  mb-6">
                    <div className="flex flex-col">
                        <h1 className="text-xl">{mediaOne.title}</h1>
                        <p className="text-sm">{dateToString(mediaOne.date)}</p>
                        <p className="text-sm">{mediaOne.description}</p>
                    </div>
                </div>
                <div
                    className="absolute bottom-0 right-0 flex gap-2"
                    key={
                        mediaOne.id +
                        new Date(mediaOne.updatedAt!).toISOString()
                    }
                >
                    {canEditMedia && <EditMediaOverlay mediaOne={mediaOne} />}
                    {canDeleteMedia && (
                        <DeleteMediaOverlay mediaOne={mediaOne} />
                    )}
                </div>
            </div>
        </Card>
    );
}
