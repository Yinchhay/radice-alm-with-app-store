import { CheckBoxElement } from "@/components/CheckList";

export function arrayToCheckList<T>(
    array: T[],
    nameKey: keyof T,
    valueKey: keyof T,
    secondKey?: keyof T,
): CheckBoxElement[] {
    return array.map((item) => ({
        name: secondKey ? `${item[nameKey]} ${item[secondKey]}` : item[nameKey] as unknown as string,
        value: item[valueKey] as unknown as string,
        checked: false,
    }));
}
