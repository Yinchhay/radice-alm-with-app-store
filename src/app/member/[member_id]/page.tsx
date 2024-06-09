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
import { fileToUrl } from "@/lib/file";

export default async function MemberPublicProfilePage({
    params,
}: {
    params: { member_id: string };
}) {
    const fetchMembers = await getPublicMemberById(params.member_id);
    const fetchProjects = await getPublicProjectByMemberId(params.member_id);

    if (!fetchMembers.success) {
        return;
    }
    if (!fetchProjects.success) {
        return;
    }
    const member = fetchMembers.data.member;
    const projects = fetchProjects.data.projects;
    let fetchGithub;
    if (member) {
        fetchGithub = await getGithubProfileURL(
            member.oauthProviders[0].providerUserId,
            member.oauthProviders[0].accessToken,
        );
    }
    return (
        <div>
            <Navbar />
            {member && (
                <div className="container min-h-[70vh] mx-auto py-8 grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                        <div className="w-[180px] h-[220px] relative">
                            <GridRevealImage
                                variant="light"
                                canReveal
                                width={180}
                                height={220}
                                src={
                                    fileToUrl(member.profileUrl) || "/wrath.jpg"
                                }
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
                            <ChipsHolder>
                                {member.skillSet.map((skill, i) => {
                                    return (
                                        <Chip
                                            key={`${skill.label}-chip-${i}`}
                                            className="rounded-sm"
                                            textClassName="text-white"
                                            bgClassName={[
                                                skill.level == 0
                                                    ? "bg-green-500"
                                                    : "",
                                                skill.level == 1
                                                    ? "bg-blue-500"
                                                    : "",
                                                skill.level == 2
                                                    ? "bg-purple-500"
                                                    : "",
                                            ].join(" ")}
                                        >
                                            {skill.label}
                                        </Chip>
                                    );
                                })}
                            </ChipsHolder>
                        )}
                        <p>{member.description}</p>
                        {member.hasLinkedGithub && fetchGithub && (
                            <>
                                <div className="flex">
                                    <Link
                                        href={fetchGithub.html_url}
                                        className="text-white rounded-full flex items-end justify-center bg-white"
                                        target="_blank"
                                    >
                                        <Image
                                            src="/github-mark.svg"
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
                        <h2 className="font-bold mb-2">Researches:</h2>
                        <div className="flex flex-col gap-4">
                            {projects.map((project, i) => {
                                return (
                                    <Card square>
                                        <Link
                                            href={`/project/${project.id}`}
                                            className="flex"
                                        >
                                            <div className="w-[80px] h-[80px] relative shrink-0 border border-gray-200">
                                                <Image
                                                    src={
                                                        `/api/file?filename=${project.logoUrl}` ||
                                                        "/placeholder.webp"
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
