import { ExtractObjectKeys, ExtractObjectValues, ExtractObjectEntries } from '../../types/utils'

/**
 * Utility class for working with objects.
 *
 * Provides **static** methods for retrieving keys and values of an object with addition of types.
 *
 * This class enhances type safety by providing better typings for object keys and values.
 */
export class TypedObject {

    /**
     * Returns the names of the enumerable string properties and methods of an object.
     *
     * Type parameters:
     *
     * - `TObject` (`Record<string, any>`) - The object to get the object keys types from.
     *
     * @param {TObject} obj Object to get the keys from.
     *
     * @returns {Array<ExtractObjectKeys<TObject>>}
     * Array of names of the enumerable string properties and methods of the specified object.
     */
    public static keys<TObject extends Record<string, any>>(obj: TObject): ExtractObjectKeys<TObject>[] {
        return Object.keys(obj || {})
    }

    /**
     * Returns an array of values of the enumerable properties of an object.
     *
     * Type parameters:
     *
     * - `TObject` (`Record<string, any>`) - The object to get the object values types from.
     *
     * @param {TObject} obj Object to get the values from.
     *
     * @returns {Array<ExtractObjectValues<TObject>>}
     * Array of values of the enumerable properties of the specified object.
     */
    public static values<TObject extends Record<string, any>>(obj: TObject): ExtractObjectValues<TObject>[] {
        return Object.values(obj || {})
    }

    /**
     * Returns an array of entries (key-value pairs) of the enumerable properties of an object.
     *
     * Type parameters:
     *
     * - `TObject` (`Record<string, any>`) - The object to get the object entries types (key-value pairs types) from.
     *
     * @param {TObject} obj Object to get the entries from.
     *
     * @returns {ExtractObjectEntries<TObject>[]}
     * Array of entries (key-value pairs) of the enumerable properties of the specified object.
     */
    public static entries<
        TObject extends Record<string, any>
    >(obj: TObject): ExtractObjectEntries<TObject>[] {
        return Object.entries(obj || {})
    }
}
