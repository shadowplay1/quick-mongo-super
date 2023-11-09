import { describe, expect, test, afterAll, beforeAll } from '@jest/globals'
import { QuickMongo, QuickMongoClient } from '../src'

// eslint-disable-next-line
const quickMongoClient = new QuickMongoClient('mongodb://127.0.0.1:27018')
quickMongoClient.connected = true

beforeAll(async () => {
    await quickMongoClient.connect()
})

const isPromiseResolved = async (promise: Promise<any>): Promise<boolean> => {
    try {
        await promise
        return true
    } catch {
        return false
    }
}


// getting data

describe('errors throwing: fetch()', () => {
    const database = new QuickMongo<string, any>(quickMongoClient, {
        name: 'test_database',
        collectionName: 'test_database_collection'
    })

    test.concurrent('\'key\' parameter is missing', async () => {
        // @ts-expect-error
        const errorTest = (): any => database.fetch()
        return expect(errorTest).toThrowError('\'key\' parameter is required but is missing.')
    })

    test.concurrent('\'key\' parameter type is incorrect', async () => {
        // @ts-expect-error
        const errorTest = (): any => database.fetch(123)
        return expect(errorTest).toThrowError('\'key\' must be a type of string. Received type: number.')
    })

    test.concurrent('success case', async () => {
        const errorTest = (): any => database.fetch('test')
        return expect(isPromiseResolved(errorTest())).resolves.toBeTruthy()
    })
})

describe('errors throwing: has()', () => {
    const database = new QuickMongo<string, any>(quickMongoClient, {
        name: 'test_database',
        collectionName: 'test_database_collection'
    })

    test.concurrent('\'key\' parameter is missing', async () => {
        // @ts-expect-error
        const errorTest = (): any => database.has()
        return expect(errorTest).toThrowError('\'key\' parameter is required but is missing.')
    })

    test.concurrent('\'key\' parameter type is incorrect', async () => {
        // @ts-expect-error
        const errorTest = (): any => database.has(123)
        return expect(errorTest).toThrowError('\'key\' must be a type of string. Received type: number.')
    })

    test.concurrent('success case', async () => {
        const errorTest = (): any => database.has('test')
        return expect(isPromiseResolved(errorTest())).resolves.toBeTruthy()
    })
})

describe('errors throwing: keys()', () => {
    const database = new QuickMongo<string, any>(quickMongoClient, {
        name: 'test_database',
        collectionName: 'test_database_collection'
    })

    test.concurrent('\'key\' parameter type is incorrect', async () => {
        // @ts-expect-error
        const errorTest = (): any => database.keys(123)
        return expect(errorTest).toThrowError('\'key\' must be a type of string. Received type: number.')
    })

    test.concurrent('success case: \'key\' parameter is missing (return database root keys)', async () => {
        const errorTest = (): any => database.keys()
        return expect(isPromiseResolved(errorTest())).resolves.toBeTruthy()
    })

    test.concurrent('success case', async () => {
        const errorTest = (): any => database.keys('test')
        return expect(isPromiseResolved(errorTest())).resolves.toBeTruthy()
    })
})


// setting, deleting data

describe('errors throwing: set()', () => {
    const database = new QuickMongo<string, any>(quickMongoClient, {
        name: 'test_database_0',
        collectionName: 'test_database_collection_0'
    })

    test.concurrent('\'key\' parameter is missing', async () => {
        // @ts-expect-error
        const errorTest = (): any => database.set()
        return expect(errorTest).toThrowError('\'key\' parameter is required but is missing.')
    })

    test.concurrent('\'key\' parameter type is incorrect', async () => {
        // @ts-expect-error
        const errorTest = (): any => database.set(123)
        return expect(errorTest).toThrowError('\'key\' must be a type of string. Received type: number.')
    })

    test.concurrent('\'value\' parameter is missing', async () => {
        // @ts-expect-error
        const errorTest = (): any => database.set('test')
        return expect(errorTest).toThrowError('\'value\' parameter is required but is missing.')
    })

    test.concurrent('success case', async () => {
        // for further array methods testing
        await database.set('arr', [])

        const errorTest = (): any => database.set('test', 123)
        return expect(isPromiseResolved(errorTest())).resolves.toBeTruthy()
    })
})

