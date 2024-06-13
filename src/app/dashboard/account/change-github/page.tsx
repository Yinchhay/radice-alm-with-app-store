import { getAuthUser } from "@/auth/lucia";
import Button from "@/components/Button";
import { IconBrandGithub, IconHome } from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type ChangeGithubProps = {
    searchParams?: {
        verify_code?: string;
    };
};

export default async function ChangeGithubPage({
    searchParams,
}: ChangeGithubProps) {
    const user = await getAuthUser();

    if (!user) {
        return redirect("/login");
    }

    return (
        <div className="container mx-auto min-h-[60vh] grid justify-center mt-16">
            <div className="flex gap-4 flex-col">
                <div className="">
                    <h1 className="text-3xl font-bold w-[600px] text-center">
                        In order to change github account, make sure you have
                        two github accounts logged in. After clicking "Choose
                        new account", you will be redirected to github to choose
                        new account."
                    </h1>
                </div>
                <div className="flex gap-4 flex-col items-center">
                    <Link
                        href={`/api/oauth/github/verify-change-account?verify_code=${searchParams?.verify_code}`}
                        prefetch={false}
                    >
                        <Button className="flex gap-2 w-full">
                            <IconBrandGithub />
                            Choose new account
                        </Button>
                    </Link>
                    <Link href={"/dashboard"}>
                        <Button className="flex gap-2 w-full">
                            <IconHome />
                            Go back to dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
