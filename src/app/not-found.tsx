import { localDebug } from "@/lib/utils";
import { redirect } from "next/navigation";

export default function NotFound() {
    localDebug("Redirect to home page because the route doesn't exist", "app/not-found.tsx");
    redirect("/");
}
