// TODO: remove artificial delays
// TODO: perform operations and check database in the same tests
// TODO: uncomment 'attempt to get deleted data' test

import { promisify } from 'util'

import { describe, expect, test, afterAll, beforeAll } from '@jest/globals'
import { QuickMongo, QuickMongoClient } from '../src'

const _sleep = promisify(setTimeout)

let quickMongoClient = new QuickMongoClient('mongodb://127.0.0.1:27018')
let database: QuickMongo<string, any>

beforeAll(async () => {
    const client = await quickMongoClient.connect()
    quickMongoClient = client

    database = new QuickMongo<string, any>(quickMongoClient, {
        name: 'test_database_1',
        collectionName: 'test_database_collection_1'
    })

    await database.deleteAll()
})

describe('get, set, delete operations', () => {
    // QuickMongo.set()

    test.concurrent('set data', async () => {
        const setResults = [
            await database.set('someString', 'hello'),
            await database.set('someString123', 'hello123')
        ]

        return expect(setResults).toEqual(['hello', 'hello123'])
    })

    test.concurrent('set objects data', async () => {
        const setResults = [
            await database.set('someObject.someProperty.hello', 'hi'),
            await database.set('someObject.someProperty.hi', 'hello')
        ]

        return expect(setResults).toEqual(['hi', 'hello'])
    })


    // QuickMongo.get()

    test.concurrent('get data', async () => {
        await database.loadCache()
        await _sleep(1000)

        const getResults = [
            database.get('someString'),
            database.get('someString123')
        ]

        return expect(getResults).toEqual(['hello', 'hello123'])
    })

    test.concurrent('get objects data', async () => {
        await database.loadCache()
        await _sleep(1000)

        const getResults = [
            database.get('someObject.someProperty.hello'),
            database.get('someObject.someProperty.hi')
        ]

        return expect(getResults).toEqual(['hi', 'hello'])
    })

    test.concurrent('get unexistent value', async () => {
        await database.loadCache()
        await _sleep(1000)

        const getResult = database.get('somethingElse')
        return expect(getResult).toBeNull()
    })


    // QuickMongo.has()

    test.concurrent('has data', async () => {
        await database.loadCache()
        await _sleep(1000)

        const hasResults = [
            database.has('someString'),
            database.has('someString123')
        ]

        return expect(hasResults).toEqual([true, true])
    })

    test.concurrent('has objects data', async () => {
        await database.loadCache()
        await _sleep(1000)

        const hasResults = [
            database.has('someObject.someProperty.hello'),
            database.has('someObject.someProperty.hi')
        ]

        return expect(hasResults).toEqual([true, true])
    })

    test.concurrent('has unexistent value', async () => {
        const hasResult = database.has('somethingElse')
        return expect(hasResult).toBeFalsy()
    })


    // QuickMongo.delete()

    test.concurrent('delete data', async () => {
        await database.loadCache()
        await _sleep(1000)

        const deleteResults = [
            await database.delete('someString123'),
            await database.delete('someObject.someProperty.hi')
        ]

        return expect(deleteResults).toEqual([true, true])
    })

    // test.concurrent('attempt to get deleted data', async () => {
    //     await database.loadCache()
    //     await _sleep(1000)

    //     const deletedGetResults = [
    //         database.get('someString123'),
    //         database.get('someObject.someProperty.hi')
    //     ]

    //     return expect(deletedGetResults).toEqual([null, null])
    // })

    test.concurrent('delete unexistent data', async () => {
        await database.loadCache()
        await _sleep(1000)

        const unexistentDeleteResults = [
            await database.delete('justSomething'),
            await database.delete('someRandomObject.someRandomProperty.randomProp')
        ]

        return expect(unexistentDeleteResults).toEqual([false, false])
    })
})


// post-testing cleanup
afterAll(async () => {
    await Promise.all(quickMongoClient.databases.map(database => database.deleteAll()))
    await quickMongoClient.disconnect()
})
