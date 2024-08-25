/**
 * Represents the nullish type (`T` or `null`) and excludes `undefined` from it.
 *
 * Type parameters:
 *
 * - `T` (`any`) - The type to make nullish.
 *
 * @template T - The type to make nullish.
 */
export type Maybe<T> = Exclude<T | null, undefined>

/**
 * Conditional type that returns the type based on the condition type result.
 *
 * Type parameters:
 *
 * - `T` (`boolean`) - The condition to return a boolean value.
 * - `IfTrue` (`any`) - The type to be returned if the condition type `T` is `true`.
 * - `IfFalse` (`null`, optional) - The type to be returned if the condition type `T` is `false`.
 *
 * @template T - The condition to return a boolean value.
 * @template IfTrue - The type to be returned if the condition type `T` is `true`.
 * @template IfFalse - The type to be returned if the condition type `T` is `false`.
 */
export type If<
    T extends boolean,
    IfTrue,
    IfFalse = null
> = T extends true ? IfTrue : IfFalse

/**
 * Determines if the specified type is object and returns the checking result as boolean.
 *
 * Type parameters:
 *
 * - `T` (`any`) - The type to check.
 *
 * @template T - The type to check.
 */
export type IsObject<T> = T extends null
    ? false
    : T extends undefined
    ? false
    : T extends any[]
    ? false
    : T extends Record<any, any> ? true : false

/**
 * Represents a type that works as an array of specified type or `...spread` of specified type.
 *
 * Type parameters:
 *
 * - `T` (`any`) - The type to convert into rest-or-array type.
 *
 * @template T - The type to convert into rest-or-array type.
 */
export type RestOrArray<T> = T[] | [T[]]

/**
 * Extracts the type from the `RestOrArray<T>` type and passes it into that type.
 *
 * Useful to prevent accidentally creating the `RestOrArray<RestOrArray<T>>` instances.
 *
 * `T` is being extracted from `RestOrArray<RestOrArray<T>>` type and being passed into `RestOrArray<T>` type.
 *
 * Type parameters:
 *
 * - `T` (`RestOrArray<any>`) - The `RestOrArray<T>` type to extract the type from.
 *
 * @template T - The `RestOrArray<T>` type to extract the type from.
 */
export type ExtractFromRestOrArray<T> = T extends RestOrArray<infer R>
    ? RestOrArray<R>
    : RestOrArray<T>

/**
 * From the type `A`, extracts the type `T` from the `Array<T>` type, or returns `A` if not array type was specified.
 *
 * Type parameters:
 *
 * - `A` (`any`) - The array type to extract the type from.
 *
 * @template A - The array type to extract the type from.
 */
export type ExtractFromArray<A> = A extends Array<infer T> ? T : A

/**
 * Converts the specified type `T` into the array of `T` or just `T` if it's a valid tuple.
 *
 * Type parameters:
 *
 * - `T` (`any`) - The type to convert.
 *
 * @template T - The type to convert.
 */
export type TupleOrArray<T> = T extends [...infer _Rest] ? T : T[]

/**
 * Represents a `predicate` callback function from array methods such as `Array.map()`, `Array.find()`, etc.
 *
 * Type parameters:
 *
 * - `T` (`any`) - The type of the item in the array.
 * - `R` (`any`, optional) - The return type of the function.
 *
 * @template T - The type of the item in the array.
 * @template R - The return type of the function.
 */
export type QueryFunction<T, R = any> = (item: T, index: number, values: T[]) => R

/**
 * Extracts the object keys from the specified object and returns them in a union.
 *
 * Type parameters:
 *
 * - `T` (`Record<string, any>`) - The object to get the object keys types from.
 *
 * @template T - The object to get the object keys types from.
 */
export type ExtractObjectKeys<T extends Record<string, any>> = keyof T

/**
 * Extracts the object values from the specified object and returns them in a union.
 *
 * Type parameters:
 *
 * - `T` (`Record<string, any>`) - The object to get the object values types from.
 *
 * @template T - The object to get the object values types from.
 */
export type ExtractObjectValues<T extends Record<string, any>> = NonNullable<T[ExtractObjectKeys<T>]>

/**
 * Extracts the object entries from the specified object and returns them in an array of keys-values pairs.
 *
 * Type parameters:
 *
 * - `T` (`Record<string, any>`) - The object to get the object entries from.
 *
 * @template T - The object to get the object entries from.
 */
export type ExtractObjectEntries<T extends Record<string, any>> = [ExtractObjectKeys<T>, ExtractObjectValues<T>]

/**
 * Determines if the specified type is `any` and returns the checking result as boolean.
 *
 * Type parameters:
 *
 * - `T` (`any`) - The type to check.
 *
 * @template T - The type to check.
 */
export type IsAny<T> = 0 extends (1 & T) ? true : false

/**
 * Makes the string union type autocompletable with a `string` type.
 *
 * Type parameters:
 *
 * - `S` (`string`) - The autocompletable union string type to make compatible with a `string` type.
 *
 * @template S - The autocompletable union string type to make compatible with a `string` type.
 */
export type AutocompletableString<S extends string> = S | (string & {})

/**
 * Extracts the first key from the specified object path.
 * (for example, in key `member.user.id`, the first key will be `member`)
 *
 * Type parameters:
 *
 * - `TKey` (`ObjectPath<string, any>`) - The object path to extract the key from.
 *
 * @template TKey - The object path to extract the key from.
 */
export type FirstObjectKey<TKey extends ObjectPath<string, any>> =
    TKey extends `${infer Key}.${infer _Rest}`
        ? Key
        : TKey extends string
            ? TKey
        : never

/**
 * Represents a path to a nested property in an object.
 *
 * Type parameters:
 *
 * - `T` (`any`) - The object to get the path from.
 * - `TKey` (`keyof T`, defaults to `keyof T`) - The key of the object to get the path from.
 *
 * @template T - The object to get the path from.
 * @template TKey - The key of the object to get the path from.
 */
export type ObjectPath<T, TKey extends keyof T = keyof T> = IsAny<T> extends true
    ? string
    : T extends string | number | boolean | symbol
        ? string
            : TKey extends string
                ? T[TKey] extends Record<string, any>
                    ? `${TKey}` | `${TKey}.${ObjectPath<T[TKey]>}`
                    : TKey
                : never

/**
 * Extracts the value from the specified object path.
 *
 * Type parameters:
 *
 * - `T` (`any`) - The object to extract the value from.
 * - `P` (`ObjectPath<T>` or `AutocompletableString<ObjectPath<T>>`) - The object path to extract the value from.
 *
 * @template T - The object to extract the value from.
 * @template P - The object path to extract the value from.
 */
export type ObjectValue<T, P extends ObjectPath<T> | AutocompletableString<ObjectPath<T>>> =
    T extends AutocompletableString<P> | string | number | boolean | symbol
        ? T
        : P extends `${infer Key}.${infer Rest}`
            ? Key extends keyof T
                ? Rest extends ObjectPath<T[Key]>
                    ? ObjectValue<T[Key], Rest>
                        : null
                : never
            : P extends keyof T
                ? T[P]
                : T
