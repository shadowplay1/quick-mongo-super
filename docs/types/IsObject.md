# **`IsObject<T>` Type**

Determines if the specified type is object and returns the checking result as boolean.


# References in this doc
- Built-ins:
  - [`Record<K, T>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)


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
