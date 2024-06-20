"use client";

import Button from "@/components/Button";
import { useToast } from "@/components/Toaster";
import { IconBrandGithub, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LinkGithubButton() {
    const searchParams = useSearchParams();
    const { addToast } = useToast();

    useEffect(() => {
        if (
            searchParams.has("error_message") &&
            searchParams.get("error_message")
        ) {
            addToast(
                <div className="flex gap-2">
                    <IconX className="text-white bg-red-500 p-1 text-sm rounded-full flex-shrink-0" />
                    <p>{searchParams.get("error_message")}</p>
                </div>,
            );
        }
    }, [searchParams]);

    return (
        <Link href={"/api/oauth/github/link-account"} prefetch={false}>
            <Button className="flex gap-2 w-full">
                <IconBrandGithub />
                Connect with Github account
            </Button>
        </Link>
    );
}
