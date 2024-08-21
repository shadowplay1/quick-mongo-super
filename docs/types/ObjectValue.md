# **`ObjectValue<T, P>` Type**

Extracts the value from the specified object path.


# References in this doc
- Types:
  - [`ObjectPath<T, TKey>`](./ObjectPath.md)


## Implementation
```ts
export type ObjectValue<T, P extends ObjectPath<T>> =
    T extends string | number | boolean | symbol
        ? T
        : P extends `${infer Key}.${infer Rest}`
            ? Key extends keyof T
                ? Rest extends ObjectPath<T[Key]>
                    ? ObjectValue<T[Key], Rest>
                        : null
                : never
            : P extends keyof T
                ? T[P]
                : null
```

- **Type Parameters:**
  - `T` (`any`): The object to extract the value from.
  - `P` (`ObjectPath<T>`): The object path to extract the value from.
