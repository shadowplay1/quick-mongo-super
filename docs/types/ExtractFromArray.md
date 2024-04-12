# **`ExtractFromArray<T>` Type**

From the type `A`, extracts the type `T` from the `Array<T>` type, or returns `A` if not array type was specified.

## Implementation
```ts
export type ExtractFromArray<A> = A extends Array<infer T> ? T : A
```

- **Type Parameters:**
  - `A` (`any[]`): The array type to extract the type from.
