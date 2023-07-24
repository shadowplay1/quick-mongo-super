import {
    MongoClient, MongoClientOptions,
    Db, Collection, Document
} from 'mongodb'

import fetch from 'node-fetch'

import { Emitter } from './classes/Emitter'
import { DatabaseError } from './classes/DatabaseError'
import { Utils } from './classes/Utils'

import errors from './errors'

import {
    IMongoConnectionOptions,
    IDatabaseObject, IDatabaseEvents,
    IVersionData, MongoLatency,
    PropertyValue, DatabaseReturnType
} from './interfaces/QuickMongo'

import modulePackage from '../package.json'

/**
 * QuickMongo class.
 * @extends {Emitter}
 */
class Mongo<K = string, V = null, IsUsingDatabaseProperties extends boolean = false> extends Emitter<IDatabaseEvents> {
    public ready = false

    public options: IMongoConnectionOptions
    public mongoClientOptions: MongoClientOptions

    public mongo: MongoClient

    public database: Db
    public collection: Collection<Document>

    private _utils = new Utils()

    public constructor(options: IMongoConnectionOptions) {
        super()

        if (!options?.connectionURI) {
            throw new DatabaseError(errors.connection.uri.notSpecified)
        }

        if (typeof options?.connectionURI !== 'string') {
            throw new DatabaseError(errors.connection.uri.invalid)
        }

        if (options?.collectionName && typeof options?.collectionName !== 'string') {
            throw new DatabaseError(
                errors.invalidType('options.collectionName', 'string', options?.collectionName)
            )
        }

        if (options?.dbName && typeof options?.dbName !== 'string') {
            throw new DatabaseError(
                errors.invalidType('options.dbName', 'string', options.dbName)
            )
        }

        if (options?.mongoClientOptions && typeof options?.mongoClientOptions !== 'object') {
            throw new DatabaseError(
                errors.invalidType('options.mongoClientOptions', 'object', options?.mongoClientOptions)
            )
        }

        this.options = options
        this.mongoClientOptions = options?.mongoClientOptions
    }

    /**
     * Connects to the database.
     * @returns {Promise<Collection<Document>>} If connected - MongoDB collection will be returned.
     */
    public async connect(): Promise<Collection<Document>> {
        if (this.ready) {
            throw new DatabaseError(errors.connection.alreadyConnected)
        }

        const mongoClient = new MongoClient(this.options.connectionURI, this.mongoClientOptions)
        this.emit('connecting')

        const mongo = await mongoClient.connect().catch((err: Error) => {
            if (err.message.toLowerCase().includes('bad auth')) {
                throw new DatabaseError(errors.connection.badAuth)
            }

            throw new DatabaseError(errors.connection.failedToConnect + err)
        })

        if (!mongo) {
            throw new DatabaseError(errors.connection.connectionFailure)
        }

        this.mongo = mongo

        this.database = mongo.db(this.options.dbName || 'db')
        this.collection = this.database.collection(this.options.collectionName || 'database')

        this.emit('ready', this.collection)
        this.ready = true

        return this.collection
    }

    /**
     * Closes the connection.
     * @returns {Promise<boolean>} If closed - true will be returned.
     */
    public async disconnect(): Promise<boolean> {
        if (!this.ready) {
            throw new DatabaseError(errors.connection.alreadyDestroyed)
        }

        this.ready = false

        await this.mongo.close()
        this.emit('destroy', this.mongo)

        return true
    }

    /**
     * Checks for the module updates.
     * @returns {Promise<IVersionData>} Is the module updated, latest version and installed version.
     */
    async checkUpdates(): Promise<IVersionData> {
        const version = modulePackage.version

        const packageData = await fetch('https://registry.npmjs.com/quick-mongo-super').then(res => res.json())

        if (version == packageData['dist-tags'].latest) return {
            updated: true,
            installedVersion: version,
            packageVersion: packageData['dist-tags'].latest
        }

        return {
            updated: false,
            installedVersion: version,
            packageVersion: packageData['dist-tags'].latest
        }
    }

