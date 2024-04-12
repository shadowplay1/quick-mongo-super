# **`ExtractFromRestOrArray<T>` Type**

Extracts the type from the `RestOrArray<T>` type and passes it into that type.

Useful to prevent accidentally creating the `RestOrArray<RestOrArray<T>>` instances.

`T` is being extracted from `RestOrArray<RestOrArray<T>>` type and being passed into `RestOrArray<T>` type.


## References in this doc
- Types:
  - [`RestOrArray<T>`](./RestOrArray.md)


## Implementation
```ts
export type ExtractFromRestOrArray<T> = T extends RestOrArray<infer R>
    ? RestOrArray<R>
    : RestOrArray<T>
```

- **Type Parameters:**
  - `T` (`any`): The `RestOrArray<T>` type to extract the type from.
