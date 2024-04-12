# **`If<T, IfTrue, IfFalse>` Type**

Conditional type that returns the type based on the condition type result.

## Implementation
```ts
export type If<
    T extends boolean,
    IfTrue,
    IfFalse = null
> = T extends true ? IfTrue : IfFalse
```

- **Type Parameters:**
  - `T` (`boolean`): The condition to return a boolean value.
  - `IfTrue` (`any`): The type to be returned if the condition type `T` is `true`
  - `IfFalse` (`any`, defaults to `null`): The type to be returned if the condition type `T` is `false`

