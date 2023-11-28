# **`IDatabaseRequestsLatencyData` Interface**

Represents the database operations latency object.

## Implemenatation
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
