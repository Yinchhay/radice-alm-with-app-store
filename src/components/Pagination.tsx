import {
    IconChevronLeft,
    IconChevronRight,
    IconDots,
} from "@tabler/icons-react";
import Button from "./Button";

export default function Pagination({
    currentPage,
    maxPage,
    onSetPage,
}: {
    currentPage: number;
    maxPage: number;
    onSetPage: (pageNumber: number) => void;
}) {
    return (
        <div className="flex gap-2 items-end">
            {currentPage - 1 > 0 && (
                <Button
                    square={true}
                    onClick={() => {
                        onSetPage(currentPage - 1);
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
                        onSetPage(currentPage - 1);
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
                        onSetPage(currentPage + 1);
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
                        onSetPage(maxPage);
                    }}
                >
                    <div>{maxPage}</div>
                </Button>
            )}
            {currentPage != maxPage && (
                <Button square={true}>
                    <IconChevronRight
                        onClick={() => {
                            onSetPage(currentPage + 1);
                        }}
                    />
                </Button>
            )}
        </div>
    );
}
