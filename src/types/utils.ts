export type Maybe<T> = T | null

export type If<T extends boolean,
    IfTrue,
    IfFalse = null
> = T extends true ? IfTrue : IfFalse

export type IsObject<T> = T extends null
    ? false
    : T extends undefined
    ? false
    : T extends Record<any, any> ? true : false
