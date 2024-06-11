"use client";
import InputField from "@/components/InputField";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SearchBar({
    placeholder = "",
    searchDelay = 250,
}: {
    placeholder?: string;
    searchDelay?: number;
}) {
    const searchRef = useRef<HTMLInputElement>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    const searchDebounced = useDebouncedCallback((value: string) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set("search", value);
        router.push(`?${newSearchParams.toString()}`);
    }, searchDelay);

    return (
        <InputField
            defaultValue={searchParams.get("search") || ""}
            isSearch={true}
            ref={searchRef}
            placeholder={placeholder}
            onChange={(e) => searchDebounced(e.target.value)}
        />
    );
}
