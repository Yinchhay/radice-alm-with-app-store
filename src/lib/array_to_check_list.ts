import { CheckBoxElement } from "@/components/CheckList";

export function arrayToCheckList<T>(
    array: T[],
    nameKey: keyof T,
    valueKey: keyof T,
): CheckBoxElement[] {
    return array.map((item) => ({
        name: item[nameKey] as unknown as string,
        value: item[valueKey] as unknown as string,
        checked: false,
    }));
}
