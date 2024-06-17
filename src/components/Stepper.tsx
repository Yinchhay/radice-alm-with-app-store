import { ProjectStatusElement } from "@/lib/utils";
import { IconCheck, IconMinus } from "@tabler/icons-react";
import Card from "./Card";

export default function Stepper({
    projectStatus,
}: {
    projectStatus: ProjectStatusElement[];
}) {
    return (
        <Card className="grid">
            <h2 className="font-bold text-xl mb-4">Project Status</h2>
            {projectStatus.map((status, i) => {
                return (
                    <>
                        <div className="flex gap-2">
                            <div className="flex flex-col items-center">
                                {status.value ? (
                                    <div className="p-1 rounded-full bg-blue-500 text-white">
                                        <IconCheck />
                                    </div>
                                ) : (
                                    <div className="p-1 rounded-full bg-gray-200 text-gray-400">
                                        <IconMinus stroke={2.5} />
                                    </div>
                                )}
                                {i + 1 < projectStatus.length ? (
                                    <div
                                        className={`w-[3px] h-[20px] ${status.value || (i + 1 < projectStatus.length && projectStatus[i + 1].value) ? "bg-blue-500" : "bg-gray-400"}`}
                                    ></div>
                                ) : (
                                    ""
                                )}
                            </div>
                            <h4 className="mt-1">{status.name}</h4>
                        </div>
                    </>
                );
            })}
        </Card>
    );
}
