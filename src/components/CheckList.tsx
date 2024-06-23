"use client";
import { useEffect, useState } from "react";

export interface CheckBoxElement {
    name: string;
    value: string;
    checked: boolean;
}

export default function CheckList({
    title,
    checkList,
    atLeastOne = false,
    disabled,
    onChange,
}: {
    title: string;
    checkList: CheckBoxElement[];
    atLeastOne?: boolean;
    disabled?: boolean;
    onChange?: (
        updatedList: CheckBoxElement[],
        changedCheckbox: CheckBoxElement,
    ) => void;
}) {
    const [checkboxElements, setCheckboxElements] = useState<CheckBoxElement[]>(
        [],
    );

    useEffect(() => {
        setCheckboxElements(checkList);
    }, [checkList]);

    const handleCheckboxChange = (index: number, checked: boolean) => {
        // for return 1 item
        const item = checkboxElements[index];
        item.checked = checked;

        const newList = checkboxElements.map((item, idx) => {
            if (idx === index) {
                return { ...item, checked };
            }
            return item;
        });

        if (atLeastOne && newList.every((item) => !item.checked)) {
            newList[index].checked = true;
        }

        setCheckboxElements(newList);
        if (onChange) {
            onChange(newList, item);
        }
    };

    return (
        <div>
            <h1 className="font-bold">{title}: </h1>
            <ul>
                {checkboxElements.map((checkboxElement, index) => (
                    <li
                        className="flex items-center gap-2 capitalize"
                        key={checkboxElement.name + checkboxElement.value}
                    >
                        <input
                            disabled={disabled}
                            className="w-4 aspect-square flex-shrink-0"
                            type="checkbox"
                            id={checkboxElement.name + checkboxElement.value}
                            checked={checkboxElement.checked}
                            onChange={(e) =>
                                handleCheckboxChange(index, e.target.checked)
                            }
                        />
                        <label
                            htmlFor={
                                checkboxElement.name + checkboxElement.value
                            }
                        >
                            {checkboxElement.name}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}
