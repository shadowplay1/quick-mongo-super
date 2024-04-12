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

    await database.set('number', 1)
    await database.set('numbers.number', 2)

    await database.set('number_2', 6)
    await database.set('numbers.number_2', 7)
})

describe('addition operation', () => {
    // QuickMongo.add()

    test.concurrent('add +5', async () => {
        // setting initial values
        await database.set('number', 1)
        await database.set('numbers.number', 2)

        await database.add('number', 5) // adding 5 to initial value, 1

        const additionResult = database.get('number')
        return expect(additionResult).toEqual(6)
    })

    test.concurrent('add +5 to number in object', async () => {
        await database.set('numbers.number', 2) // setting initial value
        await database.add('numbers.number', 5) // adding 5 to initial value, 2

        const additionResult = database.get('numbers.number')
        return expect(additionResult).toEqual(7)
    })

    test.concurrent('add +5 to unexistent number', async () => {
        await database.add('unexistentNumber', 5) // adding 5 to initial value, 0

        const additionResult = database.get('unexistentNumber')
        return expect(additionResult).toEqual(5)
    })
})

describe('subtraction operation', () => {
    // QuickMongo.subtract()

    test.concurrent('subtract -5', async () => {
        // setting initial values
        await database.set('number_2', 6)
        await database.set('numbers.number_2', 7)

        await database.subtract('number_2', 5) // subtracting 5 from initial value, 6

        const subtractionResult = database.get('number_2')
        return expect(subtractionResult).toEqual(1)
    })

    test.concurrent('subtract -5 from number in object', async () => {
        await database.set('numbers.number_2', 7)
        await database.subtract('numbers.number_2', 5) // subtracting 5 from initial value, 7

        const subtractionResult = database.get('numbers.number_2')
        return expect(subtractionResult).toEqual(2)
    })

    test.concurrent('subtract -5 from unexistent number', async () => {
        await database.subtract('unexistentNumber123', 5) // subtracting 5 from initial value, 0

        const subtractionResult = database.get('unexistentNumber123')
        return expect(subtractionResult).toEqual(-5)
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
    await database.deleteAll()
    await quickMongoClient.disconnect()
})
