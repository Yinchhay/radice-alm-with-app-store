"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function NoApplicationForm({ page }: { page: number }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    if (page !== 1) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("page", "1");
        router.push(`?${newSearchParams.toString()}`);
    }

    return (
        <div className="flex flex-col items-center justify-center h-48">
            <p className="text-lg">No application form found!</p>
        </div>
    );
}
