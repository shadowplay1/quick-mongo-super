# **`QuickMongo<K, V>` Class**

# Intro
This is the **full** documentation of all the database mathods of `QuickMongo` class.

This includes all the methods, types, descriptions and **brief** examples on how each method could be used.

You can see the **detailed** examples on usage of each method in both **JavaScript** and **TypeScript** [here](https://github.com/shadowplay1/quick-mongo-super/tree/main/examples).

## Constructor
```ts
new QuickMongo<K, V>(quickMongoClient: QuickMongoClient, databaseOptions?: IDatabaseConfiguration)
```

- **Parameters:**
  - `quickMongoClient` (`QuickMongoClient<any>`): Quick Mongo client to get attached to.
  - `databaseOptions` (`IDatabaseConfiguration`): Database configuration object.

- **Type Parameters:**
  - `K` (`string`): The type of The key to access the target in database by.
  - `V` (`any`): The type of the values in the database.

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
  - `name` (`string`): Database name.
  - `collectionName` (`string`): Collection name.

- **Private:**
  - `_cache` (`CacheManager<any, IDatabaseInternalStructure<any>>`): Cache Manager.
  - `_client` (`QuickMongoClient<any>`): Quick Mongo client the database instance is attached to.
  - `_model` (`Model<IDatabaseInternalStructure<any>>`): Internal Mongoose model to work with.


# Events
*none*


## Methods

## `get(key: K): Maybe<V>`
Retrieves a value from database by a key.

- **Parameters:**
  - `key` (`K`): The key to access the target in database by.

- **Returns:** `Maybe<V>` - The value of the target in database.
- **Example:**
```ts
  const simpleValue = quickMongo.fetch('simpleValue')
  console.log(simpleValue) // -> 123

  // You can use the dot notation to access the database object properties:
  const objectPropertyAccessed = quickMongo.fetch('player.inventory')
  console.log(objectPropertyAccessed) // -> []
```


## `fetch(key: K): Maybe<V>`
Retrieves a value from database by a key.

This method is an alias for `QuickMongo.get()` method.

- **Parameters:**
  - `key` (`K`): The key to access the target in database by.

- **Returns:** `Maybe<V>` - The value of the target in database.
- **Example:**
```ts
  const simpleValue = quickMongo.fetch('simpleValue')
  console.log(simpleValue) // -> 123

  // You can use the dot notation to access the database object properties:
  const objectPropertyAccessed = quickMongo.fetch('player.inventory')
  console.log(objectPropertyAccessed) // -> []
```


## `has(key: K): boolean`
Determines if the data is stored in database.

- **Parameters:**
  - `key` (`K`): The key to access the target in database by.

- **Returns:** `boolean` - Whether the data is stored in database.
- **Example:**
```ts
  const isSimpleValueInDatabase = quickMongo.has('simpleValue')
  console.log(isSimpleValueInDatabase) // -> true

  const somethingElse = quickMongo.has('somethingElse')
  console.log(somethingElse) // -> false

  // You can use the dot notation to check the database object properties:
  const isObjectInDatabase = quickMongo.has('player.inventory')
  console.log(isObjectInDatabase) // -> true
```


## `set<TObjectReturnValue = any>(key: K, value: V): Promise<If<IsObject<V>, TObjectReturnValue, V>>`
Writes the specified value into database under the specified key.

- **Type Parameters:**
  - `TObjectReturnValue` (`any`, defaults to `any`): Type the return type fallbacks to if `TVa\lue` is an object.

- **Parameters:**
  - `key` (`string`): The key to write in the target.
  - `value` (`V`): The value to write.

- **Returns:** `Promise<If<IsObject<V>, TReturnValue, V>>`:
  - If the `value` parameter's type is not an object (string, number, boolean, etc), then the specified
  `value` parameter (type of `V`) will be returned.

  - If an object is specified in the `value` parameter, then the database object will be returned.
  (type of `TReturnValue` - fallback to the manual typing of returned database object for specified key)

- **Example:**
```ts
  await quickMongo.set('something', 'hello from quick-mongo-super!')
  const hello = quickMongo.get('something')

  console.log(hello) // -> 'hello from quick-mongo-super!'

  await quickMongo.set('player.inventory', [])
  const inventory = quickMongo.get('player')

  console.log(inventory) // -> { inventory: [] }

  // Using objects as value will return the object of key `thats`:
  const result = await quickMongo.set('thats.an.object', { hello: 'world' })
  console.log(result) // -> { an: { object: { hello: 'world' } } }

  const thatsAnObject = quickMongo.get('thats.an.object')
  console.log(thatsAnObject) // -> { hello: 'world' }
```


## `delete(key: K): Promise<boolean>`
Deletes the data from database by key.

- **Parameters:**
  - `key` (`K`): The key to access the target in database by.

- **Returns:** `Promise<boolean>` - Whether the deletition was successful.
- **Example:**
```ts
  await quickMongo.delete('prop1') // deleting `prop1` from the database
  await quickMongo.delete('prop2.prop3') // deleting `prop3` property from `prop2` object in database
```


## `ping(): Promise<IDatabaseRequestsLatencyData>`
Sends a read, write and delete requests to the remote database and returns the request latencies in milliseconds.

- **Returns:** `Promise<IDatabaseRequestsLatencyData>` - Database requests latencies object.
- **Example:**
```ts
  const ping = await quickMongo.ping()
  console.log(ping) // -> { readLatency: 123, writeLatency: 124, deleteLatency: 125 }
```


## `add(key: K, numberToAdd: number): Promise<number>`
Performs an arithmetical addition on a target number in the database.

**[!!!] The type of target value must be a number.**

- **Parameters:**
  - `key` (`K`): The key to access the target in database by.
  - `numberToAdd` (`number`): The number to add to the target number in the database.

- **Returns:** `Promise<number>` - Addition operation result.

- **Example:**
```ts
  const additionResult = await quickMongo.add('points', 5);
  console.log(additionResult); // -> 10 (5 + 5 = 10)
```


## `subtract(key: K, numberToSubtract: number): Promise<number>`
Performs an arithmetical subtraction on a target number in the database.

**[!!!] The type of target value must be a number.**

- **Parameters:**
  - `key` (`K`): The key to access the target in database by.
  - `numberToSubtract` (`number`): The number to subtract from the target number in the database.

- **Returns:** `Promise<number>` - Subtraction operation result.


## `isTargetArray(key: K): boolean`
Determines whether the specified target is an array.

- **Parameters:**
  - `key` (`K`): The key to access the target in database by.

- **Returns:** `boolean` - Whether the target is an array.
- **Example:**
```ts
  const isArray = quickMongo.isTargetArray('array');
  console.log(isArray); // -> true
```


## `isTargetNumber(key: K): boolean`
Determines whether the specified target is a number.

- **Parameters:**
  - `key` (`K`): The key to access the target in database by.

- **Returns:** `boolean` - Whether the target is a number.
- **Example:**
```ts
  const isArray = quickMongo.isTargetArray('array');
  console.log(isArray); // -> true
```


## `push(key: K, ...values: RestOrArray<V>): Promise<V[]>`
Pushes the specified value(s) into the target array in the database.

**[!!!] The type of target value must be an array.**

- **Parameters:**
  - `key` (`K`): The key to access the target in database by.
  - `values` (`RestOrArray<V>`): The value(s) to be pushed into the target array.

- **Returns:** `Promise<V[]>` - Updated target array from the database.
- **Example:**
```ts
  const membersPushResult = await quickMongo.push('members', 'William');
  console.log(membersPushResult); // -> ['John', 'William']
```


## `pull(key: K, targetArrayElementIndex: number, value: V): Promise<V[]>`
Pushes the specified value into the target array in the database.

**[!!!] The type of target value must be an array.**

- **Parameters:**
  - `key` (`K`): The key to access the target in database by.
  - `targetArrayElementIndex` (`number`): The index to find the element in target array.
  - `value` (`V`): The value to be pushed into the target array.

- **Returns:** `Promise<V[]>` - Updated target array from the database.
- **Example:**
```ts
  const membersPullResult = await quickMongo.pull('members', 1, 'James');
  console.log(membersPullResult); // -> ['John', 'James', 'Tom']
```


## `pop(key: K, targetArrayElementIndex: number, value: V): Promise<V[]>`
Removes the specified element(s) from the target array in the database.

**[!!!] The type of target value must be an array.**

- **Parameters:**
  - `key` (`K`): The key to access the target in database by.
  - `targetArrayElementIndexes ` (`RestOrArray<number>`): The index(es) to find the element(s) in target array.

- **Returns:** `Promise<V[]>` - Updated target array from the database.
- **Example:**
```ts
  const membersPopResult = await quickMongo.pop('members', 1);
  console.log(membersPopResult); // -> ['John', 'Tom']
```


## `keys(key?: K): string[]`
Returns an array of object keys by specified database key.

- **Parameters:**
  - `key` (`K`, **optional**): The key to access the target in database by. If omitted, returns object keys of the database root.

- **Returns:** `string[]` - Database object keys array.
- **Example:**
```ts
  const prop3Keys = quickMongo.keys('prop3');
  console.log(prop3Keys); // -> ['prop4', 'prop5']
```


## `random(key: K): V`
Picks a random element of array in the database and returns the picked array element.

- **Parameters:**
  - `key` (`K`): The key to access the target in database by.

- **Returns:** `V` - The randomly picked element in the array.
- **Example:**
```ts
  const array = quickMongo.get('exampleArray') // assuming that the array is ['example1', 'example2', 'example3']
  console.log(array) // -> ['example1', 'example2', 'example3']

  const randomArrayElement = quickMongo.random('exampleArray')
  console.log(randomArrayElement) // -> randomly picked array element: either 'example1', 'example2', or 'example3'
```


## `clear(): Promise<boolean>`
Deletes everything from the database.

- **Returns:** `Promise<boolean>` - `true` if cleared successfully, `false` otherwise.
- **Example:**
```ts
  await quickMongo.clear(); // Deletes all the data from the database
```


## `deleteAll(): Promise<boolean>`
Deletes everything from the database.

This method is an alias for `QuickMongo.clear()` method.

- **Returns:** `Promise<boolean>` - `true` if cleared successfully, `false` otherwise.
- **Example:**
```ts
  await quickMongo.deleteAll(); // Deletes all the data from the database
```


## `all<T extends Record<string, any> = any>(): T`
Gets all the database contents from the cache.

- **Type Parameters:**
  - `T` (`object`): The type of object of all the database object to be returned.

- **Returns:** `T` - Cached database contents.
- **Example:**
```ts
  const database = quickMongo.all();
  console.log(database); // -> { ... (the object of all the data stored in database) }
```


## `loadCache(): Promise<void>`
Loads the database into cache.

It's **not required** to run this method on starting or after any database operations - cache management is performed automatically.

- **Returns:** `Promise<void>`.
- **Example:**
```ts
  await quickMongo.loadCache(); // Downloads all the database contents into the cache
```


## `raw<TInternalDataValue = any>(): Promise<IDatabaseInternalStructure<TInternalDataValue>[]>`
Makes a database request and fetches the raw database content - the data as it is stored in the internal `[__KEY]-[__VALUE]` storage format that was made to achieve better data accessibility across the module.

- **Type parameters:**
  - `TInternalDataValue` (`any`): The type of `__VALUE` property in each raw data object.

- **Returns:** `Promise<IDatabaseInternalStructure<TInternalDataValue>[]>` - Raw database content - the data as it is stored in internal `[__KEY]-[__VALUE]` storage format that was made to achieve better data accessibility across the module.


- **Example:**
```ts
  const rawData = await quickMongo.raw()
  console.log(rawData) // -> [{_id: '6534ee98408514005215ad2d', __KEY: 'something', __VALUE: 'something', __v: 0}, ...]
```


## `allFromDatabase<TValue extends Record<string, any> = V>(): Promise<TValue>`
Makes a direct request to the remote cluster and fetches all its contents.

- **Type parameters:**
  - `TValue` (`object`): The type of object of all the database object to be returned.

- **Returns:** `Promise<TValue>` - Fetched database contents.

- **Eaxmple:**
```ts
  const allDatabase = quickMongo.allFromDatabase()
  console.log(allDatabase) // -> { ... (the object of all the data stored in database) }
```
