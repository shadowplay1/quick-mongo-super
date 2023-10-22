import { connect, disconnect } from 'mongoose'

import { IQuickMongoEvents } from '../types/QuickMongo'
import { Emitter } from './utils/Emitter'

export class QuickMongoClient<TInitialDatabaseData extends Record<string, any> = any> extends Emitter<IQuickMongoEvents> {
    private _connectionURI: string

    public connected = false
    public initialDatabaseData: TInitialDatabaseData

    readonly [Symbol.toStringTag] = 'QuickMongoClient'

    /**
     * Quick Mongo Client constructor.
     * @param connectionURI The MongoDB cluster connection URI to connect to.
     * @param initialDatabaseData The database object to set in database if the database is empty on initialation.
     */
    public constructor(connectionURI: string, initialDatabaseData?: TInitialDatabaseData) {
        super()

        this.initialDatabaseData = initialDatabaseData
        this._connectionURI = connectionURI
    }

    public async connect(): Promise<void> {
        await connect(this._connectionURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        this.connected = true
        this.emit('connect')
    }

    public async disconnect(): Promise<void> {
        await disconnect()

        this.connected = false
        this.emit('disconnect')
    }
}
