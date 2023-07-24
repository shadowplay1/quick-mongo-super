# Quick Mongo Super
[![Downloads](https://img.shields.io/npm/dt/quick-mongo-super?style=for-the-badge)](https://www.npmjs.com/package/quick-mongo-super)
[![Stable Version](https://img.shields.io/npm/v/quick-mongo-super?style=for-the-badge)](https://www.npmjs.com/package/quick-mongo-super)

<b>Quick Mongo Super</b> is a light-weight and easy-to-use Node.js module written in TypeScript to work with [MongoDB](https://mongodb.com/).

## 🕘 | Changelog

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
