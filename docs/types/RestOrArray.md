# **`RestOrArray<T>` Type**

Represents a type that works as an array of specified type or ...spread of specified type.

## Implemenatation
```ts
export type RestOrArray<T> = T[] | [T[]]
```

- **Type Parameters:**
  - `T` (`any`): The type to convert into rest-or-array type.
