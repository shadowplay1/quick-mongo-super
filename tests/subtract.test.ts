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

describe('subtraction operation', () => {
    const database = new QuickMongo<string, any>(quickMongoClient, {
        name: 'test_database',
        collectionName: 'test_database_collection'
    })

    // setting initial values

    test.concurrent('set number', async () => {
        await database.loadCache()
        await sleep(1000)

        const setResult = await database.set<number>('number', 1)
        return expect(setResult).toEqual(1)
    })

    test.concurrent('set number in object', async () => {
        await quickMongoClient.connect()

        const setResult = await database.set('numbers.number', 5)
        return expect(setResult).toEqual(5)
    })


    // QuickMongo.subtract()

    test.concurrent('subtract -5', async () => {
        await database.loadCache()
        await sleep(1000)

        const subtractionResult = await database.subtract('number', 5)
        return expect(subtractionResult).toEqual(-4)
    })

    test.concurrent('subtract -5 to number in object', async () => {
        await database.loadCache()
        await sleep(1000)

        const subtractionResult = await database.subtract('numbers.number', 5)
        return expect(subtractionResult).toBeDefined()
    })

    test.concurrent('subtract -5 to unexistent number', async () => {
        await database.loadCache()
        await sleep(1000)

        const subtractResult = await database.subtract('unexistentNumber', 15)
        return expect(subtractResult).toEqual(-15)
    })


    // getting subtraction results

    test.concurrent('get subtraction results', async () => {
        await database.loadCache()
        await sleep(1000)

        const subtractionResults = [
            database.get<number>('number'),
            database.get<number>('numbers.number'),
            database.get<number>('unexistentNumber')
        ]

        return expect(subtractionResults).toEqual([-4, 0, -15])
    })
})


// post-testing cleanup
afterAll(async () => {
    await Promise.all(quickMongoClient.databases.map(database => database.deleteAll()))
    await quickMongoClient.disconnect()

    return
})
