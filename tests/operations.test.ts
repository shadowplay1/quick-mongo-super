import { promisify } from 'util'

import { describe, expect, test, afterAll, beforeAll } from '@jest/globals'
import { QuickMongo, QuickMongoClient } from '../src'

const sleep = promisify(setTimeout)

// eslint-disable-next-line
const quickMongoClient = new QuickMongoClient('mongodb://127.0.0.1:27018')
quickMongoClient.connected = true

beforeAll(async () => {
    await quickMongoClient.connect()
    await Promise.all(quickMongoClient.databases.map(database => database.deleteAll()))
})

describe('get, set, delete operations', () => {
    const database = new QuickMongo<string, any>(quickMongoClient, {
        name: 'test_database_1',
        collectionName: 'test_database_collection_1'
    })


    // QuickMongo.set()

    test.concurrent('set data', async () => {
        await database.loadCache()
        await sleep(1000)

        const setResults = [
            await database.set('someString', 'hello'),
            await database.set('someString123', 'hello123')
        ]

        await sleep(1000)
        return expect(setResults).toEqual(['hello', 'hello123'])
    })

    test.concurrent('set objects data', async () => {
        await database.loadCache()
        await sleep(1000)

        const setResults = [
            await database.set('someObject.someProperty.hello', 'hi'),
            await database.set('someObject.someProperty.hi', 'hello')
        ]

        await sleep(1000)
        return expect(setResults).toEqual(['hi', 'hello'])
    })


    // QuickMongo.get()

    test.concurrent('get data', async () => {
        await database.loadCache()
        await sleep(3000)

        const getResults = [
            database.get('someString'),
            database.get('someString123')
        ]

        await sleep(3000)
        return expect(getResults).toEqual(['hello', 'hello123'])
    })

    test.concurrent('get objects data', async () => {
        await database.loadCache()
        await sleep(3000)

        const getResults = [
            database.get('someObject.someProperty.hello'),
            database.get('someObject.someProperty.hi')
        ]

        await sleep(3000)
        return expect(getResults).toEqual(['hi', 'hello'])
    })

    test.concurrent('get unexistent value', async () => {
        await database.loadCache()
        await sleep(1000)

        const getResult = database.get('somethingElse')

        await sleep(1000)
        return expect(getResult).toBeNull()
    })


    // QuickMongo.has()

    test.concurrent('has data', async () => {
        await database.loadCache()
        await sleep(1000)

        const hasResults = [
            database.has('someString'),
            database.has('someString123')
        ]

        await sleep(1000)
        return expect(hasResults).toEqual([true, true])
    })

    test.concurrent('has objects data', async () => {
        await database.loadCache()
        await sleep(3000)

        const hasResults = [
            database.has('someObject.someProperty.hello'),
            database.has('someObject.someProperty.hi')
        ]

        await sleep(3000)
        return expect(hasResults).toEqual([true, true])
    })

    test.concurrent('has unexistent value', async () => {
        await database.loadCache()
        await sleep(1000)

        const hasResult = database.has('somethingElse')

        await sleep(1000)
        return expect(hasResult).toBeFalsy()
    })


    // QuickMongo.delete()

    test.concurrent('delete data', async () => {
        await database.loadCache()
        await sleep(3000)

        const deleteResults = [
            await database.delete('someString123'),
            await database.delete('someObject.someProperty.hi')
        ]

        await sleep(3000)
        return expect(deleteResults).toEqual([true, true])
    })

    test.concurrent('attempt to get deleted data', async () => {
        await database.loadCache()
        await sleep(3000)

        const deletedGetResults = [
            database.get('someString123'),
            database.get('someObject.someProperty.hi')
        ]

        await sleep(3000)
        return expect(deletedGetResults).toEqual([null, null])
    })

    test.concurrent('delete unexistent data', async () => {
        await database.loadCache()
        await sleep(3000)

        const unexistentDeleteResults = [
            await database.delete('somethingElse'),
            await database.delete('someObject.someProperty.hi')
        ]

        await sleep(3000)
        return expect(unexistentDeleteResults).toEqual([false, false])
    })
})


// post-testing cleanup
afterAll(async () => {
    await Promise.all(quickMongoClient.databases.map(database => database.deleteAll()))
    await quickMongoClient.disconnect()

    return
})
