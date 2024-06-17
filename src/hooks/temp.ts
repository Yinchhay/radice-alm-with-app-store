import { CheckBoxElement } from "@/components/CheckList";
import { arrayToCheckList } from "@/lib/array_to_check_list";
import { useEffect, useState } from "react";

/**
 * Custom hook to manage a selector overlay simplified explanation:
 * checkedItems: list of items that are checked in the selector overlay
 * checkedItemsValues: list of items that are checked in the selector overlay, but as value objects fetched from the server
 * itemsCheckList: checklist of items fetched from the server to be displayed in the selector overlay
 * searchTerm: search term to filter the items in the selector overlay
 */
export function useSelector<T>(
    itemsCallback: (search: string) => Promise<T[]>,
    originalSelectedItems: T[],
    nameKey: keyof T,
    valueKey: keyof T,
    secondKey?: keyof T,
) {
    const [showSelectorOverlay, setShowSelectorOverlay] = useState(false);
    const [items, setItems] = useState<T[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsCheckList, setItemsCheckList] = useState<CheckBoxElement[]>([]);
    const [checkedItemsValues, setCheckedItemsValues] = useState<T[]>([]);
    const originalSelectedCheckList: CheckBoxElement[] = arrayToCheckList(
        originalSelectedItems,
        nameKey,
        valueKey,
        secondKey,
    ).map((item) => ({ ...item, checked: true }));
    const [checkedItems, setCheckedItems] = useState<CheckBoxElement[]>(
        originalSelectedCheckList,
    );
    const [beforeEditCheckedItems, setBeforeEditCheckedItems] = useState<
        CheckBoxElement[]
    >([]);

    const mergeAndRemoveDuplicates = (
        fetchedList: CheckBoxElement[],
        checkedList: CheckBoxElement[],
    ): CheckBoxElement[] => {
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
    };

    const onSearchChange = async (search: string) => {
        setSearchTerm(search);

        const itemsFetched = await itemsCallback(search);
        setItems(itemsFetched);

        const icl = arrayToCheckList(
            itemsFetched,
            nameKey,
            valueKey,
            secondKey,
        );
        const mergedCheckList = mergeAndRemoveDuplicates(icl, checkedItems);
        saveCheckedItemsValues(itemsFetched);

        setItemsCheckList(mergedCheckList);
    };

    useEffect(() => {
        if (!items.length) {
            onSearchChange("");
        }
    }, []);

    const saveCheckedItemsValues = (fetchedItems: T[] = items) => {
        const newCheckedItemsValues = [
            ...checkedItemsValues,
            ...fetchedItems
                .filter((item) =>
                    checkedItems.some(
                        (checkedItem) => checkedItem.value === item[valueKey],
                    ),
                )
                .filter((item) => !checkedItemsValues.includes(item)),
        ];

        setCheckedItemsValues(newCheckedItemsValues);
    };

    const onOpenSelector = () => {
        setBeforeEditCheckedItems([...checkedItems]);
        setShowSelectorOverlay(true);
    };

    const onCloseSelector = () => {
        const restoredList = mergeAndRemoveDuplicates(
            arrayToCheckList(items, nameKey, valueKey, secondKey),
            beforeEditCheckedItems,
        );

        setItemsCheckList(restoredList);
        setShowSelectorOverlay(false);
    };

    const onReset = () => {
        setCheckedItems([...originalSelectedCheckList]);
        const resetList = mergeAndRemoveDuplicates(
            arrayToCheckList(items, nameKey, valueKey, secondKey),
            originalSelectedCheckList,
        );

        setItemsCheckList(resetList);
    };

    const onConfirm = () => setShowSelectorOverlay(false);

    const onRemoveItem = (value: string) => {
        const newCheckedItems = checkedItems.filter(
            (item) => item.value !== value,
        );
        setCheckedItems(newCheckedItems);

        const updatedItemsCheckList = itemsCheckList.map((item) => {
            if (item.value === value) {
                return { ...item, checked: false };
            }
            return item;
        });
        setItemsCheckList(updatedItemsCheckList);

        const newCheckedItemsValues = checkedItemsValues.filter(
            (item) => item[valueKey] !== value,
        );
        setCheckedItemsValues(newCheckedItemsValues);
    };

    const onCheckChange = (
        updatedList: CheckBoxElement[],
        updatedItem: CheckBoxElement,
    ) => {
        const newCheckedItems = updatedItem.checked
            ? [...checkedItems, updatedItem]
            : checkedItems.filter((item) => item.value !== updatedItem.value);
        setCheckedItems(newCheckedItems);
    };

    useEffect(() => {
        const filteredBySearch = itemsCheckList.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );

        if (
            JSON.stringify(filteredBySearch) !== JSON.stringify(itemsCheckList)
        ) {
            setItemsCheckList(filteredBySearch);
        }
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
