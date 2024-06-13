import { getAuthUser } from "@/auth/lucia";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Chip from "@/components/Chip";
import ChipsHolder from "@/components/ChipsHolder";
import ImageWithFallback from "@/components/ImageWithFallback";
import { fileToUrl } from "@/lib/file";
import { IconEdit } from "@tabler/icons-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { EditProfileOverlay } from "./edit_profile";
import Tooltip from "@/components/Tooltip";
import { UserSkillSetLevel } from "@/drizzle/schema";
import { ChangeEmailOverlay } from "./change_email";
import { ChangePasswordOverlay } from "./change_password";
import { UserType } from "@/types/user";
import ChangeGithubButton from "./change_github_";

export default async function ManageAccount() {
    const user = await getAuthUser();

    if (!user) {
        return redirect("/login");
    }

    return (
        <div className="w-full max-w-[1000px] mx-auto">
            <Suspense fallback={"loading..."}>
                <Card className="flex flex-col gap-4">
                    <div>
                        <ImageWithFallback
                            className="aspect-square object-cover rounded-full"
                            src={fileToUrl(user.profileUrl)}
                            alt={"profile"}
                            width={128}
                            height={128}
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <h1 className="text-2xl font-bold">{`${user.firstName} ${user.lastName}`}</h1>
                            <div className="">
                                <EditProfileOverlay user={user} />
                            </div>
                        </div>
                        <h3 className="text-lg">{user.email}</h3>
                        <h3 className="text-sm">{user.description}</h3>
                        {user.type === UserType.USER && (
                            <div className="flex gap-2">
                                <h2 className="text-lg font-semibold min-w-fit">
                                    Skill sets:
                                </h2>
                                <ChipsHolder>
                                    {Array.isArray(user.skillSet) &&
                                        user.skillSet.map((sk) => {
                                            // TODO: add tooltip level
                                            return (
                                                <Tooltip
                                                    key={sk.label}
                                                    title={`Level: ${UserSkillSetLevel[sk.level]}`}
                                                >
                                                    <Chip>{sk.label}</Chip>
                                                </Tooltip>
                                            );
                                        })}
                                </ChipsHolder>
                            </div>
                        )}
                        <div className="flex gap-4">
                            <ChangeEmailOverlay user={user} />
                            <ChangePasswordOverlay />
                            <ChangeGithubButton />
                        </div>
                    </div>
                </Card>
            </Suspense>
        </div>
    );
}
