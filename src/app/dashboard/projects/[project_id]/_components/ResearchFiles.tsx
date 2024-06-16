"use client";

import Card from "@/components/Card";
import { useToast } from "@/components/Toaster";
import { FileBelongTo } from "@/drizzle/schema";
import { fileToUrl } from "@/lib/file";
import { extractFileDetails } from "@/lib/utils";
import { getOneAssociatedProject } from "@/repositories/project";
import { IconFileDescription } from "@tabler/icons-react";
import Link from "next/link";

export default function ResearchFiles({
    files,
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
}) {
    const { addToast } = useToast();
    return (
        <Card className="grid gap-4 w-full px-0">
            <h2 className="font-bold text-xl px-6">Research Files</h2>
            <ul className="flex flex-col w-ful">
                {files.map((file, i) => {
                    const fileDetail = extractFileDetails(file.filename);
                    return (
                        <Link
                            key={"file-" + file.filename}
                            onClick={() => {
                                addToast(
                                    <div>Downloaded {fileDetail.name}</div>,
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
        </Card>
    );
}
