import { getFullUrl } from "@/lib/server_utils";
import { localDebug } from "@/lib/utils";
import { redirect } from "next/navigation";

export default function NotFound() {
    // feel free to comment the localDebug if it's annoying
    // localDebug(
    //     `Redirect from ${getFullUrl()} to home page because the route doesn't exist`,
    //     "app/not-found.tsx",
    // );
    redirect("/");
}