describe('errors throwing: delete()', () => {
    const database = new QuickMongo<string, any>(quickMongoClient, {
        name: 'test_database',
        collectionName: 'test_database_collection'
    })

    test.concurrent('\'key\' parameter is missing', async () => {
        // @ts-expect-error
        const errorTest = (): any => database.delete()
        return expect(errorTest).toThrowError('\'key\' parameter is required but is missing.')
    })

    test.concurrent('\'key\' parameter type is incorrect', async () => {
        // @ts-expect-error
        const errorTest = (): any => database.delete(123)
        return expect(errorTest).toThrowError('\'key\' must be a type of string. Received type: number.')
    })

    test.concurrent('success case', async () => {
        const errorTest = (): any => database.delete('test')
        return expect(isPromiseResolved(errorTest())).resolves.toBeTruthy()
    })
})


// math operations

describe('errors throwing: add()', () => {
    const database = new QuickMongo<string, any>(quickMongoClient, {
        name: 'test_database',
        collectionName: 'test_database_collection'
    })

    test.concurrent('\'key\' parameter is missing', async () => {
        // @ts-expect-error
        const errorTest = (): any => database.add()
        return expect(errorTest).toThrowError('\'key\' parameter is required but is missing.')
    })

    test.concurrent('\'key\' parameter type is incorrect', async () => {
        // @ts-expect-error
        const errorTest = (): any => database.add(123)
        return expect(errorTest).toThrowError('\'key\' must be a type of string. Received type: number.')
    })

    test.concurrent('\'numberToAdd\' parameter is missing', async () => {
        // @ts-expect-error
        const errorTest = (): any => database.add('test')
        return expect(errorTest).toThrowError('\'numberToAdd\' parameter is required but is missing.')
    })

    test.concurrent('\'numberToAdd\' parameter type is incorrect', async () => {
        // @ts-expect-error
        const errorTest = (): any => database.add('test', 'test')
        return expect(errorTest).toThrowError('\'numberToAdd\' must be a type of number. Received type: string.')
    })

    test.concurrent('target is not a number', async () => {
        const errorTest = (): any => database.add('arr', 123)

        return expect(errorTest).toThrowError(
            'The target in database must be a type of number. Received target type: Array.'
        )
    })

    test.concurrent('success case', async () => {
        const errorTest = (): any => database.add('test', 123)
        return expect(isPromiseResolved(errorTest())).resolves.toBeTruthy()
    })
})

describe('errors throwing: subtract()', () => {
    const database = new QuickMongo<string, any>(quickMongoClient, {
        name: 'test_database',
        collectionName: 'test_database_collection'
    })

    test.concurrent('\'key\' parameter is missing', async () => {
        // @ts-expect-error
        const errorTest = (): any => database.subtract()
        return expect(errorTest).toThrowError('\'key\' parameter is required but is missing.')
    })

    test.concurrent('\'key\' parameter type is incorrect', async () => {
        // @ts-expect-error
        const errorTest = (): any => database.subtract(123)
        return expect(errorTest).toThrowError('\'key\' must be a type of string. Received type: number.')
    })

    test.concurrent('\'numberToSubtract\' parameter is missing', async () => {
        // @ts-expect-error
        const errorTest = (): any => database.subtract('test')
        return expect(errorTest).toThrowError('\'numberToSubtract\' parameter is required but is missing.')
    })

    test.concurrent('\'numberToSubtract\' parameter type is incorrect', async () => {
        // @ts-expect-error
        const errorTest = (): any => database.subtract('test', 'test')
        return expect(errorTest).toThrowError('\'numberToSubtract\' must be a type of number. Received type: string.')
    })

    test.concurrent('target is not a number', async () => {
        const errorTest = (): any => database.subtract('arr', 123)

        return expect(errorTest).toThrowError(
            'The target in database must be a type of number. Received target type: Array.'
        )
    })

    test.concurrent('success case', async () => {
        const errorTest = (): any => database.subtract('test', 123)
        return expect(isPromiseResolved(errorTest())).resolves.toBeTruthy()
    })
})


// array methods

// post-testing cleanup
afterAll(async () => {
    await Promise.all(quickMongoClient.databases.map(database => database.deleteAll()))
    await quickMongoClient.disconnect()

    return
})
