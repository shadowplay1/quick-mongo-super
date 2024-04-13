/* eslint-disable no-return-await */

import { describe, expect, test, afterAll, beforeAll } from '@jest/globals'
import { QuickMongo, QuickMongoClient } from '../src'

let quickMongoClient = new QuickMongoClient('mongodb://127.0.0.1:27018')
let database: QuickMongo<string, any>

beforeAll(async () => {
    const client = await quickMongoClient.connect()
    quickMongoClient = client

    database = new QuickMongo<string, any>(quickMongoClient, {
        name: 'test_database',
        collectionName: 'test_database_collection'
    })

    await database.deleteAll()
})

const resolvePromise = (promise: Promise<any>): Promise<boolean> => {
    return new Promise(resolve => {
        promise
            .then(() => resolve(true))
            .catch(() => resolve(false))
    })
}

const resolveFunction = (fn: (...args: any[]) => any): boolean => {
    try {
        fn()
        return true
    } catch {
        return false
    }
}


// getting data

describe('errors throwing: fetch()', () => {
    test.concurrent('\'key\' parameter is missing', async () => {
        // @ts-expect-error
        const errorTest = (): any => database.fetch()
        return expect(errorTest).toThrowError('\'key\' parameter is required but is missing.')
    })

    test.concurrent('\'key\' parameter type is incorrect', async () => {
        // @ts-expect-error
        const errorTest = (): any => database.fetch(123)
        return expect(errorTest).toThrowError('\'key\' must be a type of string. Received type: Number.')
    })

    test.concurrent('success case', async () => {
        const successTest = (): any => database.fetch('test')
        return expect(resolveFunction(successTest)).toBeTruthy()
    })
})

describe('errors throwing: has()', () => {
    test.concurrent('\'key\' parameter is missing', async () => {
        // @ts-expect-error
        const errorTest = (): any => database.has()
        return expect(errorTest).toThrowError('\'key\' parameter is required but is missing.')
    })

    test.concurrent('\'key\' parameter type is incorrect', async () => {
        // @ts-expect-error
        const errorTest = (): any => database.has(123)
        return expect(errorTest).toThrowError('\'key\' must be a type of string. Received type: Number.')
    })

    test.concurrent('success case', async () => {
        const successCase = (): any => database.has('test')
        return expect(resolveFunction(successCase)).toBeTruthy()
    })
})

describe('errors throwing: keys()', () => {
    test.concurrent('\'key\' parameter type is incorrect', async () => {
        // @ts-expect-error
        const errorTest = (): any => database.keys(123)
        return expect(errorTest).toThrowError('\'key\' must be a type of string. Received type: Number.')
    })

    test.concurrent('success case: \'key\' parameter is missing (return database root keys)', async () => {
        const successCase = (): any => database.keys()
        return expect(resolveFunction(successCase)).toBeTruthy()
    })

    test.concurrent('success case', async () => {
        const successCase = (): any => database.keys('test')
        return expect(resolveFunction(successCase)).toBeTruthy()
    })
})


// setting, deleting data

describe('errors throwing: set()', () => {
    test.concurrent('\'key\' parameter is missing', async () => {
        // @ts-expect-error
        const errorTest = async (): Promise<any> => await database.set()
        return expect(errorTest()).rejects.toThrowError('\'key\' parameter is required but is missing.')
    })

    test.concurrent('\'key\' parameter type is incorrect', async () => {
        // @ts-expect-error
        const errorTest = async (): Promise<any> => await database.set(123)
        return expect(errorTest).rejects.toThrowError('\'key\' must be a type of string. Received type: Number.')
    })

    test.concurrent('\'value\' parameter is missing', async () => {
        // @ts-expect-error
        const errorTest = async (): Promise<any> => await database.set('test')
        return expect(errorTest).rejects.toThrowError('\'value\' parameter is required but is missing.')
    })

    test.concurrent('success case', async () => {
        const successCase = async (): Promise<any> => await database.set('test', 123)
        return expect(resolvePromise(successCase())).resolves.toBeTruthy()
    })
})

