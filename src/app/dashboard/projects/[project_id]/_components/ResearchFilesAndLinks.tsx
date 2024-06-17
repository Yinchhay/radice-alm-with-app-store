"use client";

import Card from "@/components/Card";
import { useToast } from "@/components/Toaster";
import Tooltip from "@/components/Tooltip";
import { FileBelongTo, ProjectLink } from "@/drizzle/schema";
import { fileToUrl } from "@/lib/file";
import { extractFileDetails } from "@/lib/utils";
import { getOneAssociatedProject } from "@/repositories/project";
import { IconFileDescription } from "@tabler/icons-react";
import Link from "next/link";

export default function ResearchFilesAndLinks({
    files,
    links,
}: {
    files: {
        id: number;
        createdAt: Date | null;
        userId: string | null;
        projectId: number | null;
        filename: string;
        size: string;
        belongTo: FileBelongTo | null;
    }[];
    links: ProjectLink[] | null;
}) {
    const { addToast } = useToast();
    return (
        <Card className="grid gap-2 w-full px-0 py-4 mb-4" overWritePadding>
            <h2 className="font-bold text-xl px-6">Research Files</h2>
            <ul className="flex flex-col w-ful">
                {files.map((file, i) => {
                    const fileDetail = extractFileDetails(file.filename);
                    return (
                        <Link
                            key={"file-" + file.filename}
                            onClick={() => {
                                addToast(
                                    <div>
                                        Downloaded{" "}
                                        {fileDetail.name + fileDetail.extension}
                                    </div>,
                                    3500,
                                );
                            }}
                            href={fileToUrl(file.filename)}
                            download
                            className="flex px-6 gap-2 items-center hover:bg-gray-200/40 transition-all py-2"
                        >
                            <IconFileDescription
                                className="shrink-0"
                                size={28}
                                stroke={1}
                            />
                            <h3 className="break-words w-[180px]">
                                {fileDetail.name + fileDetail.extension}
                            </h3>
                        </Link>
                    );
                })}
            </ul>
            {links && (
                <>
                    <div className="px-6">
                        <div className="w-[80%] h-[1px] bg-gray-300 mt-1 mb-2"></div>
                    </div>
                    <div className="flex flex-col w-full gap-2">
                        {links.map((link, i) => {
                            return (
                                <div className="px-6" key={`link-${i}`}>
                                    <h3 className="font-bold">{link.title}</h3>
                                    <Tooltip
                                        title={link.link}
                                        position="left"
                                        className="text-blue-500"
                                    >
                                        <Link
                                            href={link.link}
                                            className="ml-4 truncate text-ellipsis w-[200px] block text-blue-500"
                                            target="_blank"
                                        >
                                            {link.link}
                                        </Link>
                                    </Tooltip>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </Card>
    );
}
