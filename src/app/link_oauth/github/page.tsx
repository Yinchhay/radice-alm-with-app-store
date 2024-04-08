import { getAuthUser } from "@/auth/lucia";
import Button from "@/components/Button";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Link Github | Radi Center",
    description:
        "Link your github account to Radi Center to get more features.",
};

type Props = {
    searchParams: {
        callback?: string;
    };
};

export default async function ConnectWithGithub({ searchParams }: Props) {
    const user = await getAuthUser();
    if (!user) {
        redirect("/");
    }

    return (
        <Link href={"/api/oauth/github/link_account"}>
            <Button>Link github</Button>
        </Link>
    );
}
