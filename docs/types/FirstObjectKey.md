# **`FirstObjectKey<TKey>` Type**

Extracts the first key from the specified object path. (for example, in key `member.user.id`, the first key will be `member`)


# References in this doc
- Types:
  - [`ObjectPath<T, TKey>`](./ObjectPath.md)


## Implementation
```ts
export type FirstObjectKey<TKey extends ObjectPath<string, any>> =
    TKey extends `${infer Key}.${infer _Rest}`
        ? Key
        : never
```

- **Type Parameters:**
  - `TKey` (`ObjectPath<string, any>`): The object path to extract the key from.