describe('errors throwing: delete()', () => {
    test.concurrent('\'key\' parameter is missing', async () => {
        // @ts-expect-error
        const errorTest = async (): Promise<any> => await database.delete()
        return expect(errorTest).rejects.toThrowError('\'key\' parameter is required but is missing.')
    })

    test.concurrent('\'key\' parameter type is incorrect', async () => {
        // @ts-expect-error
        const errorTest = async (): Promise<any> => await database.delete(123)
        return expect(errorTest).rejects.toThrowError('\'key\' must be a type of string. Received type: Number.')
    })

    test.concurrent('success case', async () => {
        const successCase = async (): Promise<any> => await database.delete('test')
        return expect(resolvePromise(successCase())).resolves.toBeTruthy()
    })
})


// math operations

describe('errors throwing: add()', () => {
    test.concurrent('\'key\' parameter is missing', async () => {
        // @ts-expect-error
        const errorTest = async (): Promise<any> => await database.add()
        return expect(errorTest).rejects.toThrowError('\'key\' parameter is required but is missing.')
    })

    test.concurrent('\'key\' parameter type is incorrect', async () => {
        // @ts-expect-error
        const errorTest = async (): Promise<any> => await database.add(123)
        return expect(errorTest).rejects.toThrowError('\'key\' must be a type of string. Received type: Number.')
    })

    test.concurrent('\'numberToAdd\' parameter is missing', async () => {
        // @ts-expect-error
        const errorTest = async (): Promise<any> => await database.add('test')
        return expect(errorTest).rejects.toThrowError('\'numberToAdd\' parameter is required but is missing.')
    })

    test.concurrent('\'numberToAdd\' parameter type is incorrect', async () => {
        // @ts-expect-error
        const errorTest = async (): Promise<any> => await database.add('test', 'test')
        return expect(errorTest).rejects.toThrowError('\'numberToAdd\' must be a type of number. Received type: String.')
    })

    test.concurrent('target is not a number', async () => {
        await database.set('arr', [])

        const errorTest = async (): Promise<any> => await database.add('arr', 123)

        return expect(errorTest).rejects.toThrowError(
            'The target in database must be a type of number. Received target type: Array.'
        )
    })

    test.concurrent('success case', async () => {
        await database.set('arr', [])

        const successTest = async (): Promise<any> => await database.add('test', 123)
        return expect(resolvePromise(successTest())).resolves.toBeTruthy()
    })
})

describe('errors throwing: subtract()', () => {
    test.concurrent('\'key\' parameter is missing', async () => {
        // @ts-expect-error
        const errorTest = async (): Promise<any> => await database.subtract()
        return expect(errorTest).rejects.toThrowError('\'key\' parameter is required but is missing.')
    })

    test.concurrent('\'key\' parameter type is incorrect', async () => {
        // @ts-expect-error
        const errorTest = async (): Promise<any> => await database.subtract(123)
        return expect(errorTest).rejects.toThrowError('\'key\' must be a type of string. Received type: Number.')
    })

    test.concurrent('\'numberToSubtract\' parameter is missing', async () => {
        // @ts-expect-error
        const errorTest = async (): Promise<any> => await database.subtract('test')
        return expect(errorTest).rejects.toThrowError('\'numberToSubtract\' parameter is required but is missing.')
    })

    test.concurrent('\'numberToSubtract\' parameter type is incorrect', async () => {
        // @ts-expect-error
        const errorTest = async (): Promise<any> => await database.subtract('test', 'test')

        return expect(errorTest).rejects.toThrowError(
            '\'numberToSubtract\' must be a type of number. Received type: String.'
        )
    })

    test.concurrent('target is not a number', async () => {
        await database.set('arr', [])

        const errorTest = async (): Promise<any> => await database.subtract('arr', 123)

        return expect(errorTest).rejects.toThrowError(
            'The target in database must be a type of number. Received target type: Array.'
        )
    })

    test.concurrent('success case', async () => {
        const successTest = async (): Promise<any> => await database.subtract('test', 123)
        return expect(resolvePromise(successTest())).resolves.toBeTruthy()
    })
})


// array methods
// soon...


// post-testing cleanup

afterAll(async () => {
    await database.deleteAll()
    await quickMongoClient.disconnect()
})
