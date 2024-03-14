import { headers } from "next/headers";
import { revalidateTag } from "next/cache";

export const getBaseUrl = (): string => {
    return headers().get("x-forwarded-host") || "";
};

export const getFullUrl = (): string => {
    return headers().get("referer") || "";
}

/**
 * custom revalidateTag because I want to have type for it 
 * when passing generic to the function it will infer the type so that we can ensure that the tag 
 * is valid, if the tag is not valid typescript will show an error
 * example usage: revalidateTag<Generic in /repositories>("getUserById_C:123")
 * using array of tags: revalidateTags<Generic in /repositories>("getUserById_C:123", "getUserById_C:124")
 */
export const revalidateTags = <T>(...tags: T[]) => {
    for (const tag of tags) {
        revalidateTag(tag as string);
    }
}