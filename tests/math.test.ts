import { describe, expect, test, afterAll, beforeAll } from '@jest/globals'
import { QuickMongo, QuickMongoClient } from '../src'

let quickMongoClient = new QuickMongoClient('mongodb://127.0.0.1:27018')
let database: QuickMongo<string, any>

beforeAll(async () => {
    const client = await quickMongoClient.connect()
    quickMongoClient = client

    database = new QuickMongo<string, any>(quickMongoClient, {
        name: 'test_database_2',
        collectionName: 'test_database_collection_2'
    })

    await database.deleteAll()
})

describe('addition operation', () => {
    // setting initial values

    test.concurrent('set number', async () => {
        const setResult = await database.set('number', 1)
        return expect(setResult).toEqual(1)
    })

    test.concurrent('set number in object', async () => {
        const setResult = await database.set('numbers.number', 5)
        return expect(setResult).toEqual(5)
    })


    // QuickMongo.add()

    test.concurrent('add +5', async () => {
        const addResult = await database.add('number', 5)
        return expect(addResult).toEqual(6)
    })

    test.concurrent('add +5 to number in object', async () => {
        const addResult = await database.add('numbers.number', 5)
        return expect(addResult).toBeDefined()
    })

    test.concurrent('add +5 to unexistent number', async () => {
        const addResult = await database.add('unexistentNumber', 5)
        return expect(addResult).toEqual(5)
    })


    // getting addition results

    test.concurrent('get addition results', async () => {
        const additionResults = [
            database.get('number'),
            database.get('numbers.number'),
            database.get('unexistentNumber')
        ]

        // previous tests cleanup
        database.delete('unexistentNumber')

        return expect(additionResults).toEqual([6, 10, 5])
    })
})

describe('subtraction operation', () => {
    // setting initial values

    test.concurrent('set number', async () => {
        const setResult = await database.set('number', 1)
        return expect(setResult).toEqual(1)
    })

    test.concurrent('set number in object', async () => {
        const setResult = await database.set('numbers.number', 5)
        return expect(setResult).toEqual(5)
    })


    // QuickMongo.subtract()

    test.concurrent('subtract -5', async () => {
        const subtractionResult = await database.subtract('number', 5)
        return expect(subtractionResult).toEqual(-4)
    })

    test.concurrent('subtract -5 from number in object', async () => {
        const subtractionResult = await database.subtract('numbers.number', 5)
        return expect(subtractionResult).toBeDefined()
    })

    test.concurrent('subtract -5 from unexistent number', async () => {
        const subtractResult = await database.subtract('unexistentNumber', 5)
        return expect(subtractResult).toEqual(-5)
    })


    // getting subtraction results

    test.concurrent('get subtraction results', async () => {
        const subtractionResults = [
            database.get('number'),
            database.get('numbers.number'),
            database.get('unexistentNumber')
        ]

        return expect(subtractionResults).toEqual([-4, 0, -5])
    })

    // QuickMongo.isTargetNumber()

    test.concurrent('isNumber checks', async () => {
        await database.set('notNumber', [])

        const isNumberResults = [
            database.isTargetNumber('number'),
            database.isTargetNumber('numbers.number'),
            database.isTargetNumber('notNumber'),
            database.isTargetNumber('somethingElse'),
        ]

        return expect(isNumberResults).toEqual([true, true, false, false])
    })
})


// post-testing cleanup
afterAll(async () => {
    await Promise.all(quickMongoClient.databases.map(database => database.deleteAll()))
    await quickMongoClient.disconnect()
})
