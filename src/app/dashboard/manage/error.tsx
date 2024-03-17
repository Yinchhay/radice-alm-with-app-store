"use client"; // Error components must be Client Components

import { localDebug } from "@/lib/utils";
import { ErrorMessage } from "@/types/error";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        localDebug(error.message, "/dashboard/manage/error.tsx error:");
    }, [error]);

    const noPermission = error.message === ErrorMessage.NoPermissionToThisPage;

    // TODO: add ui to the error page
    return (
        <div>
            <h2>
                {noPermission ? error.message : ErrorMessage.SomethingWentWrong}
            </h2>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => {
                        if (noPermission) {
                            return router.back();
                        }

                        reset();
                    }
                }
            >
                {noPermission ? "Go back" : "Try again"}
            </button>
        </div>
    );
}
