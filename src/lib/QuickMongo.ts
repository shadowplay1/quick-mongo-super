import { Model, MongooseError, model, models } from 'mongoose'

import {
    IDatabaseConfiguration,
    IDatabaseInternalStructure,
    IDatabaseRequestsLatencyData
} from '../types/Database'

import { QuickMongoClient } from './QuickMongoClient'

import { internalDatabaseSchema } from '../schemas/internal.schema'
import { CacheManager } from './managers/CacheManager'

import { isObject } from './utils/functions/isObject.function'
import { typeOf } from './utils/functions/typeOf.function'

import { isNumber } from './utils/functions/isNumber.function'
import { TypedObject } from './utils/TypedObject'

import { QuickMongoError } from './utils/QuickMongoError'

import {
    AutocompletableString,
    ExtractFromArray, FirstObjectKey,
    If, IsObject, Maybe, ObjectPath,
    ObjectValue, QueryFunction, RestOrArray
} from '../types/utils'

import { createTypesArray } from '../structures/errors'

/**
 * Quick Mongo database class.
 *
 * Type parameters:
 *
 * - `K` (`string`) - The type of The key to access the target in database by.
 * - `V` (`any`) - The type of the values in the database.
 *
 * @template K (`string`) - The type of The key to access the target in database by.
 * @template V (`any`) - The type of the values in the database.
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
export class QuickMongo<K extends string = string, V = any> {

    /**
     * Cache Manager.
     * @type {CacheManager<any, IDatabaseInternalStructure<any>>}
     * @private
     */
    private _cache: CacheManager<any, IDatabaseInternalStructure<any>>

    /**
     * Quick Mongo client the database instance is attached to.
     * @type {QuickMongoClient<any>}
     * @private
     */
    private _client: QuickMongoClient<any>

    /**
     * Internal Mongoose model for the module to work with.
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
     * Creates a new instance of Quick Mongo database.
     *
     * Type parameters:
     *
     * - `K` (`string`) - The type of The key to access the target in database by.
     * - `V` (`any`) - The type of the values in the database.
     *
     * @param {QuickMongoClient<any>} client Quick Mongo client to get attached to.
     * @param {IDatabaseConfiguration} databaseConfiguration Database configuration object.
     *
     * @template K (`string`) - The type of The key to access the target in database by.
     * @template V (`any`) - The type of the values in the database.
     *
     * @example
     * const { QuickMongoClient, QuickMongo } = require('quick-mongo-super')
     *
     * // Create a normal Quick Mongo client.
     * const quickMongoClient = new QuickMongoClient(connectionURI)
     *
     * // Initialize the normal database:
     * const mongo = new QuickMongo(quickMongoClient, {
     *     name: 'databaseName',
     *     collectionName: 'collectionName' // (optional)
     * })
     *
     * // Alternatively, you can also specify the initial data that will be inserted
     * // on successful connection in every database if it's empty:
     * const quickMongoClientWithInitialData = new QuickMongoClient(connectionURI, {
     *     somethingToSetInDatabase: 'something'
     * })
     *
     * // Initialize the database with initial data being set:
     * const mongoWithInitialData = new QuickMongo(quickMongoClientWithInitialData, {
     *     name: 'databaseName',
     *     collectionName: 'collectionName' // (optional)
     * })
     *
     * // Initial data will be available as soon as the database instance was created
     * // and initialized from the QuickMongoClient with the initial data being set, and the
     * // connection to your cluster is established:
     * console.log(mongoWithInitialData.all()) // -> { somethingToSetInDatabase: 'something' }
     */
    public constructor(client: QuickMongoClient<any>, databaseConfiguration: IDatabaseConfiguration) {
        if (!client) {
            throw new QuickMongoError('REQUIRED_CONSTRUCTOR_PARAMETER_MISSING', 'client', 'QuickMongo')
        }

        if (!(client instanceof QuickMongoClient)) {
            throw new QuickMongoError(
                'INVALID_CONSTRUCTOR_PARAMETER_TYPE',
                'client', 'QuickMongo',
                'QuickMongo class instance', typeOf(client)
            )
        }

        if (!databaseConfiguration) {
            throw new QuickMongoError(
                'REQUIRED_CONSTRUCTOR_PARAMETER_MISSING',
                'databaseConfiguration', 'QuickMongo',
            )
        }

        if (typeof databaseConfiguration !== 'object') {
            throw new QuickMongoError(
                'INVALID_CONSTRUCTOR_PARAMETER_TYPE',
                'databaseConfiguration', 'QuickMongo',
                'object', typeOf(databaseConfiguration)
            )
        }

        if (!databaseConfiguration.name) {
            throw new QuickMongoError(
                'REQUIRED_CONSTRUCTOR_PARAMETER_MISSING',
                'databaseConfiguration.name', 'QuickMongo'
            )
        }

        if (typeof databaseConfiguration.name !== 'string') {
            throw new QuickMongoError(
                'INVALID_CONSTRUCTOR_PARAMETER_TYPE',
                'databaseConfiguration.name', 'QuickMongo',
                'string', typeOf(databaseConfiguration.name)
            )
        }

        if (databaseConfiguration.collectionName && typeof databaseConfiguration.collectionName !== 'string') {
            throw new QuickMongoError(
                'INVALID_CONSTRUCTOR_PARAMETER_TYPE',
                'databaseConfiguration.collectionName', 'QuickMongo',
                'string', typeOf(databaseConfiguration.collectionName)
            )
        }

        this._cache = new CacheManager(client)
        this._client = client

        this._model = models[databaseConfiguration.name] || model<IDatabaseInternalStructure<any>>(
            databaseConfiguration.name,
            internalDatabaseSchema,
            databaseConfiguration.collectionName
        )

        this.name = databaseConfiguration.name
        this.collectionName = databaseConfiguration.collectionName

        this.loadCache()
        this._client.databases.push(this)
    }

    /**
     * Determines the number of keys in the root of the database. Equivalent to `QuickMongo.keys().length`.
     * @type {number}
     */
    public get size(): number {
        return this.keys().length
    }

    /**
     * Sends a read, write and delete requests to the remote database and returns the request latencies in milliseconds.
     * @returns {Promise<IDatabaseRequestsLatencyData>} Database requests latencies object.
     *
     * @example
     * const ping = await quickMongo.ping()
     * console.log(ping) // -> { readLatency: 123, writeLatency: 124, deleteLatency: 125 }
     */
    public async ping(): Promise<IDatabaseRequestsLatencyData> {
        const pingDatabaseKey = '___PING___' as any

        let readLatency = -1
        let writeLatency = -1
        let deleteLatency = -1

        if (!this._client.connected) {
            throw new QuickMongoError('CONNECTION_NOT_ESTABLISHED')
        }

        const readStartDate = Date.now()

        await this.raw()
        readLatency = Date.now() - readStartDate

        const writeStartDate = Date.now()

        await this.set(pingDatabaseKey, 1 as any)
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
     * This method works the same way as `Array.find()`.
     *
     * Iterates over root database values, finds the element in database values array
     * by specified condition in the callback function and returns the result.
     *
     * @param {QueryFunction<V>} queryFunction
     * A function that accepts up to three arguments.
     * The `find` method calls the `queryFunction` once for each element in database object values array.
     *
     * @returns {Maybe<V>} The search
     */
    public find(queryFunction: QueryFunction<V>): Maybe<V> {
        const values = this.values()
        return values.find(queryFunction as QueryFunction<ObjectValue<V, any>>) as Maybe<V> ?? null
    }

    /**
     * This method works the same way as `Array.map()`.
     *
     * Calls a defined callback function on each element of an array,
     * and returns an array that contains the results.
     *
     * @param {QueryFunction<V, TReturnType>} queryFunction
     * A function that accepts up to three arguments.
     * The `map` method calls the `queryFunction` once for each element in database object values array.
     *
     * @returns {TReturnType[]}
     */
    public map<TReturnType>(queryFunction: QueryFunction<V, TReturnType>): TReturnType[] {
        const values = this.values()
        return values.map(queryFunction as QueryFunction<ObjectValue<V, any>, TReturnType>)
    }

    /**
     * This method works the same way as `Array.findIndex()`.
     *
     * Iterates over root database values, finds the index of the element in database values array
     * by specified condition in the callback function and returns the result.
     *
     * @param {QueryFunction<V>} queryFunction
     * A function that accepts up to three arguments.
     * The `findIndex` method calls the `queryFunction` once for each element in database object values array.
     *
     * @returns {number}
     */
    public findIndex(queryFunction: QueryFunction<V>): number {
        const values = this.values()
        return values.findIndex(queryFunction as QueryFunction<ObjectValue<V, any>>)
    }

    /**
     * This method works the same way as `Array.filter()`.
     *
     * Iterates over root database values, finds all the element that match the
     * specified condition in the callback function and returns the result.
     *
     * @param {QueryFunction<V>} queryFunction
     * A function that accepts up to three arguments.
     * The `filter` method calls the `queryFunction` once for each element in database object values array.
     *
     * @returns {V[]}
     */
    public filter(queryFunction: QueryFunction<V>): V[] {
        const values = this.values()
        return values.filter(queryFunction as QueryFunction<ObjectValue<V, any>>) as V[]
    }

    /**
     * This method works the same way as `Array.some()`.
     *
     * Iterates over root database values and checks if the
     * specified condition in the callback function returns `true`
     * for **any** of the elements of the database object values array.
     *
     * @param {QueryFunction<V>} queryFunction
     * A function that accepts up to three arguments.
     * The `some` method calls the `queryFunction` once for each element in database object values array.
     *
     * @returns {boolean}
     */
    public some(queryFunction: QueryFunction<V>): boolean {
        const values = this.values()
        return values.some(queryFunction as QueryFunction<ObjectValue<V, any>>)
    }

    /**
     * This method works the same way as `Array.every()`.
     *
     * Iterates over root database values and checks if the
     * specified condition in the callback function returns `true`
     * for **all** of the elements of the database object values array.
     *
     * @param {QueryFunction<V>} queryFunction
     * A function that accepts up to three arguments.
     * The `every` method calls the `queryFunction` once for each element in database object values array.
     *
     * @returns {boolean}
     */
    public every(queryFunction: QueryFunction<V>): boolean {
        const values = this.values()
        return values.every(queryFunction as QueryFunction<ObjectValue<V, any>>)
    }

    /**
     * Retrieves a value from database by a key.
     *
     * @param {AutocompletableString<P>} key The key to access the target in database by.
     * @returns {Maybe<ObjectValue<V, P>>} The value of the target in database.
     *
     * @example
     * const simpleValue = quickMongo.get('simpleValue')
     * console.log(simpleValue) // -> 123
     *
     * const databaseObjectPropertyAccessed = quickMongo.get('youCanAlso.accessDatabaseObjectProperties.likeThat')
     * console.log(databaseObjectPropertyAccessed) // -> 'hello world!'
     *
     * // ^ Assuming that the initial database object for this example is:
     * // {
     * //    simpleValue: 123,
     * //    youCanAlso: {
     * //        accessDatabaseObjectProperties: {
     * //            likeThat: 'hello world!'
     * //        }
     * //    }
     * // }
     */
    public get<P extends ObjectPath<V>>(key: AutocompletableString<P>): Maybe<ObjectValue<V, P>> {
        return this._cache.get(key)
    }

    /**
     * Retrieves a value from database by a key via sending a **direct request**
     * to remote cluster, **omitting** the cache.
     *
     * @param {AutocompletableString<P>} key The key to access the target in database by.
     * @returns {Promise<Maybe<ObjectValue<V, P>>>} The value of the target in database.
     *
     * @example
     * const simpleValue = await quickMongo.getFromDatabase('simpleValue')
     * console.log(simpleValue) // -> 123
     *
     * const databaseObjectProperty = await quickMongo.getFromDatabase('youCanAlso.accessDatabaseObjectProperties.likeThat')
     * console.log(databaseObjectProperty) // -> 'hello world!'
     *
     * // ^ Assuming that the initial database object for this example is:
     * // {
     * //    simpleValue: 123,
     * //    youCanAlso: {
     * //        accessDatabaseObjectProperties: {
     * //            likeThat: 'hello world!'
     * //        }
     * //    }
     * // }
     */
    public async getFromDatabase<P extends ObjectPath<V>>(key: AutocompletableString<P>): Promise<Maybe<ObjectValue<V, P>>> {
        if (!this._client.connected) {
            throw new QuickMongoError('CONNECTION_NOT_ESTABLISHED')
        }

        if (!key) {
            throw new QuickMongoError('REQUIRED_PARAMETER_MISSING', 'key')
        }

        if (typeof key !== 'string') {
            throw new QuickMongoError('INVALID_TYPE', 'key', 'string', typeOf(key))
        }

        const keys = key.split('.')

        let data = await this.allFromDatabase() as Maybe<ObjectValue<V, P>>
        let parsedData = data

        for (let i = 0; i < keys.length; i++) {
            if (keys.length - 1 == i) {
                data = parsedData?.[keys[i]] ?? null
            }

            parsedData = parsedData?.[keys[i]]
        }

        return data
    }

    /**
     * Retrieves a value from database by a key.
     *
     * - This method is an alias for {@link QuickMongo.get()} method.
     *
     * @param {AutocompletableString<P>} key The key to access the target in database by.
     * @returns {Maybe<ObjectValue<V, P>>} The value from database.
     *
     * @example
     * const simpleValue = quickMongo.fetch('simpleValue')
     * console.log(simpleValue) // -> 123
     *
     * // You can use the dot notation to access the database object properties:
     * const playerInventory = quickMongo.fetch('player.inventory')
     * console.log(playerInventory) // -> []
     *
     * // ^ Assuming that the initial database object for this example is:
     * // {
     * //    simpleValue: 123,
     * //    player: {
     * //        inventory: []
     * //    }
     * // }
     */
    public fetch<P extends ObjectPath<V>>(key: AutocompletableString<P>): Maybe<ObjectValue<V, P>> {
        return this.get(key)
    }

    /**
     * Determines if the data is stored in database.
     * @param {AutocompletableString<P>} key The key to access the target in database by.
     * @returns {boolean} Whether the data is stored in database.
     *
     * @example
     * const isSimpleValueInDatabase = quickMongo.has('simpleValue')
     * console.log(isSimpleValueInDatabase) // -> true
     *
     * const somethingElse = quickMongo.has('somethingElse')
     * console.log(somethingElse) // -> false
     *
     * // You can use the dot notation to check the database object properties:
     * const isObjectInDatabase = quickMongo.has('youCanAlso.accessObjectProperties.likeThat')
     * console.log(isObjectInDatabase) // -> true
     *
     * // ^ Assuming that the initial database object for this example is:
     * // {
     * //    simpleValue: 123,
     * //    player: {
     * //        inventory: []
     * //    },
     * //    youCanAlso: {
     * //        accessObjectProperties: {
     * //            likeThat: 'hello world!'
     * //        }
     * //    }
     * // }
     */
    public has<P extends ObjectPath<V>>(key: AutocompletableString<P>): boolean {
        const target = this.get(key)
        return target !== null && target !== undefined
    }

    /**
     * Writes the specified value into database under the specified key.
     *
     * @param {AutocompletableString<P>} key The key to write in the target.
     * @param {ObjectValue<V, P>} value The value to write.
     *
     * @returns {Promise<If<IsObject<V>, FirstObjectKey<P>, V>>}
     * - If the `value` parameter's type is not an object (string, number, boolean, etc), then the specified
     * `value` parameter (type of `ObjectValue<V, P>`) will be returned.
     *
     * - If an object is specified in the `value` parameter, then the object of the first key will be returned.
     * (type of `FirstObjectKey<P>` - first object key (e.g. in key `member.user.id`, the first key will be `member`))
     *
     * @example
     * // Assuming that the initial database object for this example is empty.
     *
     * await quickMongo.set('something', 'hello from quick-mongo-super!')
     * const hello = quickMongo.get('something')
     *
     * console.log(hello) // -> 'hello from quick-mongo-super!'
     *
     * // You can use the dot notation to write data in objects:
     * const dotNotationSetResult = await quickMongo.set('thats.an.object', 123)
     * console.log(dotNotationSetResult) // -> 123
     *
     * await quickMongo.set('player.inventory', [])
     * const inventory = quickMongo.get('player')
     *
     * console.log(inventory) // -> { inventory: [] }
     *
     * // Using objects as value will return the object of key `thats`:
     * await quickMongo.set('thats.an.object', { hello: 'world' }) // -> { an: { object: { hello: 'world' } } }
     *
     * // ^ After these manipulations, the database object will look like this:
     * // {
     * //     "something": "hello from quick-mongo-super!",
     * //     "player": {
     * //         "inventory": []
     * //     },
     * //     "thats": {
     * //         "an": {
     * //             "object": {
     * //                 hello: 'world'
     * //             }
     * //         }
     * //     }
     * // }
     */
    public async set<P extends ObjectPath<V>>(
        key: AutocompletableString<P>,
        value: ObjectValue<V, P>
    ): Promise<If<IsObject<V>, FirstObjectKey<P>, V>> {
        const allDatabase = this.all()
        this._cache.set(key, value)

        const keys = key.split('.')
        let currentObj = allDatabase

        for (let i = 0; i < keys.length; i++) {
            if (keys.length - 1 === i) {
                currentObj[keys[i]] = value
            } else {
                if (!isObject(currentObj[keys[i]])) {
                    currentObj[keys[i]] = {}
                }
                currentObj = currentObj[keys[i]]
            }
        }

        const data = await this._model.findOne({
            __KEY: keys[0]
        })

        if (!data) {
            this._model.insertMany({
                __KEY: keys[0],
                __VALUE: allDatabase[keys[0]]
            })
        } else {
            await this._model.updateOne({
                __KEY: keys[0]
            }, {
                __VALUE: allDatabase[keys[0]]
            })
        }

        return typeof value == 'object' && value !== null ? this._cache.get(keys[0]) : value as any
    }

    /**
     * Deletes the data from database by key.
     * @param {AutocompletableString<P>} key The key to access the target in database by.
     * @returns {Promise<boolean>} Whether the deletition was successful.
     *
     * @example
     * const databaseBefore = quickMongo.all()
     * console.log(databaseBefore) // -> { prop1: 123, prop2: { prop3: 456, prop4: 789 } }
     *
     * await quickMongo.delete('prop1') // deleting `prop1` from the database
     * await quickMongo.delete('prop2.prop3') // deleting `prop3` property from `prop2` object in database
     *
     * const databaseAfter = quickMongo.all()
     * console.log(databaseAfter) // -> { prop2: { prop4: 789 } }
     *
     * // ^ Assuming that the initial database object for this example is:
     * // {
     * //     prop1: 123,
     * //     prop2: {
     * //         prop3: 456,
     * //         prop4: 789
     * //     }
     * // }
     */
    public async delete<P extends ObjectPath<V>>(key: AutocompletableString<P>): Promise<boolean> {
        const allDatabase = this.all()

        if (!this.has(key)) {
            return false
        }

        this._cache.delete(key)

        const keys = key.split('.')
        let database = allDatabase as any

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
                __VALUE: allDatabase[keys[0]]
            })
        }

        return true
    }

    /**
     * Performs an arithmetical addition on a target number in database.
     *
     * [!!!] The type of target value must be a number.
     *
     * @param {AutocompletableString<P>} key The key to access the target in database by.
     * @param {number} numberToAdd The number to add to the target number in database.
     * @returns {Promise<number>} Addition operation result.
     *
     * @example
     * const additionResult = await quickMongo.add('points', 5)
     * console.log(additionResult) // -> 10 (5 + 5 = 10)
     *
     * // Notice that we don't need to assign a value to unexistent properties in database
     * // before performing an addition since the initial target value is 0 and will be used
     * // as the value of the unexistent property:
     * const unexistentAdditionResult = await quickMongo.add('somethingElse', 3)
     *
     * console.log(unexistentAdditionResult) // -> 3 (0 +  = 3)
     * // ^ the property didn't exist in database, that's why 0 is added to 3
     *
     * // ^ Assuming that the initial database object for this example is:
     * // {
     * //    points: 5
     * // }
     */
    public async add<P extends ObjectPath<V>>(key: AutocompletableString<P>, numberToAdd: number): Promise<number> {
        const targetNumber = this.get(key) ?? 0 as any

        if (!isNumber(targetNumber)) {
            throw new QuickMongoError('INVALID_TARGET', 'number', typeOf(targetNumber))
        }

        if (numberToAdd === undefined) {
            throw new QuickMongoError('REQUIRED_PARAMETER_MISSING', 'numberToAdd')
        }

        if (!isNumber(numberToAdd)) {
            throw new QuickMongoError('INVALID_TYPE', 'numberToAdd', 'number', typeOf(numberToAdd))
        }

        const result = await this.set(key, targetNumber + numberToAdd)
        return result as any
    }

    /**
     * Performs an arithmetical subtraction on a target number in database.
     *
     * [!!!] The type of target value must be a number.
     *
     * @param {AutocompletableString<P>} key The key to access the target in database by.
     * @param {number} numberToSubtract The number to subtract from the target number in database.
     * @returns {Promise<number>} Subtraction operation result.
     *
     * @example
     * const subtractionResult = await quickMongo.subtract('points', 5)
     * console.log(subtractionResult) // -> 5 (10 - 5 = 5)
     *
     * // Notice that we don't need to assign a value to unexistent properties in database
     * // before performing a subtraction since the initial target value is 0 and will be used
     * // as the value of the unexistent property:
     * const unexistentSubtractionitionResult = await quickMongo.subtract('somethingElse', 3)
     *
     * console.log(unexistentSubtractionitionResult) // -> 3 (0 - 3 = -3)
     * // ^ the property didn't exist in database, so 3 is subtracted from 0
     *
     * // ^ Assuming that the initial database object for this example is:
     * // {
     * //    points: 10
     * // }
     */
    public async subtract<P extends ObjectPath<V>>(
        key: AutocompletableString<P>,
        numberToSubtract: number
    ): Promise<number> {
        const targetNumber: any = this.get(key) ?? 0

        if (!isNumber(targetNumber)) {
            throw new QuickMongoError('INVALID_TARGET', 'number', typeOf(targetNumber))
        }

        if (numberToSubtract === undefined) {
            throw new QuickMongoError('REQUIRED_PARAMETER_MISSING', 'numberToSubtract')
        }

        if (!isNumber(numberToSubtract)) {
            throw new QuickMongoError('INVALID_TYPE', 'numberToSubtract', 'number', typeOf(numberToSubtract))
        }

        const result = await this.set(key, targetNumber - numberToSubtract as any)
        return result as any
    }

    /**
     * Determines whether the specified target is an array.
     *
     * @param {AutocompletableString<P>} key The key to access the target in database by.
     * @returns {boolean} Whether the target is an array.
     *
     * @example
     * const isArray = quickMongo.isTargetArray('array')
     * console.log(isArray) // -> true
     *
     * const notArray = quickMongo.isTargetArray('notArray')
     * console.log(notArray) // -> false
     *
     * // ^ Assuming that the initial database object for this example is:
     * // {
     * //    array: [],
     * //    notArray: 123
     * // }
     */
    public isTargetArray<P extends ObjectPath<V>>(key: AutocompletableString<P>): boolean {
        const target = this.get(key)
        return Array.isArray(target)
    }

    /**
     * Determines whether the specified target is a number.
     *
     * @param {AutocompletableString<P>} key The key to access the target in database by.
     * @returns {boolean} Whether the target is a number.
     *
     * @example
     * const isNumber = quickMongo.isTargetNumber('number')
     * console.log(isNumber) // -> true
     *
     * const notNumber = quickMongo.isTargetNumber('notNumber')
     * console.log(notNumber) // -> false
     *
     * // ^ Assuming that the initial database object for this example is:
     * // {
     * //    number: 123,
     * //    notNumber: []
     * // }
     */
    public isTargetNumber<P extends ObjectPath<V>>(key: AutocompletableString<P>): boolean {
        const target = this.get(key)
        return isNumber(target)
    }

    /**
     * Pushes the specified value(s) into the target array in database.
     *
     * [!!!] The type of target value must be an array.
     *
     * @param {AutocompletableString<P>} key The key to access the target in database by.
     * @param {RestOrArray<ExtractFromArray<ObjectValue<V, P>>>} values
     * The value(s) to be pushed into the target array in database.
     *
     * @returns {Promise<Array<ExtractFromArray<ObjectValue<V, P>>>>} Updated target array from database.
     *
     * @example
     * const membersPushResult = await quickMongo.push('members', 'William')
     * console.log(membersPushResult) // -> ['John', 'William']
     *
     * // You can also pass in multiple values to push into the target array:
     * const currenciesPushResult = await quickMongo.push('currencies', 'Euro', 'Rupee')
     * console.log(currenciesPushResult) // -> ['Dollar', 'Euro', 'Rupee']
     *
     * // ^ Assuming that the initial database object for this example is:
     * // {
     * //    members: ['John'],
     * //    currencies: ['Dollar']
     * // }
     */
    public async push<P extends ObjectPath<V>>(
        key: AutocompletableString<P>,
        ...values: RestOrArray<ExtractFromArray<ObjectValue<V, P>>>
    ): Promise<ExtractFromArray<ObjectValue<V, P>>[]> {
        const targetArray = this.get(key) || []

        if (!Array.isArray(targetArray)) {
            throw new QuickMongoError('INVALID_TARGET', 'array', typeOf(targetArray))
        }

        if (!values.length) {
            throw new QuickMongoError('REQUIRED_PARAMETER_MISSING', 'values')
        }

        targetArray.push(...values)

        await this.set(key, targetArray as any)
        return targetArray
    }

    /**
     * Replaces the specified element in target array with the specified value in the target array in database.
     *
     * [!!!] The type of target value must be an array.
     *
     * @param {AutocompletableString<P>} key The key to access the target in database by.
     * @param {number} targetArrayElementIndex The index to find the element in target array by.
     * @param {V} value The value to be pushed into the target array in database.
     * @returns {Promise<Array<ExtractFromArray<ObjectValue<V, P>>>>} Updated target array from database.
     *
     * @example
     * const membersPullResult = await quickMongo.pull('members', 1, 'James')
     * console.log(membersPullResult) // -> ['John', 'James', 'Tom']
     *
     * // ^ Assuming that the initial database object for this example is:
     * // {
     * //    members: ['John', 'William', 'Tom']
     * // }
     */
    public async pull<P extends ObjectPath<V>>(
        key: AutocompletableString<P>,
        targetArrayElementIndex: number,
        value: ObjectValue<V, P>
    ): Promise<ExtractFromArray<ObjectValue<V, P>>[]> {
        const targetArray = this.get(key) ?? []

        if (!Array.isArray(targetArray)) {
            throw new QuickMongoError('INVALID_TARGET', 'number', typeOf(targetArray))
        }

        if (targetArrayElementIndex === undefined) {
            throw new QuickMongoError('REQUIRED_PARAMETER_MISSING', 'targetArrayElementIndex')
        }

        if (!isNumber(targetArrayElementIndex)) {
            throw new QuickMongoError('INVALID_TYPE', 'targetArrayElementIndex', 'number', typeOf(targetArrayElementIndex))
        }

        if (value === undefined) {
            throw new QuickMongoError('REQUIRED_PARAMETER_MISSING', 'value')
        }

        if (targetArrayElementIndex < 0) {
            targetArray[targetArray.length - targetArrayElementIndex] = value
        } else {
            targetArray[targetArrayElementIndex] = value
        }

        await this.set(key, targetArray as any)
        return targetArray
    }

    /**
     * Removes the specified element(s) from the target array in database.
     *
     * [!!!] The type of target value must be an array.
     *
     * @param {AutocompletableString<P>} key The key to access the target in database by.
     * @param {RestOrArray<ExtractFromArray<number>>} targetArrayElementIndexes
     * The index(es) to find the element(s) in target array by.
     *
     * @returns {Promise<Array<ExtractFromArray<ObjectValue<V, P>>>>} Updated target array from database.
     *
     * @example
     * const membersPopResult = await quickMongo.pop('members', 1)
     * console.log(membersPopResult) // -> ['John', 'Tom']
     *
     * const currenciesPopResult = await quickMongo.pop('currencies', 1)
     * console.log(currenciesPopResult) // -> ['Dollar', 'Euro']
     *
     * // ^ Assuming that the initial database object for this example is:
     * // {
     * //    members: ['John', 'William', 'Tom'],
     * //    currencies: ['Dollar', 'Rupee', 'Euro']
     * // }
     */
    public async pop<P extends ObjectPath<V>>(
        key: AutocompletableString<P>,
        ...targetArrayElementIndexes: RestOrArray<ExtractFromArray<number>>
    ): Promise<ExtractFromArray<ObjectValue<V, P>>[]> {
        const targetArray = this.get(key) ?? []

        if (!Array.isArray(targetArray)) {
            throw new QuickMongoError('INVALID_TARGET', 'number', typeOf(targetArray))
        }

        if (!targetArrayElementIndexes.length) {
            throw new QuickMongoError('REQUIRED_PARAMETER_MISSING', 'targetArrayElementIndex')
        }

        if (
            targetArrayElementIndexes.length == 1 &&
            !isNumber(targetArrayElementIndexes[0] as number) &&
            !Array.isArray(targetArrayElementIndexes[0])
        ) {
            throw new QuickMongoError(
                'INVALID_TYPE',
                'targetArrayElementIndex',
                'number',
                typeOf(targetArrayElementIndexes[0])
            )
        }

        if (
            targetArrayElementIndexes
                .map(index => !isNumber(index))
                .some(x => x)
        ) {
            throw new QuickMongoError(
                'ONE_OR_MORE_ARRAY_TYPES_INVALID',
                'targetArrayElementIndexes',
                'number',
                createTypesArray(targetArrayElementIndexes)
            )
        }

        for (const targetArrayElementIndex of targetArrayElementIndexes) {
            targetArray.splice(targetArrayElementIndex as number, 1)
        }

        await this.set(key, targetArray as any)
        return targetArray
    }

    /**
     * Returns an array of object keys by specified database key.
     *
     * If `key` parameter is omitted, then an array of object keys of database root object will be returned.
     *
     * Type parameters:
     *
     * - `TKeys` (`TupleOrArray<string>`, defaults to `K[]`) - The tuple or array of a type of keys to be returned.
     *
     * @param {P} [key] The key to access the target in database by.
     * @returns {Array<ObjectPath<P>>} Database object keys array.
     *
     * @example
     * const prop3Keys = quickMongo.keys('prop3')
     * console.log(prop3Keys) // -> ['prop4', 'prop5']
     *
     * const prop5Keys = quickMongo.keys('prop3.prop5')
     * console.log(prop5Keys) // -> ['prop6']
     *
     * const prop6Keys = quickMongo.keys('prop3.prop5.prop6')
     * console.log(prop6Keys)
     * // ^ -> [] (empty since the value in `prop6`, 111, is a primitive value and not an actual object)
     *
     * const databaseKeys = quickMongo.keys()
     * // in this example, `key` parameter is omitted - object keys of database object are being returned
     *
     * console.log(databaseKeys) // -> ['prop1', 'prop2', 'prop3']
     *
     * const unexistentKeys = quickMongo.keys('somethingElse')
     * console.log(unexistentKeys) // -> [] (empty since the key `somethingElse` does not exist in database)
     *
     * // ^ Assuming that the initial database object for this example is:
     * // {
     * //    prop1: 123,
     * //    prop2: 456,
     * //    prop3: { prop4: 789, prop5: { prop6: 111 } }
     * // }
     */
    public keys<P extends ObjectPath<V>>(key?: P): ObjectPath<P>[] {
        if (!key) {
            const allDatabase = this.all()
            return TypedObject.keys(allDatabase) as ObjectPath<P>[]
        }

        const data = this.get(key)
        const keys = TypedObject.keys(data)

        return keys.filter(key => data[key] !== undefined && data[key] !== null) as any
    }

    /**
     * Returns an array of object values by specified database key.
     *
     * If `key` parameter is omitted, then an array of object values of database root object will be returned.
     *
     * @param {P} [key] The key to access the target in database by.
     * @returns {Array<ObjectValue<V, P>>} Database object values array.
     *
     * @example
     * const prop3Values = quickMongo.values('prop3')
     * console.log(prop3Values) // -> [789, { prop6: 111 }]
     *
     * const prop5Values = quickMongo.values('prop3.prop5')
     * console.log(prop5Values) // -> []
     *
     * const prop6Values = quickMongo.values('prop3.prop5.prop6')
     * console.log(prop6Values)
     * // ^ -> [] (empty since the value in `prop6`, 111, is a primitive value and not an actual object)
     *
     * const databaseValues = quickMongo.values()
     * // in this example, `key` parameter is omitted - object values of database object are being returned
     *
     * console.log(databaseValues) // -> [123, 456, { prop4: 789, prop5: { prop6: 111 } }]
     *
     * const unexistentValues = quickMongo.values('somethingElse')
     * console.log(unexistentValues) // -> [] (empty since the key `somethingElse` does not exist in database)
     *
     * // ^ Assuming that the initial database object for this example is:
     * // {
     * //    prop1: 123,
     * //    prop2: 456,
     * //    prop3: { prop4: 789, prop5: { prop6: 111 } }
     * // }
     */
    public values<P extends ObjectPath<V>>(key?: P): ObjectValue<V, P>[] {
        if (!key) {
            const allDatabase = this.all()
            return TypedObject.values(allDatabase)
        }

        const data = this.get(key)
        const values = TypedObject.values(data)

        return values as ObjectValue<V, P>[]
    }

    /**
     * Picks a random element of array in database and returns the picked array element.
     *
     * [!!!] The type of target value must be an array.
     *
     * @param {AutocompletableString<P>} key The key to access the target in database by.
     * @returns {Maybe<ObjectValue<V, P>>} The randomly picked element in the database array.
     *
     * @example
     * const array = quickMongo.get('exampleArray') // assuming that the array is ['example1', 'example2', 'example3']
     * console.log(array) // -> ['example1', 'example2', 'example3']
     *
     * const randomArrayElement = quickMongo.random('exampleArray')
     * console.log(randomArrayElement) // -> randomly picked array element: either 'example1', 'example2', or 'example3'
     */
    public random<P extends ObjectPath<V>>(key: AutocompletableString<P>): Maybe<ObjectValue<V, P>> {
        const array = this.get(key)

        if (!Array.isArray(array)) {
            throw new QuickMongoError('INVALID_TARGET', 'array', typeOf(array))
        }

        return array[Math.floor(Math.random() * array.length)] ?? null
    }

    /**
     * Deletes everything from the database.
     * @returns {Promise<boolean>} `true` if cleared successfully, `false` otherwise.
     *
     * @example
     * await quickMongo.clear() // this will delete all the data from the database
     */
    public async clear(): Promise<boolean> {
        const databaseKeys = this.keys()

        if (!databaseKeys.length) {
            return false
        }

        this._cache.clear()
        await this._model.collection.deleteMany()

        return true
    }

    /**
     * Deletes everything from the database.
     *
     * - This method is an alias for {@link QuickMongo.clear()} method.
     * @returns {Promise<boolean>} `true` if cleared successfully, `false` otherwise.
     *
     * @example
     * await quickMongo.deleteAll() // this will delete all the data from the database
     */
    public async deleteAll(): Promise<boolean> {
        return this.clear()
    }

    /**
     * Gets all the database contents from the cache.
     *
     * Type parameters:
     *
     * - `T` (`object`, defaults to `Record<string, any>`) - The type of object of all the database object to be returned.
     *
     * @returns {T} Cached database contents.
     *
     * @template T (object, defaults to `Record<string, any>`) -
     * The type of object of all the database object to be returned.
     *
     * @example
     * const database = quickMongo.all()
     * console.log(database) // -> { ... (the object of all the data stored in database) }
     */
    public all<T extends Record<string, any> = Record<string, any>>(): T {
        return this._cache.getCacheObject<T>()
    }

    /**
     * Loads the database into cache.
     *
     * It's **not required** to run this method on starting or after any database operations -
     * cache management is performed automatically.
     *
     * @returns {Promise<void>}
     *
     * @example
     * await quickMongo.loadCache() // this will download all the database contents into the cache
     */
    public async loadCache(): Promise<void> {
        try {
            const database = await this.allFromDatabase()
            const initialDatabaseData = this._client.initialDatabaseData

            if (this._client.initialDatabaseData && !TypedObject.keys(database).length) {
                for (const key of TypedObject.keys(initialDatabaseData)) {
                    this.set(key as any, initialDatabaseData[key])
                    this._cache.set(key, initialDatabaseData[key] ?? null)
                }
            }

            for (const key in database) {
                const dataObject = database[key]
                this._cache.set(key, dataObject ?? null)
            }
        } catch (err) {
            if (err instanceof MongooseError) {
                throw new QuickMongoError('CONNECTION_NOT_ESTABLISHED')
            }
        }
    }

    /**
     * Makes a database request and fetches the raw database content - the data as it is
     * stored in the internal [__KEY]-[__VALUE] storage format that was made
     * to achieve better data accessibility across the module.
     *
     * Type parameters:
     *
     * - `TInternalDataValue` (`any`, defaults to `V`) - The type of `__VALUE` property in each raw data object.
     *
     * @returns {Promise<Array<IDatabaseInternalStructure<TInternalDataValue>>>}
     * Raw database content - the data as it is stored in internal [__KEY]-[__VALUE] storage format that was made
     * to achieve better data accessibility across the module.
     *
     * @template TInternalDataValue (any, defaults to `V`) - The type of `__VALUE` property in each raw data object.
     *
     * @example
     * const rawData = await quickMongo.raw()
     * console.log(rawData) // -> [{_id: '6534ee98408514005215ad2d', __KEY: 'something', __VALUE: 'something', __v: 0}, ...]
     */
    public async raw<TInternalDataValue = V>(): Promise<IDatabaseInternalStructure<TInternalDataValue>[]> {
        try {
            const data = await this._model.find()
            return data
        } catch (err) {
            throw new QuickMongoError('CONNECTION_NOT_ESTABLISHED')
        }
    }

    /**
     * Makes a direct request to the remote cluster and fetches all its contents.
     *
     * Type parameters:
     *
     * - `TValue` (`any`, defaults to `V`) - The type of object of all the database object to be returned.
     *
     * @template TValue (`object`) - The type of object of all the database object to be returned.
     * @returns {Promise<Record<K, TValue>>} Fetched database contents.
     *
     * @example
     * const allDatabase = quickMongo.allFromDatabase()
     * console.log(allDatabase) // -> { ... (the object of all the data stored in database) }
     */
    public async allFromDatabase<TValue = V>(): Promise<Record<K, TValue>> {
        const obj = {}
        const elements = await this.raw() || []

        for (const element of elements) {
            obj[element.__KEY] = element.__VALUE
        }

        return obj as any
    }
}
