/**
 * DatabaseError class.
 */
class DatabaseError extends Error {

    /**
     * Creates a 'DatabaseError' instance.
     * @param {String | Error} msg Error message.
     */
    constructor(msg?: any) {
        if (msg instanceof Error) {
            super(msg.message)
            Error.captureStackTrace(this, this.constructor)
        }

        else super(msg)


        /**
         * Error name.
         * @type {String}
         */
        this.name = 'DatabaseError'
    }
}

export = DatabaseError