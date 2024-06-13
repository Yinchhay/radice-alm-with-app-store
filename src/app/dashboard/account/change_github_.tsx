import Button from "@/components/Button";
import { IconBrandGithub } from "@tabler/icons-react";
import Link from "next/link";

export default function ChangeGithubButton() {
    return (
        <Link href="/api/oauth/github/change-account" prefetch={false}>
            <Button className="flex gap-2">
                <IconBrandGithub />
                Change github account
            </Button>
        </Link>
    );
}
