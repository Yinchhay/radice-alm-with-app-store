import { CategoryAndProjects } from "@/repositories/project";
import { GetPublicProjectByIdReturnType } from "../api/public/projects/[project_id]/route";
import ImageWithFallback from "@/components/ImageWithFallback";

export default function ProjectList({
    categoryAndProjects,
    selectedProject,
    selectProject,
}: {
    categoryAndProjects: CategoryAndProjects;
    selectedProject: number;
    selectProject: (i: number) => void;
}) {
    const width = 80,
        height = 80;
    return (
        <div className="relative">
            <div className="w-[100px] h-[100px] bg-white absolute z-10 right-[100%] mt-[-8px]"></div>
            <div className="w-[180px] h-[100px] absolute  left-[85%]  mt-[-8px] bg-gradient-to-r from-transparent via-white to-white z-30 pointer-events-none"></div>
            <div className="w-[100px] h-[100px] absolute  left-[105%]  mt-[-8px] bg-white z-30 pointer-events-none"></div>
            <ul className="flex mb-[-4px] gap-2">
                {categoryAndProjects.projects.map((project, i) => {
                    return (
                        <button
                            onClick={() => selectProject(i)}
                            className={[
                                "flex-shrink-0 focus:outline-transparent  transition-all relative group cursor-pointer grid place-items-center w-[80px] h-[80px]",
                            ].join(" ")}
                            key={`${categoryAndProjects.name}-${project.name}-${project.id}`}
                        >
                            <ImageWithFallback
                                src={
                                    `/api/file?filename=${project.logoUrl}` ||
                                    "/placeholder.webp"
                                }
                                width={80}
                                height={80}
                                className={[
                                    "aspect-square object-cover duration-200 border border-gray-300",
                                    selectedProject == i
                                        ? "scale-[90%]"
                                        : "group-hover:scale-[90%]",
                                ].join(" ")}
                                alt=""
                            />{" "}
                            <div className="w-[80px] h-[80px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-20">
                                <div
                                    className={[
                                        "duration-150 group-active:duration-75 border-t border-l border-black w-5 h-5 bg-transparent absolute",
                                        selectedProject != i
                                            ? "top-[-.4rem] left-[-.4rem] opacity-0"
                                            : "top-[-.1rem] left-[-.1rem]",
                                    ].join(" ")}
                                ></div>
                                <div
                                    className={[
                                        "duration-150 group-active:duration-75 border-b border-l border-black w-5 h-5 bg-transparent absolute",
                                        selectedProject != i
                                            ? "bottom-[-.4rem] left-[-.4rem] opacity-0"
                                            : "bottom-[-.1rem] left-[-.1rem]",
                                    ].join(" ")}
                                ></div>
                                <div
                                    className={[
                                        "duration-150 group-active:duration-75 border-t border-r border-black w-5 h-5 bg-transparent absolute",
                                        selectedProject != i
                                            ? "top-[-.4rem] right-[-.4rem] opacity-0"
                                            : "top-[-.1rem] right-[-.1rem]",
                                    ].join(" ")}
                                ></div>
                                <div
                                    className={[
                                        "duration-150 group-active:duration-75 border-b border-r border-black w-5 h-5 bg-transparent absolute",
                                        selectedProject != i
                                            ? "bottom-[-.4rem] right-[-.4rem] opacity-0"
                                            : "bottom-[-.1rem] right-[-.1rem]",
                                    ].join(" ")}
                                ></div>
                            </div>
                        </button>
                    );
                })}
            </ul>
        </div>
    );
}
