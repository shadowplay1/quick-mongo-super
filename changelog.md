# Quick Mongo Super
[![Downloads](https://img.shields.io/npm/dt/quick-mongo-super?style=for-the-badge)](https://www.npmjs.com/package/quick-mongo-super)
[![Stable Version](https://img.shields.io/npm/v/quick-mongo-super?style=for-the-badge)](https://www.npmjs.com/package/quick-mongo-super)

<b>Quick Mongo Super</b> is a light-weight and easy-to-use Node.js module written in TypeScript to work with [MongoDB](https://mongodb.com/).

## 🕘 | Changelog

**v3.0.2**
- Fixed the type bug when inputting keys that don't exist in the interface would lead to unexpected `value` type.
- Fixed the incorrect return type of `QuickMongo.set()` method.

**v3.0.1**
- Now all the `key` parameters allow to pass in the normal `string` type, alongside the **keys autocomplete** feature released in **v3.0.0**.

**v3.0.0**
- Improved documentation, fixed typos & mismatches.
- Fixed minor types bugs.
- Bumped `mongoose` to the latest version, `v8.5.3`
- Added unneeded package files into `.npmignore` to reduce the final npm package size.
- Completely changed the type system - now all the values are being **inferred** from the object keys you specify in database requests (with keys autocomplete as well 👀)!
- Added a new `QuickMongo.getFromDatabase()` method that works the same way as `QuickMongo.get()`, but instead of getting the data from **cache**, a request being made to **remote cluster**.

**NOTE:** This release is being considered **major** due to **significant** changes to the types system of the module which might **impact** TypeScript users.

**v2.2.0**
- Added `QuickMongo.values()` method; it works the same way as `QuickMongo.keys()`, but returns the object **values** instead of object **keys**.
- Added **6** new **array-like** methods in `QuickMongo` class that simplify the **read** operations on **database object values**:
  - `QuickMongo.find()`
  - `QuickMongo.map()`
  - `QuickMongo.findIndex()`
  - `QuickMongo.filter()`
  - `QuickMongo.some()`
  - `QuickMongo.every()`
- Fixed **caching** bug when **all** falsy values were represented as `null` in the cache.
- Fixed any **falsy** result being represented as `null` in `QuickMongo.random()` method. 
- Fully reworked some of the existing **unit tests**.
- Added **references** to used **types/classes/interfaces/built-ins** in documentation.
- Fixed **documentation** mismatches.
- Fixed **JSDoc** mismatches.
- Small documentation improvements.
- Improved **descriptions** of some types.
- Added **missing JSDoc** in `TypedObject` class and in `IDatabaseInternalStructure<T>` and `IDatabaseRequestsLatencyData` types.
- Fixed typos.

**v2.1.0**
- Added a `size` property in `QuickMongo` class that determines the number of keys in the root of the database. Equivalent to `QuickMongo.keys().length`.
- Added a `TKeys` type parameter in `QuickMongo.keys()` method that determines the type of returned keys.
- Added a check if the device is online (connected to the internet) when connecting to online (non-local) MongoDB cluster.
- Small bugfixes and improvements.
- Typos fixes.

**v2.0.10**
- Fixed cases when the exception if failed to connect to the MongoDB cluster **won't be thrown**.

**v2.0.9**
- Added exceptions on incorrect format of the **MongoDB connection URI** or its absence in `QuickMongoClient` constructor.
- Added exceptions on incorrectly specified constructor parameters or their absence in `QuickMongo` constructor.
- Added an exception if failed to connect to the **MongoDB cluster**.

**v2.0.8**
- Updated dependencies.
- Removed unnecessary internal MongoDB configuration.
- Added compatibility with **Bun**.
- Fixed a bug when running `QuickMongo.clear()` method was nuking data in the **whole MongoDB cluster** instead of data in **specific QuickMongo collection**.
- Added a new optional `mongoClientOptions` parameter in `QuickMongoClient` constructor to allow passing specific MongoDB client options into the `mongodb` module.

**v2.0.7**
- Small bug fixes.

**v2.0.5**
- Typings bug fixes.

**v2.0.2**
- Removed the `TValue` type parameter from all database operations methods due to it breaking the type of the specifying value.
- Changed the default value of type parameter `K` of `QuickMongo` class from `any` to `string`.
- Fixed the incorrect documentation for `QuickMongo.random()` method.

**v2.0.0**
- Completely rewritten the module and changed its entire structure.
- Code optimization.
- Typings improvements.
- Bug fixes.
- Migrated from `mongodb` to `mongoose` package.
- `Emitter` minor improvements.
- Added database caching system, allowing to improve the performance of the module by far.
- Removed the unnecessary `MongoItems` files and changed the way of importing the module's objects.
- Added testing files.
- Added CI/CD workflows to check the build status, linting and tests passing.
- Rewritten, optimized and improved the erroring system.
- Changed the approach of database connection and how the databases are created:
 - Added the new `QuickMongoClient` and `QuickMongo` classes.
 - Now, in order to create a database, you need to create an instance of `QuickMongoClient` first:
```ts
import { QuickMongoClient, QuickMongo } from 'quick-mongo-super'

const connectionURI = 'mongodb://127.0.0.1:27018'

const quickMongoClient = new QuickMongoClient(connectionURI)
quickMongoClient.connect()
```

- - And then you want to create a new instance of `QuickMongo` database:
```ts
const mongo = new QuickMongo(quickMongoClient, {
    name: 'databaseName',
    collectionName: 'collectionName'
})
```
- - This approach will allow you to create **multiple database instances** in different cluster locations (database/collection) under a **single** cluster connection - **without** having to create separated connections to your cluster to create different database instances!
- Rewritten and improved [examples](https://github.com/shadowplay1/quick-mongo-super/tree/main/examples) for both **TypeScript** and **JavaScript**.
- Removed the legacy `changeElement` and `removeElement` methods in favor newer of `pull` and `pop` methods.
- Removed the `checkUpdates` method due to it being unused anywhere.
- Removed `node-fetch` from dependencies.

**v1.0.19**
- Bumped `mongodb` dependency from `v4.3.1` to `v4.17.0`.

**v1.0.18**
- Fixed typing bug in all methods requiring to specify a value.

**v1.0.17**
- Fixed typo in type name.

**v1.0.16**
- Added the `IsUsingDatabaseProperties` generic type that defaults to `false` into main `Mongo` class to determine if `DatabaseProperties object will be returned in all database methods.
- Typings improvements.

**v1.0.15**
- Added the `K` generic type into main `Mongo` class that represents the type of database keys.
- Typings bugfixes & improvements.

**v1.0.14**
- Fixed the incorrect import paths in `MongoItems` files.

**v1.0.13**
- Changed the way how all files are exported. (keeping QuickMongo exported as it is for legacy reasons)
- Improved configurations.
- Improved code linting & code quality.
- Deleted unnecessary files to reduce the package size.
- Added an optional type parameter to the main `Mongo` class that will be used in all methods that are returning the `DatabaseProperties` object.
- Added a type parameter to the `Emitter` class that will determine what type will be used to get the event names and their return types from.
- Added a new `MongoItems.js` file that contains all the module's **types**, and **classes**.
- Added a new `MongoItems.d.ts` file that contains all the module's **types**, **interfaces** and **classes**.

**v1.0.12**
- Bug fixes.

**v1.0.11**
- Fixed the empty key error when trying to clear the database - now the `key` parameter in `keysList()` method is optional and defaults to empty string (`''`) if not specified.
- Changed the ESLint configuration and linted the code to make it look prettier.
- Added the `I` prefix to all interface names (e.g. `MongoConnectionOptions` => `IMongoConnectionOptions`). Keeping the `DatabaseProperties` interface without the `I` prefix for legacy reasons.
- Removed the `./src/` and `./examples/` directories from publishing on NPM to reduce the package size. These folders will still be available in module's GitHub repository. From now, only compiled version of the module (`./dist/`) and typings (`./typings`) folders are going to be published on NPM.
- Removed `./typings` directory from pushing in the repository as the folder unnecessary in the repository.
- Added a type parameters description in each generic method's description.
- Fixed JSDoc **parameter types**/**return types** and **descriptions** mismatches.
- Fixed linting issues in example scripts.
- Fixed minor bugs.
- Added an option for `package.json` to disable the post-install greeting logs. To disable them, you need to add this in your `package.json`:
```json
"quick-mongo-super": {
    "postinstall": false
}
```
To enable them back, you need to set the `"postinstall"` property of `"quick-mongo-super"` object to `true`:
```json
"quick-mongo-super": {
    "postinstall": true
}
```

**v1.0.10**
- Fixed the wrong error appearing when the options are not specified.
- Fixed the `db.keyList()` method bugs.

**v1.0.9**
- Code refactor.
- Code optimization.
- JSDoc mismatches and typos fixes.
- `DatabaseProperties` and `DatabaseObject` interfaces are generic now.
- If the target requires to have data but it not, the module will throw an error now.
- Return types were changed from `boolean` to `DatabaseProperties` type for
- - `set()`
- - `remove()`
- - `delete()`
- - `add()`
- - `subtract()`
- - `push()`
- - `pop()`
- - `removeElement()`
- - `pull()`
- - `changeElement()`
- methods in a main class.
- `all()`, `raw()` and all the methods above have received a new `P` type parameter to use them in `DatabaseProperties` and `DatabaseObject` interfaces.

**v1.0.8**
- Fixed bugs on connection errors.

**v1.0.7**
- Fixed typings bug.

**v1.0.6**
- Fixed the crash when pushing to an empty key.
- `db.changeElement()` and `db.removeElement()` methods are now aliases for new `db.pull()` and `db.pop()` methods.
- `db.deleteElement()` alias for `db.removeElement()` was removed.

**v1.0.4**
- Fixed the bug in `db.add()`/`db.subtract()`: when the target array was empty, module adds/subtracts 2 times.

**v1.0.3**
- Fixed the bug in `db.push()` when 2 items where added when the target array was empty.
- Added a new `db.deleteAll()`/`db.clear()` methods to clear the whole database.
- Other minor bug fixes.

**v1.0.2**
- Bug fixes.
- Typings changes.
- New method: `db.checkUpdates()`
- New option: `mongoClientOptions`. Allows to set the options for the MongoClient class.
- Post-Install script.
- Improved the [examples](https://github.com/shadowplay1/quick-mongo-super/tree/main/examples).
- Added the changelog page.
- Other minor changes.
-
**v1.0.1**
- Added new methods:
1. `db.ping()` (checks the read, write and delete latencies).
2. `db.has(key)` / `db.includes(key)` methods were added.
3. `db.random(key)` (random element from array in database).

**v1.0.0**
- Created the module and added is methods to work with MongoDB (connect, disconnect, fetch, set, etc.).

## ❗ | Useful Links
<ul>
<li><b><a href="https://www.npmjs.com/package/quick-mongo-super">NPM</a></b></li>
<li><b><a href="https://github.com/shadowplay1/quick-mongo-super">GitHub</a></b></li>
<li><b><a href="https://github.com/shadowplay1/quick-mongo-super/tree/main/examples">Examples</a></b></li>
<li><b><a href="https://discord.gg/4pWKq8vUnb">Discord Server</a></b></li>
</ul>
<br>
<b>If you don't understand something or you are experiencing problems, feel free to join our <a href="https://discord.gg/4pWKq8vUnb">Support Server</a>.</b>
<br>
<b>Module Created by ShadowPlay.</b>

# ❤️ Thanks for using Quick Mongo Super ❤️
