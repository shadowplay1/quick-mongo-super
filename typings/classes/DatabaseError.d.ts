/**
 * DatabaseError class.
 */
declare class DatabaseError extends Error {
    /**
     * Creates a 'DatabaseError' instance.
     * @param {String | Error} message Error message.
     */
    constructor(msg?: any);
}
export = DatabaseError;
