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

    function setItemsCheckListDisplayWithLimit(
        checkListDisplay: CheckBoxElement[],
        limit: number = 5,
    ) {
        // if already checked show the checked items, don't limit the checked. If not checked, limit the unchecked items
        const checkedItems = checkListDisplay.filter((item) => item.checked);
        const uncheckedItems = checkListDisplay.filter((item) => !item.checked);

        if (checkedItems.length > limit) {
            setItemsCheckListDisplay(checkedItems);
        } else {
            // example: limit = 5, checked = 3, unchecked = 10, display = 5 (3 checked + 2 unchecked)
            setItemsCheckListDisplay(
                checkedItems.concat(
                    uncheckedItems.slice(0, limit - checkedItems.length),
                ),
            );
        }
    }

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
        setItemsCheckListDisplayWithLimit(
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
            setItemsCheckListDisplayWithLimit(updateCheckedItems);
        }
    }

    function onCancel() {
        setCheckedItems(checkedItemsBeforeEdit);
        setItemsCheckListDisplayWithLimit(checkedItemsBeforeEdit);
        closeSelector();
    }

    function onConfirm() {
        setItemsCheckListDisplayWithLimit(checkedItems);
        closeSelector();
    }

    function onReset() {
        const comparedList = updateCheckedByTwoLists(
            itemsCheckList,
            originalSelectedCheckList,
        );

        setCheckedItems(comparedList);
        setItemsCheckListDisplayWithLimit(comparedList);
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
