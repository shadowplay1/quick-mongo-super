// TODO: perform operations and check database in the same tests

import { describe, expect, test, afterAll, beforeAll } from '@jest/globals'
import { QuickMongo, QuickMongoClient } from '../src'

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
    // QuickMongo.set() & QuickMongo.get()

    test.concurrent('set data', async () => {
        await database.set('someString', 'hello')
        await database.set('someString123', 'hello123')

        const operationResults = [
            database.get('someString'),
            database.get('someString123')
        ]

        return expect(operationResults).toEqual(['hello', 'hello123'])
    })

    test.concurrent('set objects data', async () => {
        await database.set('someObject.someProperty.hello', 'hi')
        await database.set('someObject.someProperty.hi', 'hello')

        const operationResults = [
            database.get('someObject.someProperty.hello'),
            database.get('someObject.someProperty.hi')
        ]

        return expect(operationResults).toEqual(['hi', 'hello'])
    })

    test.concurrent('get unexistent value', async () => {
        const getResult = database.get('somethingElse')
        return expect(getResult).toBeNull()
    })


    // QuickMongo.has()

    test.concurrent('has data', async () => {
        await database.set('someString', 'hello')
        await database.set('someString123', 'hello123')

        const hasResults = [
            database.has('someString'),
            database.has('someString123')
        ]

        return expect(hasResults).toEqual([true, true])
    })

    test.concurrent('has objects data', async () => {
        await database.set('someObject.someProperty.hello', 'hi')
        await database.set('someObject.someProperty.hi', 'hello')

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
        await database.delete('someString123')
        await database.delete('someObject.someProperty.hi')

        const deletedItems = [
            database.get('someString123'),
            database.get('someObject.someProperty.hi')
        ]

        return expect(deletedItems).toEqual([null, null])
    })

    test.concurrent('delete unexistent data', async () => {
        const unexistentDeleteResults = [
            await database.delete('justSomething'),
            await database.delete('someRandomObject.someRandomProperty.randomProp')
        ]

        return expect(unexistentDeleteResults).toEqual([false, false])
    })
})


// post-testing cleanup

afterAll(async () => {
    await database.deleteAll()
    await quickMongoClient.disconnect()
})
