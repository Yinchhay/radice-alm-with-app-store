"use client";
import {
    IconChevronLeft,
    IconChevronRight,
    IconDots,
} from "@tabler/icons-react";
import Button from "./Button";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export type PaginationProps = {
    page: number;
    maxPage: number;
};

export default function Pagination({ page, maxPage }: PaginationProps) {
    const [currentPage, setCurrentPage] = useState<number>(page || 1);

    if (currentPage < 1) {
        setCurrentPage(1);
    }

    const searchParams = useSearchParams();
    const pathname = usePathname();

    useEffect(() => {
        if (searchParams.get("page") == currentPage.toString()) {
            return;
        }

        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("page", currentPage.toString());
        window.location.href = `${pathname}?${newSearchParams.toString()}`;
    }, [currentPage]);

    return (
        <div className="flex gap-2 items-end">
            {currentPage - 1 > 0 && (
                <Button
                    square={true}
                    onClick={() => {
                        setCurrentPage(currentPage - 1);
                    }}
                >
                    <IconChevronLeft />
                </Button>
            )}
            {currentPage - 1 > 0 && (
                <Button
                    square={true}
                    className="min-w-8 "
                    onClick={() => {
                        setCurrentPage(currentPage - 1);
                    }}
                >
                    <div>{currentPage - 1}</div>
                </Button>
            )}
            <Button square={true} className="min-w-8" variant="primary">
                <div>{currentPage}</div>
            </Button>
            {currentPage + 1 < maxPage && (
                <Button
                    square={true}
                    className="min-w-8"
                    onClick={() => {
                        setCurrentPage(currentPage + 1);
                    }}
                >
                    <div>{currentPage + 1}</div>
                </Button>
            )}
            {currentPage + 2 < maxPage && <IconDots />}
            {currentPage != maxPage && (
                <Button
                    square={true}
                    className="min-w-8"
                    onClick={() => {
                        setCurrentPage(maxPage);
                    }}
                >
                    <div>{maxPage}</div>
                </Button>
            )}
            {currentPage != maxPage && (
                <Button square={true} data-test="paginationNextBtn">
                    <IconChevronRight
                        onClick={() => {
                            setCurrentPage(currentPage + 1);
                        }}
                    />
                </Button>
            )}
        </div>
    );
}
