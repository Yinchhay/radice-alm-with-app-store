"use client"
import Cell from "@/components/table/Cell";
import TableRow from "@/components/table/TableRow";
import { useRouter, useSearchParams } from "next/navigation";

export default function NoCategory({ page }: { page: number }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    if (page !== 1) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("page", "1");
        router.push(`?${newSearchParams.toString()}`);
    }

    return (
        <>
            <TableRow>
                <Cell>No category found!</Cell>
                <Cell>{""}</Cell>
                <Cell>{""}</Cell>
                <Cell>{""}</Cell>
            </TableRow>
        </>
    );
}
