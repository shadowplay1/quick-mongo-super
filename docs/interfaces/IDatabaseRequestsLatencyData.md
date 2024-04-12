# **`IDatabaseRequestsLatencyData` Interface**

Represents the database operations latency object.


# References in this doc
- Built-ins:
  - [`Record<K, T>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)


## Implementation
```ts
export type IDatabaseRequestsLatencyData = Record<
    'readLatency' | 'writeLatency' | 'deleteLatency',
    number
>
```

- **Properties:**
  - `readLatency` (`number`): Read operation latency in milliseconds.
  - `writeLatency` (`number`): Write operation latency in milliseconds.
  - `deleteLatency` (`number`): Delete operation latency in milliseconds.
