import { promisify } from 'util'

import { describe, expect, test, afterAll, beforeAll } from '@jest/globals'
import { QuickMongo, QuickMongoClient } from '../src'

const sleep = promisify(setTimeout)

// eslint-disable-next-line
const quickMongoClient = new QuickMongoClient('mongodb://127.0.0.1:27018')
quickMongoClient.connected = true

beforeAll(async () => {
    await quickMongoClient.connect()
    await Promise.all(quickMongoClient.databases.map(database => database.deleteAll()))
})


describe('array operations', () => {
    const database = new QuickMongo<string, any>(quickMongoClient, {
        name: 'test_database_5',
        collectionName: 'test_database_collection_5'
    })


    // QuickMongo.push()

    test.concurrent('push data (add element in target array)', async () => {
        await database.loadCache()
        await sleep(2000)

        const pushResults = [
            await database.push<string>('testArray', 'test'),
            await database.push<string>('testArray', 'test1'),
            await database.push<string>('testArray', 'test2'),
        ]

        await sleep(2000)
        return expect(pushResults).toBeTruthy()
    })

    test.concurrent('get array after "push" operation', async () => {
        await database.loadCache()
        await sleep(2000)

        const pushedDataResult = database.get('testArray')

        await sleep(2000)
        return expect(pushedDataResult?.length).toBeTruthy()
    })


    // QuickMongo.isTargetArray()

    test.concurrent('isArray checks', async () => {
        await database.loadCache()
        await sleep(2000)

        await database.set('notArray', 123)

        const isArrayResults = [
            database.isTargetArray('testArray'),
            database.isTargetArray('notArray'),
            database.isTargetArray('somethingElse')
        ]

        await sleep(2000)
        return expect(isArrayResults).toEqual([true, false, false])
    })


    // QuickMongo.random()

    test.concurrent('get random array element', async () => {
        await database.loadCache()
        await sleep(2000)

        const randomResult = database.random('testArray')

        await sleep(2000)
        return expect(randomResult).toBeTruthy()
    })


    // QuickMongo.pull()

    test.concurrent('pull data (replace specified element in target array)', async () => {
        await database.loadCache()
        await sleep(2000)

        const pullResult = await database.pull<string>('testArray', 1, 'test111')

        await sleep(2000)
        return expect(pullResult).toEqual(['test', 'test111', 'test2'])
    })

    test.concurrent('get array after "pull" operation', async () => {
        await database.loadCache()
        await sleep(2000)

        const randomResult = database.get('testArray')

        await sleep(2000)
        return expect(randomResult).toEqual(['test', 'test111', 'test2'])
    })


    // QuickMongo.pop()

    test.concurrent('pop data (remove specified element from target array)', async () => {
        await database.loadCache()
        await sleep(2000)

        const pullResult = await database.pull<string>('testArray', 1, 'test111')

        await sleep(2000)
        return expect(pullResult).toEqual(['test', 'test111', 'test2'])
    })

    test.concurrent('get array after "pop" operation', async () => {
        await database.loadCache()
        await sleep(2000)

        const randomResult = database.get('testArray')

        await sleep(2000)
        return expect(randomResult).toEqual(['test', 'test111', 'test2'])
    })
})


// post-testing cleanup
afterAll(async () => {
    await Promise.all(quickMongoClient.databases.map(database => database.deleteAll()))
    await quickMongoClient.disconnect()

    return
})
