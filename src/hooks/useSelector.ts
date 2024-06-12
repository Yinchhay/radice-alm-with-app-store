import { CheckBoxElement } from "@/components/CheckList";
import { arrayToCheckList } from "@/lib/array_to_check_list";
import { useEffect, useState } from "react";

export function useSelector<T>(
    itemsCallback: (search: string) => Promise<T[]>,
    originalSelectedItems: T[],
    nameKey: keyof T,
    valueKey: keyof T,
    secondKey?: keyof T,
) {
    const [showSelectorOverlay, setShowSelectorOverlay] =
        useState<boolean>(false);
    const originalSelectedCheckList: CheckBoxElement[] = arrayToCheckList(
        originalSelectedItems,
        nameKey,
        valueKey,
        secondKey,
    ).map((item) => ({ ...item, checked: true }));

    const [items, setItems] = useState<T[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [itemsCheckList, setItemsCheckList] = useState<CheckBoxElement[]>([]);

    // obj store to allow he user use this variable to check for object details
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
        // merge fetchedList with checkedList
        // also prioritize checkedList over fetchedList
        const combinedList = fetchedList.map((fetchedItem) => {
            const checkedItem = checkedList.find(
                (item) => item.value === fetchedItem.value,
            );
            return checkedItem
                ? { ...fetchedItem, checked: checkedItem.checked }
                : fetchedItem;
        });

        // remove duplicates
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

        const icl = arrayToCheckList(
            itemsFetched,
            nameKey,
            valueKey,
            secondKey,
        );
        let mergedCheckList = mergeAndRemoveDuplicates(icl, checkedItems);
        saveCheckedItemsValues(itemsFetched);

        setItemsCheckList([...mergedCheckList]);
    }

    useEffect(() => {
        if (items.length === 0) {
            onSearchChange("");

            // store the original selected items to checkedItemsValues in case fetch does not return selected items
            saveCheckedItemsValues(originalSelectedItems);
        }
    }, []);

    // this will be used to allow the user to check object values
    function saveCheckedItemsValues(fetchedItems: T[] = items) {
        // append obj value to checkedItemsValues. we basically append only, no remove
        const newCheckedItemsValues = fetchedItems
            // filter take only the items that are checked
            .filter((item) =>
                checkedItems.find(
                    (checkedItem) => checkedItem.value === item[valueKey],
                ),
            )
            // filter out the items that are already in checkedItemsValues to avoid duplicates
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
            arrayToCheckList(items, nameKey, valueKey, secondKey),
            beforeEditCheckedItems,
        );

        setItemsCheckList([...restoredList]);
        setShowSelectorOverlay(false);
    }

    function onReset() {
        setCheckedItems([...originalSelectedCheckList]);

        const resetList = mergeAndRemoveDuplicates(
            arrayToCheckList(items, nameKey, valueKey, secondKey),
            originalSelectedCheckList,
        );

        setItemsCheckList([...resetList]);
    }

    function onConfirm() {
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

    function onCheckChange(
        updatedList: CheckBoxElement[],
        updatedItem: CheckBoxElement,
    ) {
        // using updatedItem to ensure data is updated and consistency
        if (updatedItem.checked) {
            setCheckedItems((prev) => [...prev, updatedItem]);
            return;
        }

        const newCheckedItems = checkedItems.filter(
            (item) => item.value !== updatedItem.value,
        );
        setCheckedItems(newCheckedItems);
    }

    useEffect(() => {
        // if we don't filter by search, it will show the checked items as well even tho it doesn't match the search term
        const filteredBySearch = itemsCheckList.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );

        // if the filtered list is the same as the current itemsCheckList, don't update
        if (
            JSON.stringify(filteredBySearch) === JSON.stringify(itemsCheckList)
        ) {
            return;
        }

        setItemsCheckList([...filteredBySearch]);
    }, [itemsCheckList]);

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
