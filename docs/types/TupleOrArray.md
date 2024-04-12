# **`TupleOrArray<T>` Type**

Converts the specified type `T` into the array of `T` or just `T` if it's a valid tuple.

## Implementation
```ts
export type TupleOrArray<T> = T extends [...infer _Rest] ? T : T[]
```

- **Type Parameters:**
  - `T` (`any`): The type to convert.
