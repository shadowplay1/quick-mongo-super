/**
 * Represents the nullish type.
 * @template T The type to make nullish.
 */
export type Maybe<T> = T | null

/**
 * Conditional type that returns the type based on the condition type result.
 * @template T The condition to return a boolean value.
 * @template IfTrue The type to be returned if the condition type `T` is `true`.
 * @template IfFalse The type to be returned if the condition type `T` is `false`.
 */
export type If<T extends boolean,
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
 * Represents a type that works as an array of specified type or ...spread of specified type.
 * @template T The type to convert into rest-or-array type.
 */
export type RestOrArray<T> = T[] | [T[]]
