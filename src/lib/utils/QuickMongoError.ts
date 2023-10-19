/**
 * QuickMongoError class.
 */
export class QuickMongoError extends Error {

    /**
     * Creates a 'QuickMongoError' instance.
     * @param {string} msg Error message.
     */
    constructor(msg?: string) {
        super(msg)

        /**
         * Error name.
         * @type {string}
         */
        this.name = 'QuickMongoError'
    }
}
