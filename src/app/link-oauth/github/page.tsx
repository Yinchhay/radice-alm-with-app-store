import { getAuthUser } from "@/auth/lucia";
import Button from "@/components/Button";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IconHome } from "@tabler/icons-react";
import LinkGithubButton from "./link_github_button";

export const metadata: Metadata = {
    title: "Link Github | Radi Center",
    description:
        "Link your github account to Radi Center to get more features.",
};

type Props = {
    searchParams: {
        callback?: string;
        success?: string;
    };
};

export default async function ConnectWithGithub({ searchParams }: Props) {
    const user = await getAuthUser();
    if (!user) {
        redirect("/");
    }

    if (searchParams.success) {
        redirect("/login");
    }

    return (
        <div>
            <Navbar />
            <div className="container mx-auto min-h-[60vh] grid justify-center mt-16">
                <div className="flex gap-4 flex-col">
                    <div className="">
                        <h1 className="text-3xl font-bold w-[550px] text-center">
                            In order to access dashboard, you must connect your
                            Github account with Radice
                        </h1>
                    </div>
                    <div className="flex gap-4 flex-col items-center">
                        <LinkGithubButton />
                        <Link href={"/"}>
                            <Button className="flex gap-2 w-full">
                                <IconHome />
                                Go back to home page
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
