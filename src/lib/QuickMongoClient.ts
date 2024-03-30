import { connect, disconnect } from 'mongoose'
import { MongoClientOptions } from 'mongodb'

import { IQuickMongoEvents } from '../types/Database'
import { Emitter } from './utils/Emitter'

import { QuickMongo } from './QuickMongo'
import { QuickMongoError } from './utils/QuickMongoError'

/**
 * Quick Mongo Client class.
 *
 * Type parameters:
 *
 * - `TInitialDatabaseData` (object) - The type of the object to be set in new empty databases.
 *
 * @template TInitialDatabaseData (object) - The type of the object to be set in new empty databases.
 *
 * @example
 * const { QuickMongoClient, QuickMongo } = require('quick-mongo-super')
 *
 * // Create a normal Quick Mongo client.
 * const quickMongoClient = new QuickMongoClient(connectionURI)
 *
 * // You can also specify the initial data that will be put
 * // on successful connection in every database if it's empty.
 * const quickMongoClient = new QuickMongoClient(connectionURI, {})
 *
 * // Initialize the database.
 * const mongo = new QuickMongo(quickMongoClient, {
 *      name: 'databaseName',
 *      collectionName: 'collectionName' // optional
 * })
 *
 * @extends {Emitter<IQuickMongoEvents>}
 */
export class QuickMongoClient<
    TInitialDatabaseData extends Record<string, any> = any
> extends Emitter<IQuickMongoEvents<TInitialDatabaseData>> {

    /**
     * The MongoDB cluster connection URI to connect to.
     * @type {string}
     * @private
     */
    private _connectionURI: string

    /**
     * Determines if the MongoDB cluster connection is established.
     * @type {boolean}
     */
    public connected = false

    /**
     * Array of initialized QuickMongo database instances.
     * @type {QuickMongo<any, any>[]}
     */
    public databases: QuickMongo<any, any>[]

    /**
     * An object to put in database on successful connection if the database is empty.
     * @type {TInitialDatabaseData}
     */
    public initialDatabaseData: TInitialDatabaseData

    /**
     * MongoDB client connection options.
     * @type {MongoClientOptions}
     */
    public mongoClientOptions?: MongoClientOptions

    readonly [Symbol.toStringTag] = 'QuickMongoClient'

    /**
     * Creates a new instance of Quick Mongo Client.
     *
     * Type parameters:
     *
     * - `TInitialDatabaseData` (object) - The type of the object to be set in new empty databases.
     *
     * @param {string} connectionURI The MongoDB cluster connection URI to connect to.
     * @param {TInitialDatabaseData} initialDatabaseData
     * The database object to set in database if the database is empty on initialation.
     *
     * @param {MongoClientOptions} mongoClientOptions MongoDB client connection options.
     *
     * @template TInitialDatabaseData (object) - The type of the object to be set in new empty databases.
     *
     * @example
     * const { QuickMongoClient, QuickMongo } = require('quick-mongo-super')
     *
     * // Create a normal Quick Mongo client.
     * const quickMongoClient = new QuickMongoClient(connectionURI)
     *
     * // You can also specify the initial data that will be put
     * // on successful connection in every database if it's empty.
     * const quickMongoClient = new QuickMongoClient(connectionURI, {
     *     somethingToSetInDatabase: 'something'
     * })
     *
     * // Initialize the database.
     * const mongo = new QuickMongo(quickMongoClient, {
     *     name: 'databaseName',
     *     collectionName: 'collectionName' // optional
     * })
     */
    public constructor(
        connectionURI: string,
        initialDatabaseData?: TInitialDatabaseData,
        mongoClientOptions?: MongoClientOptions
    ) {
        super()

        if (!connectionURI) {
            throw new QuickMongoError('CONNECTION_URI_NOT_SPECIFIED')
        }

        if (
            typeof connectionURI !== 'string' ||
            (!connectionURI.startsWith('mongodb://') &&
                !connectionURI.startsWith('mongodb+srv://'))
        ) {
            throw new QuickMongoError('INVALID_CONNECTION_URI')
        }

        this.databases = []

        this._connectionURI = connectionURI
        this.mongoClientOptions = mongoClientOptions

        this.initialDatabaseData = initialDatabaseData
    }

    /**
     * Opens a connection to a MongoDB cluster.
     * @returns {Promise<QuickMongoClient<TInitialDatabaseData>>} Connected QuickMongoClient instance.
     */
    public async connect(): Promise<QuickMongoClient<TInitialDatabaseData>> {
        try {
            await connect(this._connectionURI, {
                ...this.mongoClientOptions
            })

            this.connected = true
            this.emit('connect', this)

            return this
        } catch (err) {
            throw new QuickMongoError('CONNECTION_NOT_ESTABLISHED')
        }
    }

    /**
     * Closes the connection to a MongoDB cluster.
     *
     * This will also disconnect all the instances of `QuickMongo` database class from the MongoDB cluster.
     * @returns {Promise<void>}
     */
    public async disconnect(): Promise<void> {
        await disconnect()

        this.connected = false
        this.emit('disconnect')
    }
}
