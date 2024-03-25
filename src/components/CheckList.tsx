"use client";
import { useEffect, useState } from "react";
interface CheckBoxElement {
    name: string;
    value: string;
    checked: boolean;
}

export default function CheckList({
    title,
    checkList,
    atLeastOne = false,
    onChange,
}: {
    title: string;
    checkList: CheckBoxElement[];
    atLeastOne?: boolean;
    onChange?: (updatedList: CheckBoxElement[]) => void;
}) {
    const [checkboxElements, setCheckboxElements] = useState<CheckBoxElement[]>(
        () =>
            checkList.map((element: CheckBoxElement, index: number) => ({
                name: element.name,
                value: element.value,
                checked: element.checked, // Set checked based on defaultActive
            })),
    );
    return (
        <div>
            <h1 className="font-bold">{title}: </h1>
            <ul>
                {checkboxElements.map((checkboxElement, index) => {
                    return (
                        <li
                            className="flex items-center gap-2"
                            key={checkboxElement.name + checkboxElement.value}
                        >
                            <input
                                className="w-4 aspect-square flex-shrink-0"
                                type="checkbox"
                                id={
                                    checkboxElement.name + checkboxElement.value
                                }
                                checked={checkboxElement.checked}
                                onChange={(e) => {
                                    const newList = checkboxElements.map(
                                        (item, idx) => {
                                            if (idx === index) {
                                                return {
                                                    ...item,
                                                    checked: e.target.checked,
                                                };
                                            }
                                            return item;
                                        },
                                    );

                                    // If atLeastOne is true and all checkboxes are unchecked,
                                    // prevent unchecking the current checkbox
                                    if (
                                        atLeastOne &&
                                        newList.every(
                                            (item) =>
                                                !item.checked &&
                                                item.checked !== undefined,
                                        )
                                    ) {
                                        // If the current checkbox is being unchecked, prevent it
                                        if (!e.target.checked) {
                                            newList[index].checked = true;
                                        }
                                    }

                                    // Check if there is an actual change in the checkbox state
                                    const stateChanged =
                                        JSON.stringify(newList) !==
                                        JSON.stringify(checkboxElements);

                                    // If there is a change, update the state and call onChange
                                    if (stateChanged) {
                                        setCheckboxElements(newList);
                                        // Call onChange with the updated checkboxElements
                                        if (onChange) {
                                            onChange(newList);
                                        }
                                    }
                                }}
                            />
                            <label
                                htmlFor={
                                    checkboxElement.name + checkboxElement.value
                                }
                            >
                                {checkboxElement.name}
                            </label>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
