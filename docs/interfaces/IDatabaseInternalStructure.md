# **`IDatabaseInternalStructure<T>` Interface**

Represents the object of the way data stored in the internal `[__KEY]-[__VALUE]` storage format that was made to achieve better data accessibility across the module.

## Implementation
```ts
export interface IDatabaseInternalStructure<T = any> {
    __KEY: string
    __VALUE: T
}
```

- **Type Parameters:**
  - `T` (`any`, defaults to `any`) - The type of `__VALUE` property in each raw data object.

- **Properties:**
  - `__KEY` (`string`): The key to store the data under.
  - `__VALUE` (`T`): The value to store under the specified key.
