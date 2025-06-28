"use client";
import {
    IconChevronLeft,
    IconChevronRight,
    IconDots,
} from "@tabler/icons-react";
import Button from "./Button";
import { useEffect, useState } from "react";

export type PaginationProps = {
    page: number;
    maxPage: number;
    onPageChange?: (page: number) => void;
};

export default function Pagination({ page, maxPage, onPageChange }: PaginationProps) {
    const [currentPage, setCurrentPage] = useState<number>(page || 1);

    useEffect(() => {
        if (currentPage < 1) {
            setCurrentPage(1);
        }
    }, [currentPage]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        if (onPageChange) {
            onPageChange(newPage);
        }
    };

    // Update currentPage when page prop changes
    useEffect(() => {
        setCurrentPage(page);
    }, [page]);

    return (
        <div className="flex gap-2 items-end">
            {currentPage - 1 > 0 && (
                <Button
                    square={true}
                    onClick={() => {
                        handlePageChange(currentPage - 1);
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
                        handlePageChange(currentPage - 1);
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
                        handlePageChange(currentPage + 1);
                    }}
                >
                    <div>{currentPage + 1}</div>
                </Button>
            )}
            {currentPage + 2 < maxPage && (
                <IconDots className="dark:text-white" />
            )}
            {currentPage != maxPage && (
                <Button
                    square={true}
                    className="min-w-8"
                    onClick={() => {
                        handlePageChange(maxPage);
                    }}
                >
                    <div>{maxPage}</div>
                </Button>
            )}
            {currentPage != maxPage && (
                <Button 
                    square={true} 
                    data-test="paginationNextBtn"
                    onClick={() => {
                        handlePageChange(currentPage + 1);
                    }}
                >
                    <IconChevronRight />
                </Button>
            )}
        </div>
    );
}
