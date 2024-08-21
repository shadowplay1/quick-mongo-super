# **`ObjectPath<T, TKey>` Type**

Represents a path to a nested property in an object.


# References in this doc
- Types:
  - [`IsAny<T>`](./IsAny.md)
- Built-ins:
  - [`Record<K, T>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)


## Implementation
```ts
export type ObjectPath<T, TKey extends keyof T = keyof T> = IsAny<T> extends true
    ? string
    : T extends string | number | boolean | symbol
        ? string
            : TKey extends string
                ? T[TKey] extends Record<string, any>
                    ? `${TKey}` | `${TKey}.${ObjectPath<T[TKey]>}`
                    : TKey
                : never
```

- **Type Parameters:**
  - `T` (`any`): The object to get the path from.
  - `TKey` (`keyof T`, defaults to `keyof T`): The key of the object to get the path from.
