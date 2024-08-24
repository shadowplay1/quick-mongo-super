# **`AutocompletableString<S>` Type**

Makes an autocompletable union string type compatible with a `string` type.

## Implementation
```ts
export type AutocompletableString<S extends string> = S | (string & {})
```

- **Type Parameters:**
  - `S` (`string`): The autocompletable union string type to make compatible with a `string` type.
