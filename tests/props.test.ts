import { promisify } from 'util'

import { describe, expect, test, afterAll, beforeAll } from '@jest/globals'
import { QuickMongo, QuickMongoClient } from '../src'

const sleep = promisify(setTimeout)

const initialDatabaseObject = {
    test: 123,
    hello: 'world'
}

const databaseName = 'test_database'
const collectionName = 'test_database_collection'

let quickMongoClient = new QuickMongoClient('mongodb://127.0.0.1:27018', initialDatabaseObject)
let database: QuickMongo<string, any>

beforeAll(async () => {
    const client = await quickMongoClient.connect()
    quickMongoClient = client

    database = new QuickMongo<string, any>(quickMongoClient, {
        name: databaseName,
        collectionName: collectionName
    })

    await database.deleteAll()
})

describe('check for properties of QuickMongoClient and QuickMongo database instances to be correct', () => {
    // QuickMongo.set()

    test.concurrent('QuickMongo: database name', async () => {
        await sleep(1000)
        return expect(database.name).toEqual(databaseName)
    })

    test.concurrent('QuickMongo: collection name', async () => {
        await sleep(1000)
        return expect(database.collectionName).toEqual(collectionName)
    })

    test.concurrent('QuickMongoClient: initial database data', async () => {
        await sleep(1000)
        return expect(quickMongoClient.initialDatabaseData).toEqual(initialDatabaseObject)
    })
})


// post-testing cleanup
afterAll(async () => {
    await Promise.all(quickMongoClient.databases.map(database => database.deleteAll()))
    await quickMongoClient.disconnect()
})
