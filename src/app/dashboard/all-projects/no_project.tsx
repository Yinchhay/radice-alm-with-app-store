"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function NoProject({
    page,
    search = "",
}: {
    page: number;
    search?: string;
}) {
    const searchParams = useSearchParams();
    const router = useRouter();

    if (page !== 1) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("page", "1");
        router.push(`?${newSearchParams.toString()}`);
    }

    let message = `No project found`;

    if (search) {
        message += ` with search term "${search}"`;
    }

    return (
        <>
            <div className="flex flex-col items-center justify-between gap-4 my-8">
                <h1 className="text-lg">{message}</h1>
            </div>
        </>
    );
}
