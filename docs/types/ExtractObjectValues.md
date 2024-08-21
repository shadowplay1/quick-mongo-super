# **`ExtractObjectValues<T>` Type**

Extracts the object values from the specified object and returns them in a union.

# Related types:
- [`ExtractObjectKeys<T>`](./ExtractObjectKeys.md)
- [`ExtractObjectEntries<T>`](./ExtractObjectEntries.md)

## Implementation
```ts
export type ExtractObjectValues<T extends Record<string, any>> = NonNullable<T[ExtractObjectKeys<T>]>
```

- **Type Parameters:**
  - `T` (`Record<string, any>`): The object to get the object values types from.
