import { promisify } from 'util'

import { describe, expect, test, afterAll, beforeAll } from '@jest/globals'
import { QuickMongo, QuickMongoClient } from '../src'

const sleep = promisify(setTimeout)

const quickMongoClient = new QuickMongoClient('mongodb://127.0.0.1:27018')
quickMongoClient.connected = true

beforeAll(async () => {
    await quickMongoClient.connect()
})

describe('addition operation', () => {
    const database = new QuickMongo<string, any>(quickMongoClient, {
        name: 'test_database',
        collectionName: 'test_database_collection'
    })

    // setting initial values

    test.concurrent('set number', async () => {
        await database.loadCache()
        await sleep(3000)

        const setResult = await database.set('number', 1)
        return expect(setResult).toEqual(1)
    })

    test.concurrent('set number in object', async () => {
        await database.loadCache()
        await sleep(3000)

        const setResult = await database.set('numbers.number', 5)
        return expect(setResult).toEqual(5)
    })


    // QuickMongo.add()

    test.concurrent('add +5', async () => {
        await database.loadCache()
        await sleep(3000)

        const addResult = await database.add('number', 5)
        return expect(addResult).toEqual(6)
    })

    test.concurrent('add +5 to number in object', async () => {
        await database.loadCache()
        await sleep(3000)

        const addResult = await database.add('numbers.number', 5)
        return expect(addResult).toBeDefined()
    })

    test.concurrent('add +5 to unexistent number', async () => {
        await database.loadCache()
        await sleep(3000)

        const addResult = await database.add('unexistentNumber', 15)
        return expect(addResult).toEqual(15)
    })


    // getting addition results

    test.concurrent('get addition results', async () => {
        await database.loadCache()
        await sleep(3000)

        const additionResults = [
            database.get('number'),
            database.get('numbers.number'),
            database.get('unexistentNumber')
        ]

        return expect(additionResults).toEqual([6, 10, 15])
    })
})

describe('subtraction operation', () => {
    const database = new QuickMongo<string, any>(quickMongoClient, {
        name: 'test_database_2',
        collectionName: 'test_database_collection_2'
    })

    // setting initial values

    test.concurrent('set number', async () => {
        await database.loadCache()
        await sleep(3000)

        const setResult = await database.set('number', 1)
        return expect(setResult).toEqual(1)
    })

    test.concurrent('set number in object', async () => {
        await database.loadCache()
        await sleep(3000)

        const setResult = await database.set('numbers.number', 5)
        return expect(setResult).toEqual(5)
    })


    // QuickMongo.subtract()

    test.concurrent('subtract -5', async () => {
        await database.loadCache()
        await sleep(3000)

        const subtractionResult = await database.subtract('number', 5)
        return expect(subtractionResult).toEqual(-4)
    })

    test.concurrent('subtract -5 from number in object', async () => {
        await database.loadCache()
        await sleep(3000)

        const subtractionResult = await database.subtract('numbers.number', 5)
        return expect(subtractionResult).toBeDefined()
    })

    test.concurrent('subtract -5 from unexistent number', async () => {
        await database.loadCache()
        await sleep(3000)

        const subtractResult = await database.subtract('unexistentNumber', 15)
        return expect(subtractResult).toEqual(-15)
    })


    // getting subtraction results

    test.concurrent('get subtraction results', async () => {
        await database.loadCache()
        await sleep(3000)

        const subtractionResults = [
            database.get('number'),
            database.get('numbers.number'),
            database.get('unexistentNumber')
        ]

        return expect(subtractionResults).toEqual([-4, 0, -15])
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

    return
})
