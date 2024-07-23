"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function NoMedia({ page }: { page: number }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    if (page !== 1) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("page", "1");
        router.push(`?${newSearchParams.toString()}`);
    }

    return (
        <>
            <div className="flex flex-col items-center justify-between gap-4 my-8">
                <h1 className="dark:text-white">No media found!</h1>
            </div>
        </>
    );
}
