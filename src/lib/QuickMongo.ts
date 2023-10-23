import { Model, model, models } from 'mongoose'

import { IDatabaseConfiguration, IDatabaseInternalStructure, IDatabaseRequestsLatencies } from '../types/QuickMongo'
import { QuickMongoClient } from './QuickMongoClient'

import { internalDatabaseSchema } from '../schemas/internal.schema'
import { CacheManager } from './managers/CacheManager'

import { isObject } from './utils/functions/isObject.function'
import { QuickMongoError } from './utils/QuickMongoError'

import { If, IsObject, Maybe } from '../types/utils'
import { typeOf } from './utils/functions/typeOf.function'

/**
 * Quick Mongo database class.
 */
export class QuickMongo<K extends string = string, V = any> {

    /**
     * Cache Manager.
     * @type {CacheManager<any, IDatabaseInternalStructure<any>>}
     * @private
     */
    private _cache: CacheManager<any, IDatabaseInternalStructure<any>>

    /**
     * Quick Mongo client to work with.
     * @type {QuickMongoClient<any>}
     * @private
     */
    private _client: QuickMongoClient<any>

    /**
     * Internal Mongoose model to work with.
     * @type {Model<IDatabaseInternalStructure<any>>}
     * @private
     */
    private _model: Model<IDatabaseInternalStructure<any>>

    /**
     * Database name.
     * @type {string}
     */
    public name: string

    /**
     * Collection name.
     * @type {string}
     */
    public collectionName: string

    readonly [Symbol.toStringTag] = 'QuickMongoDatabase'

    /**
     * Quick Mongo database constructor.
     * @param {QuickMongoClient<any>} client Quick Mongo client to work with.
     * @param {IDatabaseConfiguration} options Database configuration object.
     * @example
     * const { QuickMongoClient, QuickMongo } = require('quick-mongo-super')
     *
     * // Create a normal Quick Mongo client.
     * const quickMongoClient = new QuickMongoClient(connectionURI)
     *
     * // You can also specify the initial data that will be put in database
     * // on successful connection and if the database is empty.
     * const quickMongoClient = new QuickMongoClient(connectionURI)
     *
     * const mongo = new QuickMongo(quickMongoClient, {
     *     name: 'databaseName',
     *     collectionName: 'collectionName' // optional
     * })
     */
    public constructor(client: QuickMongoClient<any>, options: IDatabaseConfiguration) {
        this._cache = new CacheManager(client)
        this._client = client

        this._model = models[options.name] || model<IDatabaseInternalStructure<any>>(
            options.name, internalDatabaseSchema, options.collectionName
        )

        this.name = options.name
        this.collectionName = options.collectionName

        this._loadCache()
    }

    /**
     * Sends a read, write and delete requests to the remote database and returns the request latencies.
     * @returns {Promise<IDatabaseRequestsLatencies>} Database requests latencies object.
     * @example
     * const ping = mongo.ping()
     * console.log(ping) // -> { readLatency: 123, writeLatency: 124, deleteLatency: 125 }
     */
    public async ping(): Promise<IDatabaseRequestsLatencies> {
        const pingDatabaseKey = '___PING___' as K

        let readLatency = -1
        let writeLatency = -1
        let deleteLatency = -1

        if (!this._client.connected) {
            throw new QuickMongoError('NOT_CONNECTED')
        }

        const readStartDate = Date.now()

        await this.raw()
        readLatency = Date.now() - readStartDate

        const writeStartDate = Date.now()

        await this.set(pingDatabaseKey, 1)
        writeLatency = Date.now() - writeStartDate

        const deleteStartDate = Date.now()

        await this.delete(pingDatabaseKey)
        deleteLatency = Date.now() - deleteStartDate

        return {
            readLatency,
            writeLatency,
            deleteLatency
        }
    }

