import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
    getGithubProfileURL,
    getPublicMemberById,
    getPublicProjectByMemberId,
} from "./fetch";
import Image from "next/image";
import Link from "next/link";
import Card from "@/components/Card";
import Chip from "@/components/Chip";
import ChipsHolder from "@/components/ChipsHolder";
import GridRevealImage from "@/components/effects/GridRevealImage";
import { redirect } from "next/navigation";
import { fileToUrl } from "@/lib/file";
import { Metadata, ResolvingMetadata } from "next";
import Tooltip from "@/components/Tooltip";
import SkillSetChips from "@/components/SkillSetChips";
export const dynamic = "force-dynamic";

type Props = {
    params: { member_id: string };
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const fetchMembers = await getPublicMemberById(params.member_id);

    if (!fetchMembers.success) {
        redirect("/");
    }
    const member = fetchMembers.data.member;
    if (member) {
        return {
            title: member.firstName + "" + member.lastName + " - Radice",
            description: member.description,
            openGraph: {
                images: [
                    {
                        url: fileToUrl(
                            member.profileUrl,
                            "/placeholders/missing-profile.png",
                        ),
                        alt:
                            member.firstName +
                            "" +
                            member.lastName +
                            " - Radice",
                        type: "image/png",
                        width: 180,
                        height: 240,
                    },
                ],
            },
            twitter: {
                images: [
                    {
                        url: fileToUrl(
                            member.profileUrl,
                            "/placeholders/missing-profile.png",
                        ),
                        alt:
                            member.firstName +
                            "" +
                            member.lastName +
                            " - Radice",
                        type: "image/png",
                        width: 180,
                        height: 240,
                    },
                ],
            },
        };
    } else {
        return {};
    }
}

export default async function MemberPublicProfilePage({
    params,
}: {
    params: { member_id: string };
}) {
    const fetchMembers = await getPublicMemberById(params.member_id);

    if (!fetchMembers.success) {
        redirect("/");
    }
    const member = fetchMembers.data.member;
    const fetchProjects = await getPublicProjectByMemberId(params.member_id);

    if (!fetchProjects.success) {
        redirect("/");
    }
    const projects = fetchProjects.data.projects;

    let fetchGithub;
    if (member) {
        if (member.oauthProviders.length > 0) {
            fetchGithub = await getGithubProfileURL(
                member.oauthProviders[0].providerUserId,
            );
        } else {
            redirect("/");
        }
    }

    return (
        <div>
            <Navbar />
            {member && (
                <div className="container min-h-[70vh] mx-auto py-8 grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                        <div className="w-[175px] h-[225px] relative">
                            <GridRevealImage
                                variant="light"
                                canReveal
                                width={175}
                                height={225}
                                src={fileToUrl(
                                    member.profileUrl,
                                    "/placeholders/missing-profile.png",
                                )}
                                fill
                                className="object-cover"
                                alt=""
                            />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">
                                {member.firstName + " " + member.lastName}
                            </h1>
                            <h2 className="">{member.email}</h2>
                        </div>
                        {member.skillSet && (
                            <SkillSetChips skillSets={member.skillSet} />
                        )}
                        {member.description && <p>{member.description}</p>}
                        {member.hasLinkedGithub &&
                            fetchGithub &&
                            fetchGithub.html_url && (
                                <>
                                    <div className="flex">
                                        <Link
                                            href={fetchGithub.html_url}
                                            className="text-white rounded-full flex items-end justify-center bg-white"
                                            target="_blank"
                                        >
                                            <Image
                                                src="/ui/github-mark.svg"
                                                width={36}
                                                height={36}
                                                alt="Github Icon"
                                            />
                                        </Link>
                                    </div>
                                </>
                            )}
                    </div>
                    <div>
                        <h2 className="font-bold mb-2 text-lg">
                            Researches/Projects:
                        </h2>
                        {projects.length <= 0 && (
                            <p>No researches or projects yet</p>
                        )}
                        <div className="flex flex-col gap-4">
                            {projects.map((project, i) => {
                                return (
                                    <Card
                                        square
                                        key={`researches-${project.id}`}
                                    >
                                        <Link
                                            href={`/project/${project.id}`}
                                            className="flex"
                                        >
                                            <div className="w-[80px] h-[80px] relative shrink-0 border border-gray-200">
                                                <Image
                                                    src={
                                                        `/api/file?filename=${project.logoUrl}` ||
                                                        "/placeholders/placeholder.webp"
                                                    }
                                                    fill
                                                    className="object-cover"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="px-4">
                                                <h1 className="text-xl font-bold">
                                                    {project.name}
                                                </h1>
                                                <p>{project.description}</p>
                                                <ChipsHolder className="mt-2">
                                                    {project.projectCategories.map(
                                                        (categoryJoin) => (
                                                            <Chip
                                                                key={
                                                                    categoryJoin.id
                                                                }
                                                            >
                                                                {
                                                                    categoryJoin
                                                                        .category
                                                                        .name
                                                                }
                                                            </Chip>
                                                        ),
                                                    )}
                                                </ChipsHolder>
                                            </div>
                                        </Link>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}
