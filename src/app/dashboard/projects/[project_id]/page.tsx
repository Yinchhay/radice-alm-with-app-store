import { getOneAssociatedProjectData } from "./fetch";
import Image from "next/image";
import { fileToUrl } from "@/lib/file";
import {
    Chapter,
    Component,
    TextAlign,
    fontAligns,
    fontWeights,
    headingFontSizes,
    paragraphFontSizes,
} from "@/types/content";
import MemberProfile from "@/app/about/_components/MemberProfile";
import ImageWithFallback from "@/components/ImageWithFallback";
import ChipsHolder from "@/components/ChipsHolder";
import Chip from "@/components/Chip";
import Link from "next/link";
import ResearchFiles from "./_components/ResearchFiles";

export default async function PreviewProjectPage({
    params,
}: {
    params: { project_id: string };
}) {
    console.log("called");
    const fetchProject = await getOneAssociatedProjectData(
        Number(params.project_id),
    );
    console.log(fetchProject);
    if (!fetchProject.success) {
        return;
    }

    if (JSON.stringify(fetchProject.data) === "{}") {
        console.log("no info");
        return;
    }
    if (!fetchProject.data.project) {
        return;
    }
    const project = fetchProject.data.project;
    let chapters: Chapter[] = [];
    try {
        chapters = JSON.parse(project.projectContent as string) as Chapter[];
    } catch {
        chapters = [];
    }
    return (
        <div>
            <div className="relative grid grid-cols-[270px_minmax(auto,920px)_270px] w-full max-w-[1500px] mx-auto">
                <div className="grid gap-2 w-full z-10 relative h-fit">
                    <div className="absolute ">
                        <div className="fixed w-[270px]">
                            <div className="grid gap-2 px-4">
                                {chapters.map((chapter, i) => {
                                    return (
                                        <Link
                                            key={`chapter-${i}`}
                                            href={`#${chapter.name}-${i}`}
                                        >
                                            {chapter.name}
                                        </Link>
                                    );
                                })}
                                <div className="w-[50%] h-[1px] bg-gray-300 my-2"></div>
                                <Link href={"#partners"}>Partners</Link>
                                <Link href={"#members"}>Members</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="z-[5] relative bg-transparent">
                    <div className="w-full px-8 grid gap-4">
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
                            {project.projectCategories.map((category, i) => (
                                <Chip key={`category-${category.id}}`}>
                                    {category.category.name}
                                </Chip>
                            ))}
                        </ChipsHolder>
                        {chapters && (
                            <div className="grid gap-8 border-t border-gray-300 py-8">
                                {chapters.map((chapter, j) => {
                                    return (
                                        <div
                                            className="grid gap-8"
                                            id={`${chapter.name}-${j}`}
                                        >
                                            {chapter.components.map(
                                                (component, i) => {
                                                    let componentBlock;
                                                    switch (component.type) {
                                                        case "heading":
                                                            componentBlock = (
                                                                <h1
                                                                    key={i}
                                                                    className="w-full resize-none focus:outline-none overflow-hidden bg-transparent"
                                                                    style={{
                                                                        fontSize:
                                                                            component.style &&
                                                                            component
                                                                                .style
                                                                                .fontSize !==
                                                                                undefined
                                                                                ? headingFontSizes[
                                                                                      component
                                                                                          .style
                                                                                          .fontSize
                                                                                  ]
                                                                                      .value
                                                                                : headingFontSizes[2]
                                                                                      .value,
                                                                        fontWeight:
                                                                            component.style &&
                                                                            component
                                                                                .style
                                                                                .fontWeight !==
                                                                                undefined
                                                                                ? fontWeights[
                                                                                      component
                                                                                          .style
                                                                                          .fontWeight
                                                                                  ]
                                                                                      .value
                                                                                : fontWeights[2]
                                                                                      .value,
                                                                        textAlign:
                                                                            component.style &&
                                                                            component
                                                                                .style
                                                                                .fontAlign !==
                                                                                undefined
                                                                                ? (fontAligns[
                                                                                      component
                                                                                          .style
                                                                                          .fontAlign
                                                                                  ]
                                                                                      .value as TextAlign)
                                                                                : (fontAligns[1]
                                                                                      .value as TextAlign),
                                                                    }}
                                                                >
                                                                    {
                                                                        component.text
                                                                    }
                                                                </h1>
                                                            );
                                                            break;
                                                        case "image":
                                                            componentBlock = (
                                                                <Image
                                                                    key={i}
                                                                    src={fileToUrl(
                                                                        component.text,
                                                                    )}
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
                                                                <p
                                                                    className="w-full resize-none focus:outline-none overflow-hidden bg-transparent"
                                                                    style={{
                                                                        fontSize:
                                                                            component.style &&
                                                                            component
                                                                                .style
                                                                                .fontSize !==
                                                                                undefined
                                                                                ? paragraphFontSizes[
                                                                                      component
                                                                                          .style
                                                                                          .fontSize
                                                                                  ]
                                                                                      .value
                                                                                : paragraphFontSizes[1]
                                                                                      .value,
                                                                        fontWeight:
                                                                            component.style &&
                                                                            component
                                                                                .style
                                                                                .fontWeight !==
                                                                                undefined
                                                                                ? fontWeights[
                                                                                      component
                                                                                          .style
                                                                                          .fontWeight
                                                                                  ]
                                                                                      .value
                                                                                : fontWeights[1]
                                                                                      .value,
                                                                        textAlign:
                                                                            component.style &&
                                                                            component
                                                                                .style
                                                                                .fontAlign !==
                                                                                undefined
                                                                                ? (fontAligns[
                                                                                      component
                                                                                          .style
                                                                                          .fontAlign
                                                                                  ]
                                                                                      .value as TextAlign)
                                                                                : (fontAligns[0]
                                                                                      .value as TextAlign),
                                                                    }}
                                                                >
                                                                    {
                                                                        component.text
                                                                    }
                                                                </p>
                                                            );
                                                            break;
                                                        case "list":
                                                            componentBlock = (
                                                                <div>
                                                                    <h3
                                                                        className="w-full resize-none focus:outline-none overflow-hidden bg-transparent"
                                                                        style={{
                                                                            fontSize:
                                                                                component.style &&
                                                                                component
                                                                                    .style
                                                                                    .fontSize !==
                                                                                    undefined
                                                                                    ? paragraphFontSizes[
                                                                                          component
                                                                                              .style
                                                                                              .fontSize
                                                                                      ]
                                                                                          .value
                                                                                    : paragraphFontSizes[1]
                                                                                          .value,
                                                                            fontWeight:
                                                                                component.style &&
                                                                                component
                                                                                    .style
                                                                                    .fontWeight !==
                                                                                    undefined
                                                                                    ? fontWeights[
                                                                                          component
                                                                                              .style
                                                                                              .fontWeight
                                                                                      ]
                                                                                          .value
                                                                                    : fontWeights[1]
                                                                                          .value,
                                                                        }}
                                                                    >
                                                                        {
                                                                            component.text
                                                                        }
                                                                    </h3>
                                                                    <ul className="list-disc pl-6">
                                                                        {component.rows?.map(
                                                                            (
                                                                                row,
                                                                                i,
                                                                            ) => {
                                                                                return (
                                                                                    <li
                                                                                        style={{
                                                                                            fontSize:
                                                                                                component.style &&
                                                                                                component
                                                                                                    .style
                                                                                                    .fontSize !==
                                                                                                    undefined
                                                                                                    ? paragraphFontSizes[
                                                                                                          component
                                                                                                              .style
                                                                                                              .fontSize
                                                                                                      ]
                                                                                                          .value
                                                                                                    : paragraphFontSizes[1]
                                                                                                          .value,
                                                                                            fontWeight:
                                                                                                component.style &&
                                                                                                component
                                                                                                    .style
                                                                                                    .fontWeight !==
                                                                                                    undefined
                                                                                                    ? fontWeights[
                                                                                                          component
                                                                                                              .style
                                                                                                              .fontWeight
                                                                                                      ]
                                                                                                          .value
                                                                                                    : fontWeights[1]
                                                                                                          .value,
                                                                                        }}
                                                                                        key={`row-${component.id}-${i}`}
                                                                                    >
                                                                                        {
                                                                                            row
                                                                                        }
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
                                                },
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {project.projectPartners && (
                            <div
                                className="py-8 border-t border-gray-300"
                                id="partners"
                            >
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
                                                    member={
                                                        projectPartner.partner
                                                    }
                                                    variant="light"
                                                />
                                            );
                                        },
                                    )}
                                </div>
                            </div>
                        )}
                        {project.projectMembers && (
                            <div
                                className="py-8 border-t border-gray-300"
                                id="members"
                            >
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
                        )}
                    </div>
                </div>
                <div className="w-full z-10 relative h-fit">
                    <div className="absolute">
                        <div className="fixed w-[270px]">
                            <ResearchFiles files={project.files} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