    /**
     * Retrieves a value from database by a key.
     *
     * Type parameters:
     *
     * - `TValue` (any;, defaults to `V`) - The type of the data to be returned from database.
     * @param {K} key The key to access the data by.
     * @returns {Maybe<TValue>} The value from database.
     * @example
     * const simpleValue = quickMongo.get('simpleValue')
     * console.log(simpleValue) // -> 123
     *
     * const databaseObjectPropertyAccessed = quickMongo.get('youCanAlso.accessDatabaseObjectProperties.likeThat')
     * console.log(databaseObjectPropertyAccessed) // -> 'hello world!'
     *
     * // ^ Assuming that the database object for this example is:
     * // {
     * //    simpleValue: 123,
     * //    youCanAlso: {
     * //        accessDatabaseObjectProperties: {
     * //            likeThat: 'hello world!'
     * //        }
     * //    }
     * // }
     */
    public get<TValue = V>(key: K): Maybe<TValue> {
        return this._cache.get<TValue>(key)
    }

    /**
     * Retrieves a value from database by a key.
     *
     * - This method is an alias for {@link QuickMongo.get()} method.
     *
     * Type parameters:
     *
     * - `TValue` (any;, defaults to `V`) - The type of the data to be returned from database.
     * @param {K} key The key to access the data by.
     * @returns {Maybe<TValue>} The value from database.
     * @example
     * const simpleValue = quickMongo.get('simpleValue')
     * console.log(simpleValue) // -> 123
     *
     * // You can use the dot notation to access the database object properties:
     * const objectPropertyAccessed = quickMongo.get('youCanAlso.accessObjectProperties.likeThat')
     * console.log(objectPropertyAccessed) // -> 'hello world!'
     *
     * // ^ Assuming that the database object for this example is:
     * // {
     * //    simpleValue: 123,
     * //    youCanAlso: {
     * //        accessObjectProperties: {
     * //            likeThat: 'hello world!'
     * //        }
     * //    }
     * // }
     */
    public fetch<TValue = V>(key: K): Maybe<TValue> {
        return this.get<TValue>(key)
    }

    /**
     * Determines if the data is stored in database.
     * @param {key} key The key to access the data by.
     * @returns {boolean} Whether the data is stored in database.
     * @example
     * const isSimpleValueInDatabase = mongo.has('simpleValue')
     * console.log(isSimpleValueInDatabase) // -> true
     *
     * const somethingElse = quickMongo.has('somethingElse')
     * console.log(somethingElse) // -> false
     *
     * // You can use the dot notation to check the database object properties:
     * const isObjectInDatabase = quickMongo.has('youCanAlso.accessObjectProperties.likeThat')
     * console.log(isObjectInDatabase) // -> true
     *
     * // ^ Assuming that the database object for this example is:
     * // {
     * //    simpleValue: 123,
     * //    youCanAlso: {
     * //        accessObjectProperties: {
     * //            likeThat: 'hello world!'
     * //        }
     * //    }
     * // }
     */
    public has(key: K): boolean {
        return this.get(key) !== null
    }

