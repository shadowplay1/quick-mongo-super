/**
 * DatabaseError class.
 */
declare class DatabaseError extends Error {
    /**
     * Creates a 'DatabaseError' instance.
     * @param {string} msg Error message.
     */
    constructor(msg?: string);
}
export = DatabaseError;
