# **`ExtractObjectEntries<T>` Type**

Extracts the object entries from the specified object and returns them in an array of keys-values pairs.

# References in this doc
- Types:
  - [`ExtractObjectKeys<T>`](./ExtractObjectKeys.md)
  - [`ExtractObjectValues<T>`](./ExtractObjectValues.md)

## Implementation
```ts
export type ExtractObjectEntries<T extends Record<string, any>> = [ExtractObjectKeys<T>, ExtractObjectValues<T>]
```

- **Type Parameters:**
  - `T` (`Record<string, any>`): The object to get the object entries from.
