# **`IsAny<T>` Type**

Determines if the specified type is `any` and returns the checking result as boolean.


## Implementation
```ts
export type IsAny<T> = 0 extends (1 & T) ? true : false
```

- **Type Parameters:**
  - `T` (`any`): The type to check.
