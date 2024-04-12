import { TupleOrArray } from '../../types/utils'

/**
 * Utility class for working with objects.
 *
 * Provides **static** methods for retrieving keys and values of an object.
 *
 * This class enhances type safety by providing better typings for object keys and values.
 */
export class TypedObject {

    /**
     * Returns the names of the enumerable string properties and methods of an object.
     *
     * Type parameters:
     * - `K` (`TupleOrArray<string>`, defaults to `string[]`) -
     * The type of the array containing the names of the enumerable string properties and methods.
     *
     * @param {any} obj Object that contains the properties and methods.
     * @returns {K} Array of names of the enumerable string properties and methods of the specified object.
     */
    public static keys<K extends TupleOrArray<string> = string[]>(obj: any): K {
        return Object.keys(obj || {}) as K
    }

    /**
     * Returns an array of values of the enumerable properties of an object.
     *
     * Type parameters:
     * - `V` (`TupleOrArray<any>`, defaults to `any[]`) -
     * The type of the array containing the values of the enumerable properties.
     *
     * @param {any} obj Object that contains the properties and methods.
     * @returns {V} Array of values of the enumerable properties of the specified object.
     */
    public static values<V extends TupleOrArray<any> = any[]>(obj: any): V {
        return Object.values(obj || {}) as V
    }
}
