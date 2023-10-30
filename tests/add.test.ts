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

describe('addition operation', () => {
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


    // QuickMongo.add()

    test.concurrent('add +5', async () => {
        await database.loadCache()
        await sleep(1000)

        const addResult = await database.add('number', 5)
        return expect(addResult).toEqual(6)
    })

    test.concurrent('add +5 to number in object', async () => {
        await database.loadCache()
        await sleep(1000)

        const addResult = await database.add('numbers.number', 5)
        return expect(addResult).toBeDefined()
    })

    test.concurrent('add +5 to unexistent number', async () => {
        await database.loadCache()
        await sleep(1000)

        const addResult = await database.add('unexistentNumber', 15)
        return expect(addResult).toEqual(15)
    })


    // getting addition results

    test.concurrent('get addition results', async () => {
        await database.loadCache()
        await sleep(1000)

        const additionResults = [
            database.get<number>('number'),
            database.get<number>('numbers.number'),
            database.get<number>('unexistentNumber')
        ]

        return expect(additionResults).toEqual([6, 10, 15])
    })
})


// post-testing cleanup
afterAll(async () => {
    await Promise.all(quickMongoClient.databases.map(database => database.deleteAll()))
    await quickMongoClient.disconnect()

    return
})
