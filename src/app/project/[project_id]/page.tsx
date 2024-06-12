import Navbar from "@/components/Navbar";
import { getProjectByIdForPublic } from "./fetch";
import Footer from "@/components/Footer";
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

export default async function ProjectPage({
    params,
}: {
    params: { project_id: string };
}) {
    const fetchProject = await getProjectByIdForPublic(
        Number(params.project_id),
    );
    if (!fetchProject.success) {
        return;
    }
    if (!fetchProject.data.project) {
        return;
    }
    let chapters: Chapter[] = [];
    try {
        chapters = JSON.parse(
            fetchProject.data.project.projectContent as string,
        ) as Chapter[];
    } catch {
        chapters = [];
    }

    return (
        <div>
            <Navbar />
            <div className="py-16 container mx-auto w-full max-w-[920px]">
                <div className="col-span-3 grid gap-4 p-4">
                    <div className="flex gap-8 items-center">
                        <ImageWithFallback
                            className="border border-gray-300 object-cover aspect-square"
                            width={80}
                            height={80}
                            src={fileToUrl(fetchProject.data.project.logoUrl)}
                            alt=""
                        />
                        <h1 className="text-5xl font-bold">
                            {fetchProject.data.project.name}
                        </h1>
                    </div>
                    <p>{fetchProject.data.project.description}</p>
                    <ChipsHolder className="mb-4">
                        {fetchProject.data.project.projectCategories.map(
                            (categoryJoin) => (
                                <Chip key={categoryJoin.id}>
                                    {categoryJoin.category.name}
                                </Chip>
                            ),
                        )}
                    </ChipsHolder>
                    {chapters && (
                        <div className="grid gap-8 border-t border-gray-300 py-8">
                            {chapters.map((chapter, j) => {
                                return (
                                    <>
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
                                                                {component.text}
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
                                                                {component.text}
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
                                    </>
                                );
                            })}
                        </div>
                    )}
                    <div className="py-8 border-t border-gray-300">
                        <h1 className="text-center font-bold text-4xl mb-8">
                            Our Partners
                        </h1>
                        <div className="flex justify-center gap-8">
                            {fetchProject.data.project.projectPartners.map(
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
                            {fetchProject.data.project.projectMembers.map(
                                (member, i) => {
                                    return (
                                        <MemberProfile
                                            key={`member-${member.user.id}-${i}`}
                                            member={member.user}
                                            variant="light"
                                        />
                                    );
                                },
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
