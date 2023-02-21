/**
 * DatabaseError class.
 */
class DatabaseError extends Error {

    /**
     * Creates a 'DatabaseError' instance.
     * @param {string} msg Error message.
     */
    constructor(msg?: string) {
        super(msg)
        Error.captureStackTrace(this, this.constructor)

        /**
         * Error name.
         * @type {string}
         */
        this.name = 'DatabaseError'
    }
}

export = DatabaseError
