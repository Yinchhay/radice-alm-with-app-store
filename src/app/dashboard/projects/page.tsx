import { Suspense } from "react";
import { CreateProjectOverlay } from "./create_project";
import Pagination from "@/components/Pagination";

export default function ManageAssociatedProject() {
    return (
        <Suspense fallback={"loading..."}>
            <div className="flex flex-row justify-between">
                <h1 className="text-2xl">Projects</h1>
                <CreateProjectOverlay />
            </div>
            {/* {result.data.maxPage > 1 && (
                <div className="float-right">
                    <Pagination page={page} maxPage={result.data.maxPage} />
                </div>
            )} */}
        </Suspense>
    );
}
