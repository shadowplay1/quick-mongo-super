# Quick Mongo Super
[![Downloads](https://img.shields.io/npm/dt/quick-mongo-super?style=for-the-badge)](https://www.npmjs.com/package/quick-mongo-super)
[![Stable Version](https://img.shields.io/npm/v/quick-mongo-super?style=for-the-badge)](https://www.npmjs.com/package/quick-mongo-super)

<b>Quick Mongo Super</b> is a light-weight and easy-to-use Node.js module written in TypeScript to work with [MongoDB](https://mongodb.com/).

## ❓ | Why?
<ul>
<li><b>TypeScript Support 📘</b></li>
<li><b>100% Promise-based 📜</b></li>
<li><b>Flexible ⚙️</b></li>
<li><b>Easy to use 👍</b></li>
<li><b>Beginner Friendly 😄</b></li>
</ul>

## 📂 | Installation
<b>Note:</br><b>
<b>Node.js 14.0.0 or newer is required.</b><br>
```console
npm i quick-mongo-super
yarn add quick-mongo-super
pnpm add quick-mongo-super
```

## Examples
### Initialize the module

```ts
import QuickMongo from '../src/index'

const db = new QuickMongo({
    connectionURI: 'your mongodb connection URI here', // MongoDB connection URI to connect to the database.
    dbName: 'db', // MongoDB database name to use.
    collectionName: 'database' // MongoDB collection name to use.

    mongoClientOptions: {
      // MongoDB client options here.
    }
})
```

### Example Usage
```ts
    // checking for updates (optional)
    const versionData = await db.checkUpdates()
    console.log(versionData)

    // output:
    // {
    //   updated: true,
    //   installedVersion: '1.0.11',
    //   packageVersion: '1.0.11'
    // }


    // connect to database
    console.log('Connecting to database...')
    await db.connect()

    console.log('Connected to database!')


    // SETTING DATA

    // setting object in database
    await db.set<Omit<AccountData['auth'], 'password'>>('accountData.auth', {
      username: 'shadowplay'
    })

    // setting a property in object
    await db.set<string>('accountData.auth.password', 'test123')

    // accountData in database:
    // {
    //     auth: {
    //         username: 'shadowplay',
    //         password: 'test123'
    //     }
    // }


    // ARRAYS

    // pushing into an array
    await db.push<string>('accountData.roles', 'admin') // accountData.roles in database: ['admin']

    // changing the array element in database
    await db.changeElement<string>('accountData.roles', 0, 'user') // accountData.roles in database: ['user']

    // changing the array element in database
    await db.removeElement('accountData.roles', 0) // accountData.roles in database: []


    // NUMBERS

    // adding to a number
    await db.add('accountData.balance', 100)

    // subtracting from a number
    await db.subtract('accountData.balance', 50)

    // deleting properties
    await db.delete('accountData.roles')


    // GETTING DATA

    await db.fetch<AccountData>('accountData')
    // {
    //     auth: {
    //         username: 'shadowplay',
    //         password: 'test123'
    //     },
    //     roles: [],
    //     balance: 50
    // }


    // disconnect from database
    await db.disconnect()
```
See the full examples for JavaScript and TypeScript [here](https://github.com/shadowplay1/quick-mongo-super/tree/main/examples).

See the full changelog [here](https://github.com/shadowplay1/quick-mongo-super/blob/main/changelog.md).


## 🤔 | Help
<b>If you don't understand something or you're experiencing problems, feel free to join our <a href="https://discord.gg/4pWKq8vUnb">Support Server</a>.</b>

## 🕘 | My Other Modules
<ul>
<li><b><a href="https://www.npmjs.com/package/discord-economy-super">discord-economy-super</a></b></li>
<li><b><a href="https://www.npmjs.com/package/discord-leveling-super">discord-leveling-super</a></b></li>
</ul>

## ❗ | Useful Links
<ul>
<li><b><a href="https://www.npmjs.com/package/quick-mongo-super">NPM</a></b></li>
<li><b><a href="https://github.com/shadowplay1/quick-mongo-super">GitHub</a></b></li>
<li><b><a href="https://github.com/shadowplay1/quick-mongo-super/tree/main/examples">Examples</a></b></li>
<li><b><a href="https://github.com/shadowplay1/quick-mongo-super/blob/main/changelog.md">Changelog</a></b></li>
<li><b><a href="https://discord.gg/4pWKq8vUnb">Discord Server</a></b></li>
</ul>
<br>
<b>If you don't understand something or you are experiencing problems, feel free to join our <a href="https://discord.gg/4pWKq8vUnb">Support Server</a>.</b>
<br>
<b>Module Created by ShadowPlay.</b>

# ❤️ Thanks for choosing Quick Mongo Super ❤️
