import { CheckBoxElement } from "@/components/CheckList";
import { arrayToCheckList } from "@/lib/array_to_check_list";
import { useEffect, useState } from "react";

export function useSelector<T>(
    itemsCallback: (search: string) => Promise<T[]>,
    originalSelectedItems: T[],
    nameKey: keyof T,
    valueKey: keyof T,
) {
    const [showSelectorOverlay, setShowSelectorOverlay] =
        useState<boolean>(false);
    const originalSelectedCheckList: CheckBoxElement[] = arrayToCheckList(
        originalSelectedItems,
        nameKey,
        valueKey,
    ).map((item) => ({ ...item, checked: true }));
    const [items, setItems] = useState<T[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [itemsCheckList, setItemsCheckList] = useState<CheckBoxElement[]>([]);
    const [checkedItemsValues, setCheckedItemsValues] = useState<T[]>([]);
    const [checkedItems, setCheckedItems] = useState<CheckBoxElement[]>(
        originalSelectedCheckList,
    );
    const [beforeEditCheckedItems, setBeforeEditCheckedItems] = useState<
        CheckBoxElement[]
    >([]);

    function mergeAndRemoveDuplicates(
        fetchedList: CheckBoxElement[],
        checkedList: CheckBoxElement[],
    ): CheckBoxElement[] {
        const combinedList = fetchedList.map((fetchedItem) => {
            const checkedItem = checkedList.find(
                (item) => item.value === fetchedItem.value,
            );
            return checkedItem
                ? { ...fetchedItem, checked: checkedItem.checked }
                : fetchedItem;
        });

        checkedList.forEach((checkedItem) => {
            if (
                !combinedList.find((item) => item.value === checkedItem.value)
            ) {
                combinedList.push(checkedItem);
            }
        });

        return combinedList;
    }

    async function onSearchChange(search: string) {
        setSearchTerm(search);

        const itemsFetched = await itemsCallback(search);
        setItems(itemsFetched);

        const icl = arrayToCheckList(itemsFetched, nameKey, valueKey);
        const mergedCheckList = mergeAndRemoveDuplicates(icl, checkedItems);
        saveCheckedItemsValues(itemsFetched);

        setItemsCheckList([...mergedCheckList]);
    }

    useEffect(() => {
        if (items.length === 0) {
            onSearchChange("");
        }
    }, []);

    // this will be used to allow the user to check object values
    function saveCheckedItemsValues(fetchedItems: T[] = items) {
        // append obj value to checkedItemsValues. we basically append only, no remove
        const newCheckedItemsValues = fetchedItems
            .filter((item) =>
                checkedItems.find((checkedItem) => checkedItem.value === item[valueKey]),
            )
            .filter((item) => !checkedItemsValues.includes(item));
        setCheckedItemsValues((prev) => [...prev, ...newCheckedItemsValues]);
    }

    function onOpenSelector() {
        setBeforeEditCheckedItems([...checkedItems]);
        setShowSelectorOverlay(true);
    }

    function onCloseSelector() {
        setCheckedItems([...beforeEditCheckedItems]);

        const restoredList = mergeAndRemoveDuplicates(
            arrayToCheckList(items, nameKey, valueKey),
            beforeEditCheckedItems,
        );
        setItemsCheckList([...restoredList]);
        setShowSelectorOverlay(false);
    }

    function onReset() {
        setCheckedItems([...originalSelectedCheckList]);

        const resetList = mergeAndRemoveDuplicates(
            arrayToCheckList(items, nameKey, valueKey),
            originalSelectedCheckList,
        );
        setItemsCheckList([...resetList]);
    }

    function onConfirm() {
        const newCheckedItems = itemsCheckList.filter((item) => item.checked);
        setCheckedItems(newCheckedItems);

        setShowSelectorOverlay(false);
    }

    function onRemoveItem(value: string) {
        const newCheckedItems = checkedItems.filter(
            (item) => item.value !== value,
        );
        setCheckedItems(newCheckedItems);

        setItemsCheckList((prevList) =>
            prevList.map((item) =>
                item.value === value ? { ...item, checked: false } : item,
            ),
        );
    }

    function onCheckChange(updatedList: CheckBoxElement[], updatedItem: CheckBoxElement) {
        setCheckedItems(updatedList.filter((item) => item.checked));
    }

    useEffect(() => {
        saveCheckedItemsValues();
    }, [checkedItems]);

    return {
        showSelectorOverlay,
        itemsCheckList,
        checkedItems,
        searchTerm,
        checkedItemsValues,
        onSearchChange,
        onCheckChange,
        onOpenSelector,
        onCloseSelector,
        onReset,
        onConfirm,
        onRemoveItem,
    };
}
