"use client";
import InputField from "@/components/InputField";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function ProjectSearch({
    searchDelay = 500,
}: {
    searchDelay?: number;
}) {
    const [search, setSearch] = useState<string>("");
    const searchParams = useSearchParams();
    const router = useRouter();

    const searchDebounced = useDebouncedCallback((value: string) => {
        setSearch(value);
    }, searchDelay);

    useEffect(() => {
        if (searchParams.get("search") == search) {
            return;
        }

        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("search", search);

        router.push(`?${newSearchParams.toString()}`);
    }, [search]);

    return (
        <InputField
            isSearch={true}
            placeholder="Search projects"
            onChange={(e) => searchDebounced(e.target.value)}
        />
    );
}
