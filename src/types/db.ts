export enum MysqlErrorCodes {
    /**
     * When there is a duplicate column in the table because of the unique constraint.
     * Check when "Insert" "Update"
     */
    ER_DUP_ENTRY = "ER_DUP_ENTRY",
    /**
     * When the data has reference to another table and we delete it, it will cause this error.
     * Check when "Delete"
     */
    ER_ROW_IS_REFERENCED_2 = "ER_ROW_IS_REFERENCED_2",
}