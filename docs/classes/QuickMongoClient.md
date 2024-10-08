# **`QuickMongoClient<TInitialDatabaseData>` Class**

## References in this doc
- Classes:
  - [`QuickMongo<K, V>`](./QuickMongo.md)


## Constructor
```ts
new QuickMongoClient<TInitialDatabaseData>(connectionURI: string, initialDatabaseData?: TInitialDatabaseData)
```

- **Type Parameters:**
  - `TInitialDatabaseData` (`object`) - The type of the object to be set in new empty databases.

- **Parameters:**
  - `connectionURI` (`string`): The MongoDB cluster connection URI to connect to.
  - `initialDatabaseData` (`TInitialDatabaseData`): The database object to set in database if the database is empty on initialation.

- **Example:**
```ts
  const { QuickMongoClient, QuickMongo } = require('quick-mongo-super')

  // Create a normal Quick Mongo client.
  const quickMongoClient = new QuickMongoClient(connectionURI)

  // You can also specify the initial data that will be put
  // on successful connection in every database if it's empty.
  const quickMongoClient = new QuickMongoClient(connectionURI, {
      somethingToSetInDatabase: 'something'
  })

  // Initialize the database.
  const mongo = new QuickMongo(quickMongoClient, {
      name: 'databaseName',
      collectionName: 'collectionName' // optional
  })
```

## Properties
- **Public:**
  - `connected` (`boolean`): Determines if the MongoDB cluster connection is established.
  - `databases` (`QuickMongo<any, any>[]`): Array of initialized `QuickMongo` database instances.
  - `initialDatabaseData` (`TInitialDatabaseData`): An object to put in database on successful connection if the database is empty.

- **Private:**
  - `_connectionURI` (`string`): The MongoDB cluster connection URI to connect to.


## Events
- [`QuickMongoClient#connect`](../events/QuickMongoClient/connect.md)
- [`QuickMongoClient#disconnect`](../events/QuickMongoClient/disconnect.md)


## Methods

## `connect(): Promise<QuickMongoClient<TInitialDatabaseData>>`
Opens a connection to a MongoDB cluster.

- **Returns:** `Promise<QuickMongoClient<TInitialDatabaseData>>` - Connected `QuickMongoClient` instance.
- **Example:**
```ts
  await quickMongo.connect()
```

## `disconnect(): Promise<void>`
Closes the connection to a MongoDB cluster.

This will also disconnect all the instances of `QuickMongo` database class from the MongoDB cluster.

- **Returns:** `Promise<void>`.
- **Example:**
```ts
  await quickMongo.disconnect()
```
