import { describe, expect, test, afterAll, beforeAll } from '@jest/globals'
import { QuickMongo, QuickMongoClient } from '../src'

const initialDatabaseObject = {
    test: 123,
    hello: 'world'
}

const databaseName = 'test_database_0'
const collectionName = 'test_database_collection_0'

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
    test.concurrent('QuickMongo: database name', async () => {
        return expect(database.name).toEqual(databaseName)
    })

    test.concurrent('QuickMongo: collection name', async () => {
        return expect(database.collectionName).toEqual(collectionName)
    })

    test.concurrent('QuickMongo: empty database size', async () => {
        return expect(database.size).toEqual(0)
    })

    test.concurrent('QuickMongo: database size with 2 keys', async () => {
        await database.deleteAll()

        await database.set('test1', 1)
        await database.set('test2', 2)

        return expect(database.size).toEqual(2)
    })

    test.concurrent('QuickMongoClient: initial database data', async () => {
        return expect(quickMongoClient.initialDatabaseData).toEqual(initialDatabaseObject)
    })
})


// post-testing cleanup

afterAll(async () => {
    await database.deleteAll()
    await quickMongoClient.disconnect()
})
