import { promisify } from 'util'
import { describe, expect, test, afterEach, beforeEach } from '@jest/globals'
import { QuickMongo, QuickMongoClient } from '../src'

const sleep = promisify(setTimeout)

let quickMongoClient: QuickMongoClient
let database: QuickMongo<string, any>

beforeAll(async () => {
    quickMongoClient = new QuickMongoClient('mongodb://127.0.0.1:27018')
    quickMongoClient.connected = true
    await quickMongoClient.connect()
})

beforeEach(async () => {
    database = new QuickMongo<string, any>(quickMongoClient, {
        name: 'test_database_1',
        collectionName: 'test_database_collection_1'
    })
    await database.loadCache()
    await sleep(3000)
})

afterEach(async () => {
    await database.deleteAll()
})

describe('get, set, delete operations', () => {
    test.concurrent('set data', async () => {
        const setResults = await Promise.all([
            database.set<string>('someString', 'hello'),
            database.set<string>('someString123', 'hello123')
        ])

        return expect(setResults).toEqual(['hello', 'hello123'])
    })

    test.concurrent('get data', async () => {
        const getResults = [
            database.get<string>('someString'),
            database.get<string>('someString123')
        ]

        return expect(getResults).toEqual(['hello', 'hello123'])
    })

    test.concurrent('has data', async () => {
        const hasResults = [
            database.has('someString'),
            database.has('someString123')
        ]

        return expect(hasResults).toEqual([true, true])
    })

    test.concurrent('delete data', async () => {
        const deleteResults = await Promise.all([
            database.delete('someString123'),
            database.delete('someString')
        ])

        return expect(deleteResults).toEqual([true, true])
    })

    test.concurrent('attempt to get deleted data', async () => {
        const deletedGetResults = [
            database.get('someString123'),
            database.get('someString')
        ]

        return expect(deletedGetResults).toEqual([null, null])
    })

    test.concurrent('set objects data', async () => {
        const setResults = await Promise.all([
            database.set('someObject.someProperty.hello', 'hi'),
            database.set('someObject.someProperty.hi', 'hello')
        ])

        return expect(setResults).toEqual(['hi', 'hello'])
    })

    test.concurrent('get objects data', async () => {
        const getResults = [
            database.get<string>('someObject.someProperty.hello'),
            database.get<string>('someObject.someProperty.hi')
        ]

        return expect(getResults).toEqual(['hi', 'hello'])
    })

    test.concurrent('has objects data', async () => {
        const hasResults = [
            database.has('someObject.someProperty.hello'),
            database.has('someObject.someProperty.hi')
        ]

        return expect(hasResults).toEqual([true, true])
    })

    test.concurrent('delete unexistent data', async () => {
        const unexistentDeleteResults = await Promise.all([
            database.delete('somethingElse'),
            database.delete('someObject.someProperty.hi')
        ])

        return expect(unexistentDeleteResults).toEqual([false, false])
    })

    test.concurrent('get unexistent value', async () => {
        const getResult = database.get('somethingElse')
        return expect(getResult).toBeNull()
    })

    test.concurrent('attempt to get deleted objects data', async () => {
        const deletedGetResults = [
            database.get('someObject.someProperty.hello'),
            database.get('someObject.someProperty.hi')
        ]

        return expect(deletedGetResults).toEqual([null, null])
    })
})

afterAll(async () => {
    await quickMongoClient.disconnect()
})

