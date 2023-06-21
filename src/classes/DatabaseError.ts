/**
 * DatabaseError class.
 */
export class DatabaseError extends Error {

    /**
     * Creates a 'DatabaseError' instance.
     * @param {string} msg Error message.
     */
    constructor(msg?: string) {
        super(msg)

        /**
         * Error name.
         * @type {string}
         */
        this.name = 'DatabaseError'
    }
}