    public async set<
        TValue = V,
        TReturnValue = any
    >(key: K, value: TValue): Promise<If<IsObject<TValue>, TReturnValue, TValue>> {
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

    /**
     * Deletes the data from database by key.
     * @param {K} key The key to access the data by.
     * @returns {Promise<void>}
     * @example
     * const databaseBefore = mongo.all()
     * console.log(databaseBefore) // -> { prop1: 123, prop2: { prop3: 456, prop4: 789 } }
     *
     * await mongo.delete('prop1') // deleting `prop1` from the database
     * await mongo.delete('prop2.prop3') // deleting `prop3` property from `prop2` object in database
     *
     * const databaseAfter = mongo.all()
     * console.log(databaseAfter) // -> { prop2: { prop4: 789 } }
     *
     * // ^ Assuming that the database object for this example is:
     * // {
     * //     prop1: 123,
     * //     prop2: {
     * //         prop3: 456,
     * //         prop4: 789
     * //     }
     * // }
     */
    public async delete(key: K): Promise<void> {
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
    }

    /**
     * Performs an arithmetical addition to a target number in database.
     *
     * [!!!] The target must be a number.
     * @param {string} key The key to access the data by.
     * @param {number} numberToAdd The number to add to the target number in database.
     * @returns {Promise<number>} Addition operation result.
     * @example
     * const additionResult = await mongo.add('points', 5)
     * console.log(operationResult) // -> 10 (5 + 5 = 10)
     *
     * // Notice that we don't need to assign a value to unexistent properties in database
     * // before performing an addition since the initial target value is 0 and will be used
     * // as the value of the unexistent property:
     * const unexistentAdditionResult = await mongo.add('somethingElse', 3)
     * console.log(operationResult) // -> 3 (0 +  = 3); the property didn't exist in database, that's why 0 is added to 3
     *
     * // ^ Assuming that the database object for this example is:
     * // {
     * //    points: 5
     * // }
     */
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

    /**
     * Performs an arithmetical subtraction to a target number in database.
     *
     * [!!!] The target must be a number.
     * @param {string} key The key to access the data by.
     * @param {number} numberToSubtract The number to subtract from the target number in database.
     * @returns {Promise<number>} Subtraction operation result.
     * @example
     * const subtractionResult = await mongo.subtract('points', 5)
     * console.log(operationResult) // -> 5 (10 - 5 = 5)
     *
     * // Notice that we don't need to assign a value to unexistent properties in database
     * // before performing a subtraction since the initial target value is 0 and will be used
     * // as the value of the unexistent property:
     * const unexistentSubtractionitionResult = await mongo.subtract('somethingElse', 3)
     * console.log(operationResult) // -> 3 (0 - 3 = -3); the property didn't exist in database, so 3 is subtracted from 0
     *
     * // ^ Assuming that the database object for this example is:
     * // {
     * //    points: 10
     * // }
     */
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

    /**
     * Pushes the specified value into the target array in database.
     *
     * [!!!] The target must be an array.
     *
     * Type parameters:
     *
     * `TValue` (any, defaults to `V`) - The type of value to be set and type of array to be returned.
     *
     * @param {K} key The key to access the data by.
     * @param {TValue} value The value to be pushed into the target array in databse.
     * @returns {Promise<TValue[]>} Updated target array from database.
     * @example
     * const operationResult = await mongo.push('members', 'William')
     * console.log(operationResult) // -> ['John', 'William']
     *
     * // ^ Assuming that the database object for this example is:
     * // {
     * //    members: ['John']
     * // }
     */
    public async push<TValue = V>(key: K, value: TValue): Promise<TValue[]> {
        // TODO: multiple values support (rest or array);
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

    /**
     * Replaces the specified element in target array with the specified value into the target array in database.
     *
     * [!!!] The target must be an array.
     *
     * Type parameters:
     *
     * `TValue` (any, defaults to `V`) - The type of value to be set and type of array to be returned.
     *
     * @param {K} key The key to access the data by.
     * @param {number} targetArrayElementIndex The index to find the element in target array by.
     * @param {TValue} value The value to be pushed into the target array in databse.
     * @returns {Promise<TValue[]>} Updated target array from database.
     * @example
     * const operationResult = await mongo.push('members', 'William')
     * console.log(operationResult) // -> ['John', 'William']
     *
     * // ^ Assuming that the database object for this example is:
     * // {
     * //    members: ['John']
     * // }
     */

    public async pull<TValue = V>(key: K, targetArrayElementIndex: number, value: TValue): Promise<TValue[]> {
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
            targetArray[targetArray.length - targetArrayElementIndex] = value
        } else {
            targetArray[targetArrayElementIndex] = value
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

    /**
     * Returns an array of object keys by specified database key.
     *
     * If `key` parameter is omitted, then an array of object keys of database root object will be returned.
     * @param {K} [key] The key to access the data by.
     * @returns {string[]} Database object keys array.
     * @example
     * const prop3Keys = mongo.keys('prop3')
     * console.log(prop3Keys) // -> ['prop4', 'prop5']
     *
     * const prop5Keys = mongo.keys('prop3.prop5')
     * console.log(prop5Keys) // -> ['prop6']
     *
     * const prop6Keys = mongo.keys('prop3.prop5.prop6')
     * console.log(prop6Keys) // -> [] (empty since the value in `prop6`, 111 a primitive value and not an actual object)
     *
     * const databaseKeys = mongo.keys() // `key` parameter is omitted - object keys of database object are being returned
     * console.log(databaseKeys) // -> ['prop1', 'prop2', 'prop3']
     *
     * const unexistentKeys = mongo.keys('somethingElse')
     * console.log(unexistentKeys) // -> [] (empty since the key `somethingElse` does not exist in database)
     *
     * // ^ Assuming that the database object for this example is:
     * // {
     * //    prop1: 123,
     * //    prop2: 456,
     * //    prop3: { prop4: 789, prop5: { prop6: 111 } }
     * // }
     */
    public keys(key?: K): string[] {
        if (!key) {
            return Object.keys(this.all())
        }

        const data = this.get(key)

        return Object.keys(data || {})
            .filter(key => data[key] !== undefined && data[key] !== null)
    }

    /**
     * Picks a random element of array in database and returns the picked array element.
     *
     * [!!!] The target in database must be an array.
     *
     * Type parameters:
     *
     * - `T` (any): The type of random element in the array to be returned.
     *
     * @param {K} key The key in database.
     * @returns {T} The randomly picked element in the array.
     *
     * @example
     * const array = mongo.get('exampleArray') // assuming that the array is ['example1', 'example2', 'example3']
     * console.log(array) // -> ['example1', 'example2', 'example3']
     *
     * const randomArrayElement = mongo.random('exampleArray')
     * console.log(randomArrayElement) // -> randomly picked array element: either 'example1', 'example2', or 'example3'
     */
    public random<T>(key: K): T {
        const array = this.get(key)

        if (!Array.isArray(array)) {
            throw new QuickMongoError('INVALID_TARGET', 'array', typeOf(array))
        }

        return array[Math.floor(Math.random() * array.length)]
    }

    /**
     * Deletes everything from the database.
     * @returns {Promise<void>}
     * @example
     * await mongo.clear() // this will clear the database
     */
    public async clear(): Promise<void> {
        await this._model.deleteMany()
    }

    /**
     * Deletes everything from the database.
     *
     * - This method is an alias for {@link QuickMongo.clear()} method.
     * @returns {Promise<void>}
     * @example
     * await mongo.deleteAll() // this will clear the database
     */
    public async deleteAll(): Promise<void> {
        return this.clear()
    }

    /**
     * Loads the database into cache.
     * @returns {Promise<void>}
     * @private
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
     * Makes a request and fetches the database contents from remote cluster.
     *
     * Type parameters:
     *
     * - `TValue` (object) - The type of object of all the database object to be returned.
     *
     * @returns {Promise<TValue>} Fetched database contents.
     * @private
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
     *
     * Type parameters:
     *
     * - `TValue` (object) - The type of object of all the database object to be returned.
     *
     * @returns {TValue} Cached database contents.
     * @example
     * const database = mongo.all()
     * console.log(database) // -> { ... (the object of all the data stored in database) }
     */
    public all<TValue extends Record<string, any> = any>(): TValue {
        return this._cache.getCacheObject<TValue>()
    }

    /**
     * Makes a database request and fetches the raw database content - the data as it is stored in
     * internal [__KEY]-[__VALUE] storage format that was made to achieve better data accessibility across the module.
     *
     * Type parameters:
     *
     * - `TInternalDataValue` (any) - The type of `__VALUE` property in each raw data object.
     *
     * @returns {Promise<IDatabaseInternalStructure<TInternalDataValue>[]>}
     * Raw database content - the data as it is stored in internal [__KEY]-[__VALUE] storage format that was made
     * to achieve better data accessibility across the module.
     *
     * @example
     * const rawData = await mongo.raw()
     * console.log(rawData) // -> [{_id: '6534ee98408514005215ad2d', __KEY: 'something', __VALUE: 'something', __v: 0}, ...]
     */
    public async raw<TInternalDataValue = any>(): Promise<IDatabaseInternalStructure<TInternalDataValue>[]> {
        const data = await this._model.find()
        return data as any
    }
}
