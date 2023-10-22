import { connect, disconnect } from 'mongoose'

import { IQuickMongoEvents } from '../types/QuickMongo'
import { Emitter } from './utils/Emitter'

export class QuickMongoClient extends Emitter<IQuickMongoEvents> {
    private _connectionURI: string
    public connected = false

    public constructor(connectionURI: string) {
        super()
        this._connectionURI = connectionURI
    }

    public async connect(): Promise<void> {
        await connect(this._connectionURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        this.emit('connect')
    }

    public async disconnect(): Promise<void> {
        await disconnect()
        this.emit('disconnect')
    }
}
