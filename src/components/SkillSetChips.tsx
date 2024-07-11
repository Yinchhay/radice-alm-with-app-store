import { UserSkillSet } from "@/drizzle/schema";
import { skillSetToChips } from "@/lib/utils";
import ChipsHolder from "./ChipsHolder";
import Tooltip from "./Tooltip";
import Chip from "./Chip";

export default function SkillSetChips({
    skillSets,
}: {
    skillSets: UserSkillSet[] | null;
}) {
    const chips = skillSetToChips(skillSets);
    const chipKeys = Object.keys(chips) as (keyof typeof chips)[];

    return (
        <ChipsHolder>
            {Array.isArray(chipKeys) &&
                chipKeys.map((chipKey) => {
                    // don't show key that has empty array
                    if (chips[chipKey].length === 0) {
                        return;
                    }

                    return (
                        <Tooltip
                            key={chipKey}
                            title={chips[chipKey].join(", ")}
                        >
                            <Chip
                                className="rounded-sm"
                                textClassName="text-white"
                                bgClassName={[
                                    chipKey === "Do"
                                        ? "bg-green-500 dark:bg-green-500"
                                        : "",
                                    chipKey === "Know"
                                        ? "bg-blue-500 dark:bg-blue-500"
                                        : "",
                                    chipKey === "Teach"
                                        ? "bg-purple-500 dark:bg-purple-500 "
                                        : "",
                                ].join(" ")}
                            >
                                {chipKey}
                            </Chip>
                        </Tooltip>
                    );
                })}
        </ChipsHolder>
    );
}
