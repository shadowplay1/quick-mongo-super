# **`ExtractObjectKeys<T>` Type**

Extracts the object keys from the specified object and returns them in a union.

# Related types:
- [`ExtractObjectValues<T>`](./ExtractObjectValues.md)
- [`ExtractObjectEntries<T>`](./ExtractObjectEntries.md)

## Implementation
```ts
export type ExtractObjectKeys<T extends Record<string, any>> = keyof T
```

- **Type Parameters:**
  - `T` (`Record<string, any>`): The object to get the object keys types from.
