import { typeOf } from './typeOf.function'

/**
 * Determines if the specified value is a number.
 *
 * A small hack to actually determine if the input is a number since
 * empty strings and arrays are considered as numbers too.
 * @param {any} input The input to check.
 * @returns {boolean} Whether the specified input is a number.
 */
export const isNumber = (input: any): boolean => {
    return !isNaN(input as number) && input !== '' && input !== null && typeOf(input) !== 'Array'
}
