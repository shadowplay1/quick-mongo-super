import { Model, model, models } from 'mongoose'

import { IDatabaseConfiguration, IDatabaseInternalStructure, IMongoLatency } from '../types/QuickMongo'
import { QuickMongoClient } from './QuickMongoClient'

import { internalDatabaseSchema } from '../schemas/internal.schema'
import { CacheManager } from './managers/CacheManager'

import { isObject } from './utils/functions/isObject.function'
import { QuickMongoError } from './utils/QuickMongoError'

import { If, IsObject, Maybe } from '../types/utils'
import { typeOf } from './utils/functions/typeOf.function'

/**
 * QuickMongo class.
 * @extends {Emitter}
 */
export class QuickMongo<K extends string = string, V = any> {
    private _cache: CacheManager<any, IDatabaseInternalStructure<any>>

    /**
     * Quick Mongo client to work with.
     * @type {QuickMongoClient<any>}
     * @private
     */
    private _client: QuickMongoClient<any>
    private _model: Model<IDatabaseInternalStructure>

    public name: string
    public collectionName: string

    readonly [Symbol.toStringTag] = 'QuickMongoDatabase'

    /**
     * Quick Mongo database constructor.
     * @param client Quick Mongo client to work with.
     * @param options Database configuration object.
     */
    public constructor(client: QuickMongoClient<any>, options: IDatabaseConfiguration) {
        this._cache = new CacheManager(client)
        this._client = client

        this._model = models[options.name] || model<IDatabaseInternalStructure>(
            options.name, internalDatabaseSchema, options.collectionName
        )

        this.name = options.name
        this.collectionName = options.collectionName

        this._loadCache()
    }

    /**
     * Sends a read, write and delete requests to the database.
     * and returns the request latencies.
     * @returns {Promise<IMongoLatency>} Database latency object.
     */
    public async ping(): Promise<IMongoLatency> {
        const pingDatabaseKey = '___PING___' as K

        let readLatency = -1
        let writeLatency = -1
        let deleteLatency = -1

        if (!this._client.connected) {
            throw new QuickMongoError('NOT_CONNECTED')
        }

        const writeStartDate = Date.now()

        await this.set(pingDatabaseKey, 1)
        writeLatency = Date.now() - writeStartDate

        const readStartDate = Date.now()

        await this._allFromDatabase()
        readLatency = Date.now() - readStartDate

        const deleteStartDate = Date.now()

        await this.delete(pingDatabaseKey)
        deleteLatency = Date.now() - deleteStartDate

        return {
            readLatency,
            writeLatency,
            deleteLatency
        }
    }

    public get<TValue = V>(key: K): Maybe<TValue> {
        return this._cache.get<TValue>(key)
    }

    public fetch<TValue = V>(key: K): Maybe<TValue> {
        return this.get<TValue>(key)
    }

    public has(key: K): boolean {
        return !!this.get(key)
    }

