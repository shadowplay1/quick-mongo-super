import { Model, model, models } from 'mongoose'

import { IDatabaseConfiguration, IDatabaseInternalStructure } from '../types/QuickMongo'
import { QuickMongoClient } from './QuickMongoClient'

import { internalDatabaseSchema } from '../schemas/internal.schema'
import { CacheManager } from './managers/CacheManager'
import { isObject } from './utils/functions/isObject.function'

/**
 * QuickMongo class.
 * @extends {Emitter}
 */
export class QuickMongo<K extends string = string, V = any> {
    private _cache: CacheManager<any, IDatabaseInternalStructure<any>> = new CacheManager()

    private _client: QuickMongoClient
    private _model: Model<IDatabaseInternalStructure>

    public name: string
    public collectionName: string

    public constructor(client: QuickMongoClient, options: IDatabaseConfiguration) {
        this._client = client

        this._model = models[options.name] || model<IDatabaseInternalStructure>(
            options.name, internalDatabaseSchema, options.collectionName
        )

        this.name = options.name
        this.collectionName = options.collectionName

        this._loadCache()
    }

    public get<TValue = V>(key: K): TValue {
        return this._cache.get<TValue>(key)
    }

    public fetch<TValue = V>(key: K): TValue {
        return this._cache.get<TValue>(key)
    }

    public async set<TValue = V>(key: K, value: TValue): Promise<any> {
        this._cache.set<TValue>(key, value)
        const fetched = this.all()

        const keys = key.split('.')
        let database = fetched as any

        for (let i = 0; i < keys.length; i++) {
            if (keys.length - 1 == i) {
                database[keys[i]] = value

            } else if (!isObject(database[keys[i]])) {
                database[keys[i]] = {}
            }

            database = database?.[keys[i]]
        }

        const data = await this._model.findOne({
            __KEY: keys[0]
        })

        if (!data) {
            this._model.insertMany({
                __KEY: keys[0],
                __VALUE: fetched[keys[0]]
            })
        } else {
            await this._model.updateOne({
                __KEY: keys[0]
            }, {
                $set: {
                    __VALUE: fetched[keys[0]]
                }
            })
        }
    }

    public async delete(key: K): Promise<any> {
        this._cache.delete(key)
        const fetched = this.all()

        const keys = key.split('.')
        let database = fetched as any

        for (let i = 0; i < keys.length; i++) {
            if (keys.length - 1 == i) {
                delete database[keys[i]]

            } else if (!isObject(database[keys[i]])) {
                database[keys[i]] = {}
            }

            database = database?.[keys[i]]
        }

        if (keys.length == 1) {
            await this._model.deleteOne({
                __KEY: key
            })
        } else {
            await this._model.updateOne({
                __KEY: keys[0]
            }, {
                $set: {
                    __VALUE: fetched[keys[0]]
                }
            })
        }
    }

    /**
     * Loads the database into cache.
     * @returns {Promise<void>}
     */
    private async _loadCache(): Promise<void> {
        const database = await this._allFromDatabase<Record<K, any>>()

        for (const key in database) {
            const guildDatabase = database[key]
            this._cache.set(key, guildDatabase)
        }
    }

    /**
     * Fetches the database contents from database.
     * @returns {any} Database contents.
     */
    private async _allFromDatabase<TValue extends Record<string, any> = V>(): Promise<TValue> {
        if (!this._client.connected) {
            // throw new DatabaseError_1.DatabaseError(errors_1.default.connection.noConnection)
        }

        const obj = {}
        const elements = await this.raw() || {}

        for (const element of Object.values<IDatabaseInternalStructure>(elements)) {
            obj[element.__KEY] = element.__VALUE
        }

        return obj as any
    }

    /**
     * Gets the database contents from cache.
     * @returns {any} Database contents.
     */
    public all<TValue extends Record<string, any> = V>(): TValue {
        return this._cache.getCacheObject<TValue>()
    }

    /**
     * Fetches the raw databas contents.
     * @returns {Promise<IDatabaseInternalStructure<any>>} Raw database contents.
     */
    public async raw(): Promise<IDatabaseInternalStructure<any>> {
        if (!this._client.connected) {
            // throw new DatabaseError_1.DatabaseError(errors_1.default.connection.noConnection)
        }

        const data = await this._model.find()
        return data as any
    }
}
