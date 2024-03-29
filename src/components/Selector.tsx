import { ChangeEvent } from "react";
import Card from "./Card";
import CheckList from "./CheckList";
import InputField from "./InputField";
import Overlay from "./Overlay";
import Button from "./Button";

interface CheckBoxElement {
    name: string;
    value: string;
    checked: boolean;
}

export default function Selector({
    className = "",
    selectorTitle,
    searchPlaceholder,
    checkListTitle,
    checkList,
    onSearchChange,
    onCheckChange,
    onConfirm,
    onCancel,
}: {
    className?: string;
    selectorTitle: string;
    searchPlaceholder: string;
    checkListTitle: string;
    checkList: CheckBoxElement[];
    onSearchChange?: (searchText: string) => void;
    onCheckChange?: (updatedList: CheckBoxElement[]) => void;
    onConfirm?: () => void;
    onCancel?: () => void;
}) {
    return (
        <Overlay onClose={onCancel}>
            <Card className={["max-w-[420px] grid gap-4", className].join(" ")}>
                <h1 className="text-2xl font-bold text-center">
                    {selectorTitle}
                </h1>
                <InputField
                    isSearch={true}
                    placeholder={searchPlaceholder}
                    onChange={(e) => {
                        if (onSearchChange) {
                            onSearchChange(e.target.value);
                        }
                    }}
                />
                <CheckList
                    title={checkListTitle}
                    checkList={checkList}
                    onChange={(updatedList) => {
                        if (onCheckChange) {
                            onCheckChange(updatedList);
                        }
                    }}
                />
                <div className="flex gap-3 justify-end">
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button variant="primary" onClick={onConfirm}>
                        Add
                    </Button>
                </div>
            </Card>
        </Overlay>
    );
}
