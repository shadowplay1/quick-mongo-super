# **`ExtractFromArray<T>` Type**

Extracts the type from the `Array<T>` type.

## Implemenatation
```ts
export type ExtractFromArray<A> = A extends Array<infer T> ? T : A
```

- **Type Parameters:**
  - `A` (`any[]`): The array type to extract the type from.
