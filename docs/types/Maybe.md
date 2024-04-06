# **`Maybe<T>` Type**

Represents the nullish type (`T` or `null`) and excludes `undefined` from it.

## Implemenatation
```ts
export type Maybe<T> = Exclude<T | null, undefined>
```

- **Type Parameters:**
  - `T` (`any`): The type to make nullish.
