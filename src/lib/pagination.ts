export const ROWS_PER_PAGE = 5;

export function getPaginationMaxPage(
    totalItemCount: number,
    rowsPerPage: number = ROWS_PER_PAGE,
): number {
    return Math.ceil(totalItemCount / rowsPerPage);
}