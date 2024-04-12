# **`QueryFunction<T, R = any>` Type**

Represents a `predicate` callback function from array methods such as `Array.map()`, `Array.find()`, etc.

## Implementation
```ts
export type QueryFunction<T, R = any> = (item: T, index: number, values: T[]) => R
```

- **Type Parameters:**
  - `T` (`any`): The type of the item in the array.
  - `R` (`any`, defaults to `any`): The return type of the function.
