import { UserSkillSet } from "@/drizzle/schema";
import { skillSetToChips } from "@/lib/utils";
import ChipsHolder from "./ChipsHolder";
import Tooltip from "./Tooltip";
import Chip from "./Chip";

export default function SkillSetChips({
    skillSets,
    dashboard = false,
}: {
    skillSets: UserSkillSet[] | null;
    dashboard?: boolean;
}) {
    const chips = skillSetToChips(skillSets);
    console.log(chips);
    if (dashboard) {
        return (
            <div>
                <h3 className="font-bold text-lg mb-1">Skill Sets</h3>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <h4 className="font-bold">Know:</h4>
                        {chips.Know.length > 0 ? (
                            <ChipsHolder>
                                {chips.Know.map((skill, i) => {
                                    return (
                                        <Chip
                                            className="rounded-sm outline outline-1 outline-gray-300 dark:outline-gray-600 dark:bg-gray-700"
                                            textClassName="text-black"
                                            bgClassName="bg-white"
                                        >
                                            {skill}
                                        </Chip>
                                    );
                                })}
                            </ChipsHolder>
                        ) : (
                            <p>None</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <h4 className="font-bold">Do:</h4>
                        {chips.Do.length > 0 ? (
                            <ChipsHolder>
                                {chips.Do.map((skill, i) => {
                                    return (
                                        <Chip
                                            className="rounded-sm outline outline-1 outline-gray-300 dark:outline-gray-600 dark:bg-gray-700"
                                            textClassName="text-black"
                                            bgClassName="bg-white"
                                        >
                                            {skill}
                                        </Chip>
                                    );
                                })}
                            </ChipsHolder>
                        ) : (
                            <p>None</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <h4 className="font-bold">Teach:</h4>
                        {chips.Teach.length > 0 ? (
                            <ChipsHolder>
                                {chips.Teach.map((skill, i) => {
                                    return (
                                        <Chip
                                            className="rounded-sm outline outline-1 outline-gray-300 dark:outline-gray-600 dark:bg-gray-700"
                                            textClassName="text-black"
                                            bgClassName="bg-white"
                                        >
                                            {skill}
                                        </Chip>
                                    );
                                })}
                            </ChipsHolder>
                        ) : (
                            <p>None</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }
    return (
        <>
            {(chips.Know.length > 0 ||
                chips.Do.length > 0 ||
                chips.Teach.length > 0) && (
                <div>
                    <h3 className="font-bold text-lg mb-1">Skill Sets</h3>
                    <div className="flex flex-col gap-2">
                        {chips.Know.length > 0 && (
                            <div className="flex gap-2">
                                <h4 className="font-bold">Know:</h4>
                                <ChipsHolder>
                                    {chips.Know.map((skill, i) => {
                                        return (
                                            <Chip
                                                className="rounded-sm"
                                                textClassName="text-white"
                                                bgClassName="bg-black"
                                            >
                                                {skill}
                                            </Chip>
                                        );
                                    })}
                                </ChipsHolder>
                            </div>
                        )}
                        {chips.Do.length > 0 && (
                            <div className="flex gap-2">
                                <h4 className="font-bold">Do:</h4>
                                <ChipsHolder>
                                    {chips.Do.map((skill, i) => {
                                        return (
                                            <Chip
                                                className="rounded-sm"
                                                textClassName="text-white"
                                                bgClassName="bg-black"
                                            >
                                                {skill}
                                            </Chip>
                                        );
                                    })}
                                </ChipsHolder>
                            </div>
                        )}
                        {chips.Teach.length > 0 && (
                            <div className="flex gap-2">
                                <h4 className="font-bold">Teach:</h4>
                                <ChipsHolder>
                                    {chips.Teach.map((skill, i) => {
                                        return (
                                            <Chip
                                                className="rounded-sm"
                                                textClassName="text-white"
                                                bgClassName="bg-black"
                                            >
                                                {skill}
                                            </Chip>
                                        );
                                    })}
                                </ChipsHolder>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
