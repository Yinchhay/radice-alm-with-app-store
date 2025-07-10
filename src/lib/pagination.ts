export const ROWS_PER_PAGE = 5;

export const ROWS_PER_FEEDBACK_PAGE = 2;

export const ROWS_PER_BUG_REPORT_PAGE = 8;

export function getPaginationMaxPage(
    totalItemCount: number,
    rowsPerPage: number = ROWS_PER_PAGE,
): number {
    return Math.ceil(totalItemCount / rowsPerPage);
}