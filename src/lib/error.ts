import { MysqlErrorCodes } from "@/types/db";

export function mysqlErDupEntryExtractValue(error: any): string {
    // Example error message:
    // 'Duplicate entry \'New category\' for key \'categories.categories_name_unique\'',
    if (error.code === MysqlErrorCodes.ER_DUP_ENTRY) {
        const matches = error.message.match(/Duplicate entry '(.+)' for key/);
        if (matches) {
            return matches[1];
        }
    }
    return 'unknown';
}
