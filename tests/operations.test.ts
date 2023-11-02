import { promisify } from 'util'

import { describe, expect, test, afterAll, beforeAll } from '@jest/globals'
import { QuickMongo, QuickMongoClient } from '../src'

const sleep = promisify(setTimeout)

// eslint-disable-next-line
const quickMongoClient = new QuickMongoClient('mongodb://127.0.0.1:27018')
quickMongoClient.connected = true

beforeAll(async () => {
    await quickMongoClient.connect()
})

describe('get, set, delete operations', () => {
    const database = new QuickMongo<string, any>(quickMongoClient, {
        name: 'test_database',
        collectionName: 'test_database_collection'
    })


    // QuickMongo.set()

    test.concurrent('set data', async () => {
        await database.loadCache()

        const setResults = [
            await database.set<string>('someString', 'hello'),
            await database.set<string>('someString123', 'hello123'),
            await database.set<number>('someNumber', 1)
        ]

        return expect(setResults).toEqual(['hello', 'hello123', 1])
    })

    test.concurrent('set objects data', async () => {
        await quickMongoClient.connect()

        const setResult = await database.set('someObject.someProperty.hello', 'hi')
        return expect(setResult).toEqual('hi')
    })


    // QuickMongo.get()

    test.concurrent('get data', async () => {
        await sleep(1000)

        const getResults = [
            database.get<string>('someString'),
            database.get<string>('someString123'),
            database.get<number>('someNumber')
        ]

        return expect(getResults).toEqual(['hello', 'hello123', 1])
    })

    test.concurrent('get objects data', async () => {
        await database.loadCache()
        await sleep(1000)

        const getResult = database.get<string>('someObject.someProperty.hello')
        return expect(getResult).toEqual('hi')
    })

    test.concurrent('get unexistent value', async () => {
        await database.loadCache()
        await sleep(1000)

        const getResult = database.get('somethingElse')
        return expect(getResult).toBeNull()
    })


    // QuickMongo.has()

    test.concurrent('has data', async () => {
        await database.loadCache()
        await sleep(1000)

        const hasResults = [
            database.has('someString'),
            database.has('someString123'),
            database.has('someNumber')
        ]

        return expect(hasResults).toEqual([true, true, true])
    })

    test.concurrent('has objects data', async () => {
        await database.loadCache()

        const hasResult = database.has('someObject.someProperty.hello')
        return expect(hasResult).toEqual(true)
    })

    test.concurrent('has unexistent value', async () => {
        await database.loadCache()

        const hasResult = database.has('somethingElse')
        return expect(hasResult).toEqual(false)
    })


    // QuickMongo.delete()

    test.concurrent('delete data', async () => {
        await database.loadCache()
        await sleep(1000)

        const hasResult = await database.delete('someString123')
        return expect(hasResult).toEqual(true)
    })

    test.concurrent('attempt to get deleted data', async () => {
        await database.loadCache()
        await sleep(1000)

        const deletedResult = database.get('someString123')
        return expect(deletedResult).toBeNull()
    })

    test.concurrent('delete unexistent data', async () => {
        await database.loadCache()
        await sleep(1000)

        const hasResult = await database.delete('somethingElse')
        return expect(hasResult).toEqual(false)
    })
})


// post-testing cleanup
afterAll(async () => {
    await Promise.all(quickMongoClient.databases.map(database => database.deleteAll()))
    await quickMongoClient.disconnect()

    return
})
