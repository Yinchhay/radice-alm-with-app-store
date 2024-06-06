import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getPublicMemberById, getPublicProjectByUserId } from "./fetch";
import Image from "next/image";
import { fileToUrl } from "@/lib/file";
import Link from "next/link";
import Card from "@/components/Card";
import Chip from "@/components/Chip";
import ChipsHolder from "@/components/ChipsHolder";

export default async function MemberPublicProfilePage({
    params,
}: {
    params: { member_id: string };
}) {
    const member = await getPublicMemberById(params.member_id);
    const projects = await getPublicProjectByUserId(params.member_id);
    return (
        <div>
            <Navbar />
            {member && (
                <div className="container min-h-[70vh] mx-auto py-8 grid grid-cols-2 gap-8">
                    <div>
                        <div className="w-[180px] h-[220px] relative">
                            <Image
                                src={
                                    member.profileUrl
                                        ? member.profileUrl
                                        : "/wrath.jpg"
                                }
                                fill
                                className="object-cover"
                                alt=""
                            />
                        </div>
                        <h1 className="text-xl font-bold mt-4">
                            {member.firstName + " " + member.lastName}
                        </h1>
                        <h2 className="">{member.email}</h2>
                        <p className="mt-2">
                            {member.description ||
                                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam enim officia veritatis delectus eius illo. Veritatis, illo non excepturi, illum magni at  earum temporibus voluptate quaerat fugit autem quo. Recusandae."}
                        </p>
                    </div>
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
            )}
            <Footer />
        </div>
    );
}