    /**
     * Sends a read, write and delete requests to the database.
     * and returns the request latencies.
     * @returns {Promise<MongoLatency>} Database latency object.
     */
    public async ping(): Promise<MongoLatency> {
        let readLatency = -1
        let writeLatency = -1
        let deleteLatency = -1

        if (!this.ready) {
            throw new DatabaseError(errors.connection.noConnection)
        }

        // write latency checking
        const writeStartDate = Date.now()
        await this.set('___PING___' as any, 1 as any)

        writeLatency = Date.now() - writeStartDate

        // read latency checking
        const readStartDate = Date.now()
        await this.fetch<number>('___PING___' as any)

        readLatency = Date.now() - readStartDate

        // delete latency checking
        const deleteStartDate = Date.now()
        await this.delete('___PING___' as any)

        deleteLatency = Date.now() - deleteStartDate

        return {
            readLatency,
            writeLatency,
            deleteLatency
        }
    }

    /**
     * Checks if the element is existing in database.
     * @param {K} key The key in database.
     * @returns {Promise<boolean>} Is the element is existing in database.
     */
    public async has(key: K): Promise<boolean> {
        const data = await this.fetch(key)
        return !!data
    }

    /**
     * Checks if the element is existing in database.
     *
     * This method is an alias for `QuickMongo.has()` method.
     * @param {K} key The key in database.
     * @returns {Promise<boolean>} Is the element is existing in database.
     */
    public async includes(key: K): Promise<boolean> {
        return this.has(key)
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
     * @param {K} key The key in database..
     * @returns {Promise<T>} The random element in the array.
     */
    public async random<T>(key: K): Promise<T> {
        const array = await this.fetch<T[]>(key)

        if (!key) {
            throw new DatabaseError(
                errors.requiredParameterMissing('key')
            )
        }

        if (!Array.isArray(array)) {
            throw new DatabaseError(errors.target.notArray + typeof array)
        }

        return array[Math.floor(Math.random() * array.length)]
    }

    /**
    * Gets a list of keys in database.
    * @param {K} key The key in database..
    * @returns {Promise<string[]>} An array with all keys in database.
    */
    public async keysList(key = ''): Promise<string[]> {
        if (key == '') {
            const rawData = await this.raw()
            return rawData.map(obj => obj.__KEY)
        } else {
            const data = await this.find(key as any)
            return Object.keys(data).filter(key => data[key] !== undefined && data[key] !== null)
        }
    }

    /**
     * Fetches the data from the database.
     *
     * Type parameters:
     *
     * - T: The type of data that will be returned from database.
     *
     * @param {K} key The key in database..
     * @returns {Promise<T>} Value from the database.
     */
    public async fetch<T = V>(key: K): Promise<T> {
        if (!key && typeof key !== 'string') {
            throw new DatabaseError(
                errors.requiredParameterMissing('key')
            )
        }

        if (typeof key !== 'string') {
            throw new DatabaseError(errors.invalidTypes.key + typeof key)
        }

        let parsed = await this.all() as any

        const keys = key.split('.')
        let database = parsed

        for (let i = 0; i < keys.length; i++) {
            if (keys.length - 1 == i) {
                parsed = database?.[keys[i]] || null
            }

            database = database?.[keys[i]]
        }

        return parsed || null
    }

    /**
     * Sets data in a property in database.
     *
     * Type parameters:
     *
     * - T: The type of value to set for a specified key.
     * - P: The type of data inside the specified database property.
     *
     * @param {K} key The key in database..
     * @param {PropertyValue<T, V>} value Any data to set in property.
     * @returns {Promise<DatabaseReturnType<IsUsingDatabaseProperties, V, P>>} If set successfully: true; else: false
     */
    public async set<T = V, P = V>(key: K, value: PropertyValue<T, V>): Promise<
        DatabaseReturnType<IsUsingDatabaseProperties, V, P>
    > {
        const { isObject } = this._utils
        const fetched = await this.all() as any

        if (!key) {
            throw new DatabaseError(
                errors.requiredParameterMissing('key')
            )
        }

        if (typeof key !== 'string') {
            throw new DatabaseError(errors.invalidTypes.key + typeof key)
        }

        if (value == undefined) {
            throw new DatabaseError(
                errors.requiredParameterMissing('value')
            )
        }

        if (typeof value == 'function') {
            throw new DatabaseError(errors.invalidTypes.functionIsValue)
        }

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

        const data = await this.collection.findOne({
            __KEY: keys[0]
        })

        if (!data) {
            this.collection.insertOne({
                __KEY: keys[0],
                __VALUE: fetched[keys[0]]
            })
        }

        else {
            await this.collection.updateOne({
                __KEY: keys[0]
            }, {
                $set: {
                    __VALUE: fetched[keys[0]]
                }
            })
        }

        return fetched
    }

    /**
     * Removes the property from the existing object in database.
     *
     * Type parameters:
     *
     * - P: The type of data inside the specified database property.
     *
     * @param {K} key The key in database..
     * @returns {Promise<DatabaseReturnType<IsUsingDatabaseProperties, V, P>>} If cleared: true; else: false.
     */
    public async remove<P = V>(key: K): Promise<DatabaseReturnType<IsUsingDatabaseProperties, V, P>> {
        const { isObject } = this._utils
        const fetched = await this.all() as any

        if (!key) {
            throw new DatabaseError(
                errors.requiredParameterMissing('key')
            )
        }

        if (typeof key !== 'string') {
            throw new DatabaseError(errors.invalidTypes.key + typeof key)
        }

        const data = this.fetch<any>(key)

        if (data == null || data == undefined) {
            throw new DatabaseError(errors.target.empty)
        }

        const keys = key.split('.')
        let database = fetched as any

        for (let i = 0; i < keys.length; i++) {
            if (keys.length - 1 == i) {
                delete database?.[keys[i]]

            } else if (!isObject(database?.[keys[i]])) {
                database[keys[i]] = {}
            }

            database = database?.[keys[i]]
        }

        if (keys.length == 1) {
            await this.collection.deleteOne({
                __KEY: key
            })
        }

        else {
            await this.collection.updateOne({
                __KEY: keys[0]
            }, {
                $set: {
                    __VALUE: fetched[keys[0]]
                }
            })
        }

        return fetched
    }

    /**
     * Removes the property from the existing object in database.
     *
     * This method is an alias for `QuickMongo.remove()` method.
     *
     * Type parameters:
     *
     * - P: The type of data inside the specified database property.
     *
     * @param {K} key The key in database..
     * @returns {Promise<DatabaseReturnType<IsUsingDatabaseProperties, V, P>>} If cleared: true; else: false.
     */
    public async delete<P = V>(key: K): Promise<DatabaseReturnType<IsUsingDatabaseProperties, V, P>> {
        return this.remove(key)
    }

    /**
     * Clears the whole database.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    public async deleteAll(): Promise<boolean> {
        const keys = await this.keysList('')

        for (const key of keys) {
            await this.remove(key as any)
        }

        return true
    }

    /**
     * Clears the whole database.
     *
     * This method is an alias for `QuickMongo.deleteAll()` method.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    public clear(): Promise<boolean> {
        return this.deleteAll()
    }

    /**
     * Adds a number to a property data in database.
     *
     * [!!!] The target must be a number.
     *
     * Type parameters:
     *
     * - P: The type of data inside the specified database property.
     *
     * @param {K} key The key in database..
     * @param {number} value Any number to add.
     * @returns {Promise<DatabaseReturnType<IsUsingDatabaseProperties, V, P>>} If added successfully: true; else: false
     */
    public async add<P = V>(key: K, value: number): Promise<DatabaseReturnType<IsUsingDatabaseProperties, V, P>> {
        const data = (await this.fetch<number>(key)) || 0

        if (typeof value !== 'number') {
            throw new DatabaseError(errors.invalidTypes.valueNumber + typeof value)
        }

        if (typeof data !== 'number') {
            throw new DatabaseError(errors.target.notNumber + typeof data)
        }

        const result = await this.set(key, (data + value) as any)
        return result as any
    }

    /**
     * Subtracts a number from a property data in database.
     *
     * [!!!] The target must be a number.
     *
     * Type parameters:
     *
     * - P: The type of data inside the specified database property.
     *
     * @param {K} key The key in database..
     * @param {number} value Any number to subtract.
     * @returns {Promise<DatabaseReturnType<IsUsingDatabaseProperties, V, P>>} If set successfully: true; else: false
     */
    public async subtract<P = V>(key: K, value: number): Promise<DatabaseReturnType<IsUsingDatabaseProperties, V, P>> {
        const data = (await this.fetch<number>(key)) || 0

        if (typeof value !== 'number') {
            throw new DatabaseError(errors.invalidTypes.valueNumber + typeof value)
        }

        if (typeof data !== 'number') {
            throw new DatabaseError(errors.target.notNumber + typeof data)
        }

        const result = await this.set(key, (data - value) as any)
        return result as any
    }

    /**
     * Fetches the data from the database.
     *
     * This method is an alias for the `QuickMongo.fetch()` method.
     *
     * Type parameters:
     *
     * - T: The type of data that will be returned from database.
     *
     * @param {K} key The key in database..
     * @returns {Promise<T>} Value from the database.
     */
    public async find<T = V>(key: K): Promise<T> {
        return this.fetch<T>(key)
    }

    /**
     * Fetches the data from the database.
     *
     * This method is an alias for the `QuickMongo.fetch()` method.
     *
     * Type parameters:
     *
     * - T: The type of data that will be returned from database.
     *
     * @param {K} key The key in database..
     * @returns {Promise<T>} Value from the database.
     */
    public async get<T = V>(key: K): Promise<T> {
        return this.fetch<T>(key)
    }

    /**
     * Pushes a value to a specified array from the database.
     *
     * [!!!] The target must be an array.
     *
     * Type parameters:
     *
     * - T: The type of value to push in the array.
     * - P: The type of data inside the specified database property.
     *
     * @param {K} key The key in database..
     * @param {T} value The key in database.
     * @returns {Promise<DatabaseReturnType<IsUsingDatabaseProperties, V, P>>} If cleared: true; else: false.
     */
    public async push<T = V, P = V>(key: K, value: PropertyValue<T, V>): Promise<
        DatabaseReturnType<IsUsingDatabaseProperties, V, P>
    > {
        const array = (await this.fetch<T[]>(key)) || []

        if (array && !Array.isArray(array)) {
            throw new DatabaseError(errors.target.notArray + typeof array)
        }

        array.push(value as any)
        return this.set(key, array as any) as any
    }

    /**
     * Removes an element from a specified array in the database.
     *
     * [!!!] The target must be an array.
     *
     * Type parameters:
     *
     * - T: The type of value to remove from the array.
     * - P: The type of data inside the specified database property.
     *
     * @param {K} key The key in database..
     * @param {number} index The index in the array.
     * @returns {Promise<DatabaseReturnType<IsUsingDatabaseProperties, V, P>>} If cleared: true; else: false.
     */
    public async pop<T = V, P = V>(key: K, index: number): Promise<DatabaseReturnType<IsUsingDatabaseProperties, V, P>> {
        const array = await this.fetch<T[]>(key)

        if (!array) {
            throw new DatabaseError(errors.target.empty)
        }

        if (!Array.isArray(array)) {
            throw new DatabaseError(errors.target.notArray + typeof array)
        }

        array.splice(index, 1)
        return this.set<T[]>(key, array as any) as any
    }

    /**
     * Removes an element from a specified array in the database.
     *
     * [!!!] The target must be an array.
     *
     * This method is an alias for the `QuickMongo.pop()` method, for legacy reasons.
     *
     * Type parameters:
     *
     * - P: The type of data inside the specified database property.
     *
     * @param {K} key The key in database..
     * @param {number} index The index in the array.
     * @returns {Promise<DatabaseReturnType<IsUsingDatabaseProperties, V, P>>} If cleared: true; else: false.
     */
    public async removeElement<P = V>(key: K, index: number): Promise<DatabaseReturnType<IsUsingDatabaseProperties, V, P>> {
        return this.pop(key, index)
    }

    /**
     * Changes the specified element's value in a specified array in the database.
     *
     * [!!!] The target must be an array.
     *
     * Type parameters:
     *
     * - T: The type of element to change in the array.
     * - P: The type of data inside the specified database property.
     *
     * @param {K} key The key in database..
     * @param {number} index The index in the array.
     * @param {T} newValue The new value to set.
     * @returns {Promise<DatabaseReturnType<IsUsingDatabaseProperties, V, P>>} If cleared: true; else: false.
     */
    public async pull<T = V, P = V>(
        key: K,
        index: number,
        newValue: PropertyValue<T, V>
    ): Promise<DatabaseReturnType<IsUsingDatabaseProperties, V, P>> {
        const array = await this.fetch<T[]>(key)

        if (!array) {
            throw new DatabaseError(errors.target.empty)
        }

        if (!Array.isArray(array)) {
            throw new DatabaseError(errors.target.notArray + typeof array)
        }

        array.splice(index, 1, newValue as any)
        return this.set<T[]>(key, array as any) as any
    }

    /**
     * Changes the specified element's value in a specified array in the database.
     *
     * [!!!] The target must be an array.
     *
     * This method is an alias for the `QuickMongo.pull()` method, for legacy reasons.
     *
     * Type parameters:
     *
     * - T: The type of element to change in the array.
     * - P: The type of data inside the specified database property.
     *
     * @param {K} key The key in database..
     * @param {number} index The index in the array.
     * @param {T} newValue The new value to set.
     * @returns {Promise<DatabaseReturnType<IsUsingDatabaseProperties, V, P>>} If cleared: true; else: false.
     */
    public changeElement<T = V, P = V>(
        key: K,
        index: number,
        newValue: PropertyValue<T, V>
    ): Promise<DatabaseReturnType<IsUsingDatabaseProperties, V, P>> {
        return this.pull(key, index, newValue as any)
    }

    /**
     * Fetches the database contents.
     *
     * Type parameters:
     *
     * - P: The type of data inside all the database properties.
     *
     * @returns {Promise<DatabaseReturnType<IsUsingDatabaseProperties, Record<string, any>, P>>} Database contents.
     */
    public async all<
        P = Record<string, any>,
        UseDatabaseProperties extends boolean = IsUsingDatabaseProperties
    >(): Promise<DatabaseReturnType<UseDatabaseProperties, P, P>> {
        if (!this.ready) {
            throw new DatabaseError(errors.connection.noConnection)
        }

        const obj: Record<any, any> = {}
        const elements = await this.raw() || []

        for (const element of elements) {
            obj[element.__KEY] = element.__VALUE
        }

        return obj
    }

    /**
     * Fetches the raw databas contents.
     *
     * Type parameters:
     *
     * - P: The type of `__VALUE` property for every raw database entry.
     *
     * @returns {Promise<IDatabaseObject<P>[]>} Raw database contents.
     */
    public async raw<P = V>(): Promise<IDatabaseObject<P>[]> {
        if (!this.ready) {
            throw new DatabaseError(errors.connection.noConnection)
        }

        const rawData = this.collection.find()
        const rawArray: any[] = await rawData.toArray()

        rawArray.map(element => delete element._id)
        return rawArray
    }
}

export = Mongo
