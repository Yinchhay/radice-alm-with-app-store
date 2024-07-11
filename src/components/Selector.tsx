"use client";
import Card from "./Card";
import CheckList from "./CheckList";
import InputField from "./InputField";
import Overlay from "./Overlay";
import Button from "./Button";
import { useDebouncedCallback } from "use-debounce";
import { RefObject, useEffect, useRef, useState } from "react";
import Loading from "./Loading";

interface CheckBoxElement {
    name: string;
    value: string;
    checked: boolean;
}

export default function Selector({
    className = "",
    selectorTitle,
    searchPlaceholder,
    searchDelay = 300,
    checkListTitle,
    checkList,
    searchTerm,
    onSearchChange,
    onCheckChange,
    onConfirm,
    onCancel,
}: {
    className?: string;
    selectorTitle: string;
    searchPlaceholder: string;
    searchDelay?: number;
    checkListTitle: string;
    checkList: CheckBoxElement[];
    searchTerm?: string;
    onSearchChange?: (searchText: string) => Promise<void> | void;
    onCheckChange?: (
        updatedList: CheckBoxElement[],
        changedCheckbox: CheckBoxElement,
    ) => void;
    onConfirm?: () => void;
    onCancel?: () => void;
}) {
    // a state to ensure that the checkList is re-rendered
    const [checkListState, setCheckListState] =
        useState<CheckBoxElement[]>(checkList);
    const [loading, setLoading] = useState(false);

    const searchDebounced = useDebouncedCallback(async (searchText: string) => {
        try {
            if (onSearchChange) {
                setLoading(true);
                await onSearchChange(searchText);
            }
        } finally {
            setLoading(false);
        }
    }, searchDelay);

    useEffect(() => {
        setCheckListState(checkList);
    }, [checkList]);

    return (
        <Overlay onClose={onCancel}>
            <Card className={["max-w-[420px] grid gap-4", className].join(" ")}>
                <h1 className="text-2xl font-bold text-center">
                    {selectorTitle}
                </h1>
                <InputField
                    defaultValue={searchTerm}
                    isSearch={true}
                    placeholder={searchPlaceholder}
                    onChange={(e) => searchDebounced(e.target.value)}
                />
                {loading ? (
                    <Loading />
                ) : checkListState.length > 0 ? (
                    <CheckList
                        title={checkListTitle}
                        checkList={checkListState}
                        onChange={(updatedList, changedCheckbox) => {
                            setCheckListState(updatedList);
                            if (onCheckChange) {
                                onCheckChange(updatedList, changedCheckbox);
                            }
                        }}
                    />
                ) : (
                    <p className="text-center text-gray-500">No result</p>
                )}
                <div className="flex gap-3 justify-end">
                    <Button onClick={onCancel} type="button">
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={onConfirm} type="button">
                        Add
                    </Button>
                </div>
            </Card>
        </Overlay>
    );
}
