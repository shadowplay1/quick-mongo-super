import { connect, disconnect } from 'mongoose'

import { IQuickMongoEvents } from '../types/QuickMongo'
import { Emitter } from './utils/Emitter'

/**
 * Quick Mongo Client class.
 * @extends {Emitter<IQuickMongoEvents>}
 */
export class QuickMongoClient<TInitialDatabaseData extends Record<string, any> = any> extends Emitter<IQuickMongoEvents> {

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
     * An object to put in database on successful connection if the database is empty.
     * @type {TInitialDatabaseData}
     */
    public initialDatabaseData: TInitialDatabaseData

    readonly [Symbol.toStringTag] = 'QuickMongoClient'

    /**
     * Quick Mongo Client constructor.
     * @param {string} connectionURI The MongoDB cluster connection URI to connect to.
     *
     * @param {TInitialDatabaseData} initialDatabaseData
     * The database object to set in database if the database is empty on initialation.
     */
    public constructor(connectionURI: string, initialDatabaseData?: TInitialDatabaseData) {
        super()

        this.initialDatabaseData = initialDatabaseData
        this._connectionURI = connectionURI
    }

    /**
     * Opens a connection to a MongoDB cluster.
     * @returns {Promise<void>}
     */
    public async connect(): Promise<void> {
        await connect(this._connectionURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        this.connected = true
        this.emit('connect')
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
