import { IErrorParams, errors } from '../../structures/errors'

/**
 * QuickMongoError class.
 */
export class QuickMongoError<TErrorCode extends keyof typeof errors> extends Error {

    /**
     * Creates a QuickMongoError instance.
     * @param {string} errorCode Quick Mongo error code.
     * @param {any[]} params Additional parameters to replace the placeholders in the error message.
     */
    public constructor(errorCode: TErrorCode, ...params: IErrorParams[TErrorCode]) {
        if (!errors[errorCode]) {
            errorCode = 'UNKNOWN_ERROR' as TErrorCode
        }

        let errorMessage = errors[errorCode]

        for (let i = 0; i < params.length; i++) {
            errorMessage = errorMessage.replaceAll(`{${i + 1}}`, params[i])
        }

        super(errorMessage)

        /**
         * Error name.
         * @type {string}
         */
        this.name = `QuickMongoError [${errorCode}]`
    }
}
