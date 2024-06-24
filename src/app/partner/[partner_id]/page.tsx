import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getPublicPartnerById, getPublicProjectByPartnerId } from "./fetch";
import Link from "next/link";
import Card from "@/components/Card";
import Chip from "@/components/Chip";
import ChipsHolder from "@/components/ChipsHolder";
import GridRevealImage from "@/components/effects/GridRevealImage";
import { fileToUrl } from "@/lib/file";
import ImageWithFallback from "@/components/ImageWithFallback";
import { redirect } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
    params: { partner_id: string };
};
export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const fetchPartners = await getPublicPartnerById(params.partner_id);
    if (!fetchPartners.success) {
        redirect("/");
    }
    const partner = fetchPartners.data.partner;
    if (partner) {
        return {
            title: partner.firstName + "" + partner.lastName + " - Radice",
            description: partner.description,
            openGraph: {
                images: [
                    {
                        url: fileToUrl(
                            partner.profileUrl,
                            "/missing-profile.png",
                        ),
                        alt:
                            partner.firstName +
                            "" +
                            partner.lastName +
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
                            partner.profileUrl,
                            "/missing-profile.png",
                        ),
                        alt:
                            partner.firstName +
                            "" +
                            partner.lastName +
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

export default async function PartnerPublicProfilePage({
    params,
}: {
    params: { partner_id: string };
}) {
    const fetchPartners = await getPublicPartnerById(params.partner_id);

    if (!fetchPartners.success) {
        redirect("/");
    }
    //console.log(fetchPartners);
    const partner = fetchPartners.data.partner;

    const fetchProjects = await getPublicProjectByPartnerId(params.partner_id);
    if (!fetchProjects.success) {
        redirect("/");
    }
    const projects = fetchProjects.data.projects;
    return (
        <div>
            <Navbar />
            {partner && (
                <div className="container min-h-[70vh] mx-auto py-8 grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                        <div className="w-[180px] h-[220px] relative">
                            <GridRevealImage
                                variant="light"
                                canReveal
                                width={180}
                                height={220}
                                src={fileToUrl(
                                    partner.profileUrl,
                                    "/missing-profile.png",
                                )}
                                fill
                                className="object-contain"
                                alt=""
                            />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">
                                {partner.firstName + " " + partner.lastName}
                            </h1>
                            <h2 className="">{partner.email}</h2>
                        </div>
                        {partner.description && <p>{partner.description}</p>}
                    </div>
                    <div>
                        <h2 className="font-bold mb-2 text-lg">Researches:</h2>
                        {projects.length <= 0 && <p>No researches yet</p>}
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
                                                <ImageWithFallback
                                                    src={fileToUrl(
                                                        project.logoUrl,
                                                    )}
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