    public async set<
        TValue = V,
        TReturnValue = any
    >(key: K, value: TValue): Promise<If<IsObject<TValue>, TReturnValue, TValue>> {
        if (!this._client.connected) {
            throw new QuickMongoError('NOT_CONNECTED')
        }

        const fetched = this.all()
        this._cache.set(key, value)

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
                __VALUE: fetched[keys[0]]
            })
        }

        return typeof value == 'object' && value !== null ? this._cache.get(keys[0]) : value as any
    }

    public async delete<TReturnValue = any>(key: K): Promise<Maybe<TReturnValue>> {
        if (!this._client.connected) {
            throw new QuickMongoError('NOT_CONNECTED')
        }

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
                __VALUE: fetched[keys[0]]
            })
        }

        return this._cache.get(keys[0])
    }

    public async add(key: K, numberToAdd: number): Promise<number> {
        const targetNumber = this.get<number>(key) ?? 0

        if (isNaN(targetNumber)) {
            throw new QuickMongoError('INVALID_TARGET', 'number', typeOf(targetNumber))
        }

        if (numberToAdd == undefined) {
            throw new QuickMongoError('REQUIRED_PARAMETER_MISSING', 'numberToAdd')
        }

        if (isNaN(numberToAdd)) {
            throw new QuickMongoError('INVALID_TYPE', 'numberToAdd', 'number', typeOf(numberToAdd))
        }

        const result = await this.set(key, targetNumber + numberToAdd)
        return result
    }

    public async subtract(key: K, numberToSubtract: number): Promise<number> {
        const targetNumber = this.get<number>(key) ?? 0

        if (isNaN(targetNumber)) {
            throw new QuickMongoError('INVALID_TARGET', 'number', typeOf(targetNumber))
        }

        if (numberToSubtract == undefined) {
            throw new QuickMongoError('REQUIRED_PARAMETER_MISSING', 'numberToSubtract')
        }

        if (isNaN(numberToSubtract)) {
            throw new QuickMongoError('INVALID_TYPE', 'numberToSubtract', 'number', typeOf(numberToSubtract))
        }

        const result = await this.set(key, targetNumber - numberToSubtract)
        return result
    }

    public async push<TValue = V>(key: K, value: TValue): Promise<TValue[]> {
        const targetArray = this.get<TValue[]>(key) || []

        if (!Array.isArray(targetArray)) {
            throw new QuickMongoError('INVALID_TARGET', 'number', typeOf(targetArray))
        }

        if (value == undefined) {
            throw new QuickMongoError('REQUIRED_PARAMETER_MISSING', 'value')
        }

        targetArray.push(value)

        await this.set<TValue[]>(key, targetArray)
        return targetArray
    }

    public async pull<TValue = V>(key: K, index: number, value: TValue): Promise<TValue[]> {
        const targetArray = this.get<TValue[]>(key) ?? []

        if (!Array.isArray(targetArray)) {
            throw new QuickMongoError('INVALID_TARGET', 'number', typeOf(targetArray))
        }

        if (index == undefined) {
            throw new QuickMongoError('REQUIRED_PARAMETER_MISSING', 'index')
        }

        if (isNaN(index)) {
            throw new QuickMongoError('INVALID_TYPE', 'index', 'number', typeOf(index))
        }

        if (value == undefined) {
            throw new QuickMongoError('REQUIRED_PARAMETER_MISSING', 'value')
        }

        if (index < 0) {
            targetArray[targetArray.length - index] = value
        } else {
            targetArray[index] = value
        }

        await this.set<TValue[]>(key, targetArray)
        return targetArray
    }

    public async pop<TValue = V>(key: K, index: number): Promise<TValue[]> {
        const targetArray = this.get<TValue[]>(key) ?? []

        if (!Array.isArray(targetArray)) {
            throw new QuickMongoError('INVALID_TARGET', 'number', typeOf(targetArray))
        }

        if (index == undefined) {
            throw new QuickMongoError('REQUIRED_PARAMETER_MISSING', 'index')
        }

        if (isNaN(index)) {
            throw new QuickMongoError('INVALID_TYPE', 'index', 'number', typeOf(index))
        }

        targetArray.splice(index, 1)

        await this.set<TValue[]>(key, targetArray)
        return targetArray
    }

    public keys(key?: K): string[] {
        if (!key) {
            return Object.keys(this.all())
        }

        const data = this.get(key)

        return Object.keys(data || {})
            .filter(key => data[key] !== undefined && data[key] !== null)
    }

    /**
     * Gets the random element of array in database.
     *
     * [!!!] The target must be an array.
     *
     * Type parameters:
     *
     * - T: The type of random element in the array.
     *
     * @param {K} key The key in database.
     * @returns {T} The random element in the array.
     */
    public random<T>(key: K): T {
        const array = this.get(key)

        if (!Array.isArray(array)) {
            throw new QuickMongoError('INVALID_TARGET', 'array', typeOf(array))
        }

        return array[Math.floor(Math.random() * array.length)]
    }

    public async clear(): Promise<void> {
        await this._model.deleteMany()
    }

    public async deleteAll(): Promise<void> {
        return this.clear()
    }

    /**
     * Loads the database into cache.
     * @returns {Promise<void>}
     */
    private async _loadCache(): Promise<void> {
        const database = await this._allFromDatabase<Record<K, any>>()
        const initialDatabaseData = this._client.initialDatabaseData

        if (this._client.initialDatabaseData && !Object.keys(database).length) {
            for (const key of Object.keys(initialDatabaseData)) {
                this.set(key as K, initialDatabaseData[key])
                this._cache.set(key as K, initialDatabaseData[key])
            }
        }

        for (const key in database) {
            const dataObject = database[key]
            this._cache.set(key, dataObject)
        }
    }

    /**
     * Fetches the database contents from database.
     * @returns {any} Database contents.
     */
    private async _allFromDatabase<TValue extends Record<string, any> = V>(): Promise<TValue> {
        const obj = {}
        const elements = await this.raw() || []

        for (const element of elements) {
            obj[element.__KEY] = element.__VALUE
        }

        return obj as any
    }

    /**
     * Gets the database contents from cache.
     * @returns {any} Database contents.
     */
    public all<TValue extends Record<string, any>>(): TValue {
        return this._cache.getCacheObject<TValue>()
    }

    /**
     * Fetches the raw database contents.
     * @returns {Promise<IDatabaseInternalStructure<TInternalDataValue>[]>} Raw database contents.
     */
    public async raw<TInternalDataValue>(): Promise<IDatabaseInternalStructure<TInternalDataValue>[]> {
        const data = await this._model.find()
        return data as any
    }
}
