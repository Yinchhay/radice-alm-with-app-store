import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export interface DropdownElement {
    name: string;
    value: string;
}

export default function Dropdown({
    dropdownList,
    defaultSelectedElement,
    onChange,
    onChangeIndex,
}: {
    dropdownList: DropdownElement[];
    defaultSelectedElement?: DropdownElement;
    onChange?: (selectedElement: DropdownElement) => void;
    onChangeIndex?: (index: number) => void;
}) {
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [selectedElement, setSelectedElement] = useState<DropdownElement>(
        defaultSelectedElement ? defaultSelectedElement : dropdownList[0],
    );
    useEffect(() => {
        setSelectedElement(
            defaultSelectedElement ? defaultSelectedElement : dropdownList[0],
        );
    }, [defaultSelectedElement]);
    return (
        <div
            className="w-full relative"
            onBlur={() => {
                if (!isHovering) {
                    setShowDropdown(false);
                }
            }}
        >
            <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full bg-white text-black rounded-md outline outline-1 outline-gray-300 pl-3 pr-2 py-1 text-start flex items-center justify-between"
            >
                <h4>{selectedElement?.name}</h4>
                <IconChevronDown size={20} />
            </button>
            {showDropdown && (
                <div
                    onMouseEnter={() => {
                        setIsHovering(true);
                    }}
                    onMouseLeave={() => {
                        setIsHovering(false);
                    }}
                    className="absolute w-full bg-white rounded-md outline outline-1 outline-gray-300 p-1 mt-1 z-[1]"
                >
                    {dropdownList.map((item, index) => {
                        return (
                            <button
                                type="button"
                                key={"dropdown" + item.name + item.value}
                                onClick={() => {
                                    setSelectedElement(item);
                                    if (onChange) onChange(item);
                                    if (onChangeIndex) onChangeIndex(index);
                                    setShowDropdown(false);
                                }}
                                className="w-full px-1 rounded-md py-1 bg-white hover:brightness-90 text-start flex items-center gap-2"
                            >
                                <IconCheck
                                    size={16}
                                    opacity={
                                        item.value == selectedElement?.value
                                            ? 1
                                            : 0
                                    }
                                />
                                <h4>{item.name}</h4>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
