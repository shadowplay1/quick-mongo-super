# **`IDatabaseConfiguration` Interface**

Represents the configuration object of the `QuickMongo` database instance.

## Implementation
```ts
export interface IDatabaseConfiguration {
    name: string
    collectionName?: string
}
```

- **Properties:**
  - `name` (`string`): MongoDB database name.
  - `collectionName` (`string`): MongoDB collection name.
