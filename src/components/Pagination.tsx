"use client";
import {
    IconChevronLeft,
    IconChevronRight,
    IconDots,
} from "@tabler/icons-react";
import Button from "./Button";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export type PaginationProps = {
    page: number;
    maxPage: number;
};

export default function Pagination({ page, maxPage }: PaginationProps) {
    const [currentPage, setCurrentPage] = useState<number>(Math.max(1, page));
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("page", currentPage.toString());
        router.push(`?${newSearchParams.toString()}`);
    }, [currentPage]);

    const buttonClasses = "w-[36px] h-[36px] p-0";
    const iconSize = "w-5 h-5";

    const goToPage = (pageNum: number) => {
        if (pageNum < 1 || pageNum > maxPage || pageNum === currentPage) return;
        setCurrentPage(pageNum);
    };

    const getDisplayedPages = (): (number | "...")[] => {
        const pages: (number | "...")[] = [];

        if (maxPage <= 5) {
            for (let i = 1; i <= maxPage; i++) pages.push(i);
        } else {
            const left = currentPage - 1;
            const right = currentPage + 1;

            pages.push(1);

            if (left > 2) {
                pages.push("...");
            } else {
                for (let i = 2; i < left; i++) {
                    pages.push(i);
                }
            }

            for (let i = Math.max(left, 2); i <= Math.min(right, maxPage - 1); i++) {
                pages.push(i);
            }

            if (right < maxPage - 1) {
                pages.push("...");
            } else {
                for (let i = right + 1; i < maxPage; i++) {
                    pages.push(i);
                }
            }

            if (maxPage > 1) pages.push(maxPage);
        }

        return pages;
    };

    return (
        <div className="flex gap-2 items-end">
            {/* Left chevron */}
            <Button
                square
                className={buttonClasses}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <IconChevronLeft className={iconSize} />
            </Button>

            {/* Page numbers */}
            {getDisplayedPages().map((item, index) => {
                if (item === "...") {
                    return <IconDots key={index} className="dark:text-white w-4 h-4" />;
                }

                const isActive = item === currentPage;

                return (
                    <Button
                        key={index}
                        square
                        className={`${buttonClasses} ${isActive
                                ? "!bg-[#7F56D9] !text-white"
                                : "bg-gray-100 text-black hover:bg-gray-200"
                            }`}
                        onClick={() => goToPage(item)}
                    >
                        <div className="flex items-center justify-center w-full h-full">
                            {item}
                        </div>
                    </Button>
                );
            })}

            {/* Right chevron */}
            <Button
                square
                className={buttonClasses}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === maxPage}
            >
                <IconChevronRight className={iconSize} />
            </Button>
        </div>
    );
}
