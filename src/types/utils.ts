/**
 * Represents the nullish type (`T` or `null`) and excludes `undefined` from it.
 * @template T The type to make nullish.
 */
export type Maybe<T> = Exclude<T | null, undefined>

/**
 * Conditional type that returns the type based on the condition type result.
 * @template T The condition to return a boolean value.
 * @template IfTrue The type to be returned if the condition type `T` is `true`.
 * @template IfFalse The type to be returned if the condition type `T` is `false`.
 */
export type If<
    T extends boolean,
    IfTrue,
    IfFalse = null
> = T extends true ? IfTrue : IfFalse

/**
 * Determines if the specified type is object and returns the checking result as boolean.
 * @template T The type to check.
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
 * @template T The type to convert into rest-or-array type.
 */
export type RestOrArray<T> = T[] | [T[]]

/**
 * Extracts the type from the `RestOrArray<T>` type and passes it into that type.
 *
 * Useful to prevent accidentally creating the `RestOrArray<RestOrArray<T>>` instances.
 *
 * `T` is being extracted from `RestOrArray<RestOrArray<T>>` type and being passed into `RestOrArray<T>` type.
 *
 * @template T The `RestOrArray<T>` type to extract the type from.
 */
export type ExtractFromRestOrArray<T> = T extends RestOrArray<infer R>
    ? RestOrArray<R>
    : RestOrArray<T>

/**
 * From the type `A`, extracts the type `T` from the `Array<T>` type, or returns `A` if not array type was specified.
 * @template T The array type to extract the type from.
 */
export type ExtractFromArray<A> = A extends Array<infer T> ? T : A

/**
 * Converts the specified type `T` into the array of `T` or just `T` if it's a valid tuple.
 * @template T The type to convert.
 */
export type TupleOrArray<T> = T extends [...infer _Rest] ? T : T[]

/**
 * Represents a `predicate` callback function from array methods such as `Array.map()`, `Array.find()`, etc.
 * @template T The type of the item in the array.
 * @template R The return type of the function.
 */
export type QueryFunction<T, R = any> = (item: T, index: number, values: T[]) => R
