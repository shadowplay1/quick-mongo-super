# Quick Mongo Super
[![Downloads](https://img.shields.io/npm/dt/quick-mongo-super?style=for-the-badge)](https://www.npmjs.com/package/quick-mongo-super)
[![Stable Version](https://img.shields.io/npm/v/quick-mongo-super?style=for-the-badge)](https://www.npmjs.com/package/quick-mongo-super)

<b>Quick Mongo Super</b> is a light-weight and easy-to-use Node.js module written in TypeScript to work with [MongoDB](https://mongodb.com/).

## 🕘 | Changelog

**v1.0.9**
- Code refactoring.
- Code optimization.
- JSDoc mismatches and typos fixes.
- `DatabaseProperties` and `DatabaseObject` interfaces are generic now.
- If the target requires to have data but it not, the module will throw an error now.
- Return types were changed from `boolean` to `DatabaseProperties` type for 
- - `set`
- - `remove`
- - `delete`
- - `add`
- - `subtract` 
- - `push` 
- - `pop`
- - `removeElement`
- - `pull`
- - `changeElement`
- methods in a main class.
- `all()`, `raw()` and all the methods above have received a new `P` type parameter to use them in `DatabaseProperties` and `DatabaseObject` interfaces.

**v1.0.8**
- Fixed bugs on connectoion errors.

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
