// hooks/useSelector.ts

import { CheckBoxElement } from "@/components/CheckList";
import { arrayToCheckList } from "@/lib/array_to_check_list";
import { useState, useEffect } from "react";

/**
 * Ensure that first arg is the entire data in the system, and the second arg is the selected data
 * Keep in mind this is only for small data, don't use for large data because it will be slow
 */
export function useSelector<T>(
    items: T[],
    originalSelectedItems: T[],
    nameKey: keyof T,
    valueKey: keyof T,
) {
    const [showSelectorOverlay, setShowSelectorOverlay] = useState(false);
    const itemsCheckList = arrayToCheckList(items, nameKey, valueKey);
    const originalSelectedCheckList = arrayToCheckList(
        originalSelectedItems,
        nameKey,
        valueKey,
    ).map((item) => ({ ...item, checked: true }));

    const [checkedItemsBeforeEdit, setCheckedItemsBeforeEdit] = useState<
        CheckBoxElement[]
    >([]);
    const [checkedItems, setCheckedItems] = useState<CheckBoxElement[]>([]);
    const [itemsCheckListDisplay, setItemsCheckListDisplay] = useState<
        CheckBoxElement[]
    >([]);

    useEffect(() => {
        onReset();
    }, [items, originalSelectedItems]);

    function updateChecked(
        list: CheckBoxElement[],
        changedItem: CheckBoxElement,
        checked: boolean,
    ): CheckBoxElement[] {
        return list.map((item) =>
            item.value === changedItem.value ? { ...item, checked } : item,
        );
    }

    function updateCheckedByTwoLists(
        listToUpdate: CheckBoxElement[],
        listToCheck: CheckBoxElement[],
    ): CheckBoxElement[] {
        return listToUpdate.map((item) => {
            const checked = listToCheck.find(
                (check) => check.value === item.value,
            )?.checked;
            return { ...item, checked: checked ?? false };
        });
    }

    function openSelector() {
        setCheckedItemsBeforeEdit(structuredClone(checkedItems));
        setShowSelectorOverlay(true);
    }

    function closeSelector() {
        setShowSelectorOverlay(false);
    }

    function onSearchChange(search: string) {
        const filteredItems = itemsCheckList.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase()),
        );
        setItemsCheckListDisplay(
            updateCheckedByTwoLists(filteredItems, checkedItems),
        );
    }

    function onCheckChange(
        updatedList: CheckBoxElement[],
        changedCheckbox: CheckBoxElement,
        updateDisplayCheckList: boolean = false,
    ) {
        const updateCheckedItems = updateChecked(
            checkedItems,
            changedCheckbox,
            changedCheckbox.checked,
        );
        setCheckedItems(updateCheckedItems);

        if (updateDisplayCheckList) {
            setItemsCheckListDisplay(updateCheckedItems);
        }
    }

    function onCancel() {
        setCheckedItems(checkedItemsBeforeEdit);
        setItemsCheckListDisplay(checkedItemsBeforeEdit);
        closeSelector();
    }

    function onConfirm() {
        setItemsCheckListDisplay(checkedItems);
        closeSelector();
    }

    function onReset() {
        const comparedList = updateCheckedByTwoLists(
            itemsCheckList,
            originalSelectedCheckList,
        );

        setCheckedItems(comparedList);
        setItemsCheckListDisplay(comparedList);
    }

    return {
        showSelectorOverlay,
        openSelector,
        closeSelector,
        onSearchChange,
        onCheckChange,
        onCancel,
        onConfirm,
        onReset,
        itemsCheckListDisplay,
        checkedItems,
    };
}
