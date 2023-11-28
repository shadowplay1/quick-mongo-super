# `IsObject<T>` type

Determines if the specified type is object and returns the checking result as boolean.

## Implementation
```ts
export type IsObject<T> = T extends null
    ? false
    : T extends undefined
    ? false
    : T extends any[]
    ? false
    : T extends Record<any, any> ? true : false
```

- **Type Parameters:**
  - `T` (`any`): The type to check.
