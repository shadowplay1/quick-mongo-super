import { describe, expect, test, afterAll } from '@jest/globals'
import { QuickMongo, QuickMongoClient } from '../src'

const connectionURI = 'mongodb://127.0.0.1:27018'
const quickMongoClient = new QuickMongoClient(connectionURI)

describe('initialize the connection and database', () => {
    test.concurrent('connect to MongoDB', async () => {
        const connected = await quickMongoClient.connect()
        expect(connected).toBeTruthy()
    })

    test.concurrent('initialize & ping the database', async () => {
        await quickMongoClient.connect()

        const database = new QuickMongo<string, any>(quickMongoClient, {
            name: 'test_database',
            collectionName: 'test_database_collection'
        })

        const ping = await database.ping()
        expect(ping).toBeTruthy()
    })
})

// post-testing cleanup
afterAll(async () => {
    await Promise.all(quickMongoClient.databases.map(database => database.deleteAll()))
    await quickMongoClient.disconnect()
})
