import Navbar from "@/components/Navbar";
import { getProjectByIdForPublic } from "./fetch";
import Footer from "@/components/Footer";
import Image from "next/image";
import { fileToUrl } from "@/lib/file";
import { Component } from "@/types/content";
import MemberProfile from "@/app/about/_components/MemberProfile";
import ImageWithFallback from "@/components/ImageWithFallback";
import ChipsHolder from "@/components/ChipsHolder";
import Chip from "@/components/Chip";

export default async function ProjectPage({
    params,
}: {
    params: { project_id: string };
}) {
    const project = await getProjectByIdForPublic(Number(params.project_id));
    const content = JSON.parse(
        project?.projectContent as string,
    ) as Component[];
    console.log(project);

    return (
        <div>
            <Navbar />
            {project && (
                <div className="py-16 container mx-auto w-full max-w-[920px]">
                    <div className="col-span-3 grid gap-4 p-4">
                        <div className="flex gap-8 items-center">
                            <ImageWithFallback
                                className="border border-gray-300 object-cover aspect-square"
                                width={80}
                                height={80}
                                src={fileToUrl(project.logoUrl)}
                                alt=""
                            />
                            <h1 className="text-5xl font-bold">
                                {project.name}
                            </h1>
                        </div>
                        <p>{project.description}</p>
                        <ChipsHolder className="mb-4">
                            {project.projectCategories.map((categoryJoin) => (
                                <Chip key={categoryJoin.id}>
                                    {categoryJoin.category.name}
                                </Chip>
                            ))}
                        </ChipsHolder>
                        {content && (
                            <div className="grid gap-8 border-t border-gray-300 py-8">
                                {content.map((component, i) => {
                                    let componentBlock;
                                    switch (component.type) {
                                        case "heading":
                                            componentBlock = (
                                                <h1
                                                    key={i}
                                                    className="text-5xl font-extrabold text-center w-full resize-none focus:outline-none overflow-hidden bg-transparent"
                                                >
                                                    {component.text}
                                                </h1>
                                            );
                                            break;
                                        case "image":
                                            componentBlock = (
                                                <Image
                                                    key={i}
                                                    src={
                                                        component.text ||
                                                        "placeholder.webp"
                                                    }
                                                    alt={""}
                                                    width={100}
                                                    height={100}
                                                    layout="responsive"
                                                    style={{
                                                        width: "100%",
                                                        height: "auto",
                                                    }}
                                                />
                                            );
                                            break;
                                        case "paragraph":
                                            componentBlock = (
                                                <p className="w-full resize-none focus:outline-none overflow-hidden bg-transparent">
                                                    {component.text}
                                                </p>
                                            );
                                            break;
                                        case "list":
                                            componentBlock = (
                                                <div>
                                                    <h3 className="w-full resize-none focus:outline-none overflow-hidden bg-transparent mb-1">
                                                        {component.text}
                                                    </h3>
                                                    <ul className="list-disc pl-6">
                                                        {component.rows?.map(
                                                            (row, i) => {
                                                                return (
                                                                    <li
                                                                        key={`row-${component.id}-${i}`}
                                                                    >
                                                                        {row}
                                                                    </li>
                                                                );
                                                            },
                                                        )}
                                                    </ul>
                                                </div>
                                            );
                                            break;
                                    }
                                    return componentBlock;
                                })}
                            </div>
                        )}
                        <div className="py-8 border-t border-gray-300">
                            <h1 className="text-center font-bold text-4xl mb-8">
                                Our Partners
                            </h1>
                            <div className="flex justify-center gap-8">
                                {project.projectPartners.map(
                                    (projectPartner, i) => {
                                        return (
                                            <MemberProfile
                                                userType="partner"
                                                key={`member-${projectPartner.partner.id}-${i}`}
                                                member={projectPartner.partner}
                                                variant="light"
                                            />
                                        );
                                    },
                                )}
                            </div>
                        </div>
                        <div className="py-8 border-t border-gray-300">
                            <h1 className="text-center font-bold text-4xl mb-8">
                                Our Members
                            </h1>
                            <div className="flex justify-center gap-8">
                                {project.projectMembers.map((member, i) => {
                                    return (
                                        <MemberProfile
                                            key={`member-${member.user.id}-${i}`}
                                            member={member.user}
                                            variant="light"
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
