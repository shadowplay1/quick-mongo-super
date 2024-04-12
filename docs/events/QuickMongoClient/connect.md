# **`QuickMongoClient#connect` Event**

Emits when the MongoDB connection is established successfully.

- **Parameters:**
  - `connectedQuickMongoClient` (`QuickMongoClient<TInitialDatabaseData>`) - Connected `QuickMongoClient` instance.

- **Example:**
```ts
quickMongo.on('connect', connectedClient => {
    console.log(`Connected ${connectedClient.databases.length} databases to MongoDB.`)
})
```
