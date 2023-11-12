import { connect, disconnect } from 'mongoose'

import { IQuickMongoEvents } from '../types/Database'
import { Emitter } from './utils/Emitter'
import { QuickMongo } from './QuickMongo'

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
     * Array of initialized databases.
     * @type {QuickMongo<any, any>[]}
     */
    public databases: QuickMongo<any, any>[]

    /**
     * An object to put in database on successful connection if the database is empty.
     * @type {TInitialDatabaseData}
     */
    public initialDatabaseData: TInitialDatabaseData

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
    public constructor(connectionURI: string, initialDatabaseData?: TInitialDatabaseData) {
        super()

        this.databases = []

        this.initialDatabaseData = initialDatabaseData
        this._connectionURI = connectionURI
    }

    /**
     * Opens a connection to a MongoDB cluster.
     * @returns {Promise<QuickMongoClient<TInitialDatabaseData>>} QuickMongo client instance.
     */
    public async connect(): Promise<QuickMongoClient<TInitialDatabaseData>> {
        await connect(this._connectionURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        this.connected = true
        this.emit('connect', this)

        return this
    }

    /**
     * Closes the connection to a MongoDB cluster.
     * @returns {Promise<void>}
     */
    public async disconnect(): Promise<void> {
        await disconnect()

        this.connected = false
        this.emit('disconnect')
    }
}
