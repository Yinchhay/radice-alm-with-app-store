import { DropdownElement } from "@/components/Dropdown";

export function arrayToDropdownList<T>(
    array: T[],
    nameKey: keyof T,
    valueKey: keyof T,
): DropdownElement[] {
    return array.map((item) => ({
        name: item[nameKey] as unknown as string,
        value: item[valueKey] as unknown as string,
    }));
}
