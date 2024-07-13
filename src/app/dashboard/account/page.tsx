import { getAuthUser } from "@/auth/lucia";
import Card from "@/components/Card";
import Chip from "@/components/Chip";
import ChipsHolder from "@/components/ChipsHolder";
import ImageWithFallback from "@/components/ImageWithFallback";
import { fileToUrl } from "@/lib/file";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { EditProfileOverlay } from "./edit_profile";
import Tooltip from "@/components/Tooltip";
import { ChangeEmailOverlay } from "./change_email";
import { ChangePasswordOverlay } from "./change_password";
import { UserType } from "@/types/user";
import ChangeGithub from "./change_github_";
import { Metadata } from "next";
import Loading from "@/components/Loading";
import SkillSetChips from "@/components/SkillSetChips";

export const metadata: Metadata = {
    title: "Manage Account - Dashboard - Radice",
};

export default async function ManageAccount() {
    const user = await getAuthUser();

    if (!user) {
        return redirect("/login");
    }

    return (
        <div className="w-full max-w-[1000px] mx-auto">
            <Suspense fallback={<Loading />}>
                <Card className="flex flex-col gap-4">
                    <div>
                        <ImageWithFallback
                            className="aspect-square object-cover rounded-full border border-gray-300"
                            src={fileToUrl(
                                user.profileUrl,
                                user.type === UserType.PARTNER
                                    ? "/placeholders/logo_placeholder.png"
                                    : "/placeholders/placeholder.png",
                            )}
                            alt={"profile"}
                            width={128}
                            height={128}
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <h1 className="text-2xl font-bold">{`${user.firstName} ${user.lastName}`}</h1>
                            <div className="">
                                <EditProfileOverlay
                                    user={user}
                                    key={JSON.stringify(user)}
                                />
                            </div>
                        </div>
                        <h3 className="text-lg">{user.email}</h3>
                        <h3 className="text-sm">{user.description}</h3>
                        {user.type === UserType.USER && (
                            <div className="mb-2">
                                <SkillSetChips
                                    dashboard
                                    skillSets={user.skillSet}
                                />
                            </div>
                        )}
                        <div className="flex gap-4 flex-col">
                            <div>
                                <ChangeEmailOverlay user={user} />
                            </div>
                            <div>
                                <ChangePasswordOverlay />
                            </div>
                            {user.hasLinkedGithub && (
                                <div>
                                    <ChangeGithub />
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </Suspense>
        </div>
    );
}
