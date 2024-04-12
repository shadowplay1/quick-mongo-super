# **`Maybe<T>` Type**

Represents the nullish type (`T` or `null`) and excludes `undefined` from it.


# References in this doc
- Built-ins:
  - [`Exclude<T, U>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#excludeuniontype-excludedmembers)


## Implementation
```ts
export type Maybe<T> = Exclude<T | null, undefined>
```

- **Type Parameters:**
  - `T` (`any`): The type to make nullish.
