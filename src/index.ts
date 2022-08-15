import {
    MongoClient, MongoClientOptions,
    Db, Collection, Document
} from 'mongodb'

import fetch from 'node-fetch'

import Emitter from './classes/Emitter'
import DatabaseError from './classes/DatabaseError'
import Utils from './classes/Utils'

import errors from './errors'

import {
    MongoConnectionOptions,
    DatabaseObject, DatabaseProperties,
    VersionData, MongoLatencyData
} from './interfaces/QuickMongo'

import modulePackage from '../package.json'

/**
 * QuickMongo class.
 * @param {MongoConnectionOptions} options MongoDB connection options.
 */
class Mongo extends Emitter {
    public ready = false

    public options: MongoConnectionOptions
    public mongoClientOptions: MongoClientOptions

    public mongo: MongoClient

    public database: Db
    public collection: Collection<Document>

    private utils = new Utils()

    constructor(options: MongoConnectionOptions) {
        super()

        if (!options.connectionURI) {
            throw new DatabaseError(errors.connection.uri.notSpecified)
        }

        if (typeof options.connectionURI !== 'string') {
            throw new DatabaseError(errors.connection.uri.invalid)
        }

        if (options.collectionName && typeof options.collectionName !== 'string') {
            throw new DatabaseError(
                errors.invalidType('options.collectionName', 'string', options.collectionName)
            )
        }

        if (options.dbName && typeof options.dbName !== 'string') {
            throw new DatabaseError(
                errors.invalidType('options.dbName', 'string', options.dbName)
            )
        }

        if (options.mongoClientOptions && typeof options.mongoClientOptions !== 'object') {
            throw new DatabaseError(
                errors.invalidType('options.mongoClientOptions', 'object', options.mongoClientOptions)
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
    * @returns {Promise<VersionData>} Is the module updated, latest version and installed version.
    */
    async checkUpdates(): Promise<VersionData> {
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
     * Sends a read, write and delete request to the database
     * and returns the request latencies.
     * @returns {Promise<MongoLatencyData>} Database latency object.
     */
    public async ping(): Promise<MongoLatencyData> {
        let readLatency = -1
        let writeLatency = -1
        let deleteLatency = -1

        if (!this.ready) {
            throw new DatabaseError(errors.connection.noConnection)
        }

        // write latency checking
        const writeStartDate = Date.now()
        await this.set('___PING___', 1)

        writeLatency = Date.now() - writeStartDate

        // read latency checking
        const readStartDate = Date.now()
        await this.fetch<number>('___PING___')

        readLatency = Date.now() - readStartDate

        // delete latency checking
        const deleteStartDate = Date.now()
        await this.delete('___PING___')

        deleteLatency = Date.now() - deleteStartDate

        return {
            readLatency,
            writeLatency,
            deleteLatency
        }
    }

    /**
     * Checks if the element is existing in database.
     * @param {string} key The key in database
     * @returns {Promise<boolean>} Is the element is existing in database.
     */
    public async has(key: string): Promise<boolean> {
        const data = await this.fetch(key)
        return !!data
    }

    /**
     * Checks if the element is existing in database.
     * 
     * This method is an alias for `QuickMongo.has()` method.
     * @param {string} key The key in database
     * @returns {Promise<boolean>} Is the element is existing in database.
     */
    public async includes(key: string): Promise<boolean> {
        return this.has(key)
    }

    /**
     * Gets the random element of array in database.
     * 
     * [!!!] The target must be an array.
     * @param {string} key The key in database.
     * @returns {T} The random element in array.
     */
    public async random<T = any>(key: string): Promise<T> {
        const array = await this.fetch<T[]>(key)

        if (!array) {
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
    * @param {string} key The key in database.
    * @returns {Promise<string[]>} An array with all keys in database.
    */
    public async keysList(key: string): Promise<string[]> {
        const data = await this.find(key)

        if (key == '') {
            const rawData = await this.raw()
            return rawData.map(obj => obj.__KEY)
        }

        return Object.keys(data).filter(key => data[key] !== undefined && data[key] !== null)
    }

    /**
     * Fetches the data from the database.
     * @param {string} key The key in database.
     * @returns {Promise<T>} Value from the database.
     */
    public async fetch<T = any>(key: string): Promise<T> {
        if (!key) {
            throw new DatabaseError(
                errors.requiredParameterMissing('key')
            )
        }

        if (typeof key !== 'string') {
            throw new DatabaseError(errors.invalidTypes.key + typeof key)
        }

        let parsed = await this.all() as T

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
     * @param {string} key The key in database.
     * @param {T} value Any data to set in property.
     * @returns {Promise<DatabaseProperties>} If set successfully: true; else: false
     */
    public async set<T = any, P = any>(key: string, value: T): Promise<DatabaseProperties<P>> {
        const { isObject } = this.utils
        const fetched = await this.all()

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
        let database = fetched

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
    * @param {string} key The key in database.
    * @returns {Promise<DatabaseProperties>} If cleared: true; else: false.
    */
    public async remove<P = any>(key: string): Promise<DatabaseProperties<P>> {
        const { isObject } = this.utils
        const fetched = await this.all()

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
        let database = fetched

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
     * @param {string} key The key in database.
     * @returns {Promise<DatabaseProperties>} If cleared: true; else: false.
     */
    public async delete<T = any>(key: string): Promise<DatabaseProperties<T>> {
        return this.remove(key)
    }

    /**
     * Clears the whole database.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    public async deleteAll(): Promise<boolean> {
        const keys = await this.keysList('')

        for (const key of keys) {
            await this.remove(key)
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
     * @param {string} key The key in database.
     * @param {number} value Any number to add.
     * @returns {Promise<DatabaseProperties>} If added successfully: true; else: false
     */
    public async add<T = any>(key: string, value: number): Promise<DatabaseProperties<T>> {
        const data = (await this.fetch<number>(key)) || 0

        if (typeof value !== 'number') {
            throw new DatabaseError(errors.invalidTypes.valueNumber + typeof value)
        }

        if (typeof data !== 'number') {
            throw new DatabaseError(errors.target.notNumber + typeof data)
        }

        const result = await this.set(key, data + value)
        return result
    }

    /**
     * Subtracts a number from a property data in database.
     * 
     * [!!!] The target must be a number.
     * @param {string} key The key in database.
     * @param {number} value Any number to subtract.
     * @returns {Promise<DatabaseProperties>} If set successfully: true; else: false
     */
    public async subtract<P = any>(key: string, value: number): Promise<DatabaseProperties<P>> {
        const data = (await this.fetch<number>(key)) || 0

        if (typeof value !== 'number') {
            throw new DatabaseError(errors.invalidTypes.valueNumber + typeof value)
        }

        if (typeof data !== 'number') {
            throw new DatabaseError(errors.target.notNumber + typeof data)
        }

        const result = await this.set(key, data - value)
        return result
    }

    /**
     * Fetches the data from the database.
     * 
     * This method is an alias for the `QuickMongo.fetch()` method.
     * @param {string} key The key in database.
     * @returns {Promise<T>} Value from the database.
     */
    public async find<T = any>(key: string): Promise<T> {
        return this.fetch<T>(key)
    }

    /**
     * Fetches the data from the database.
     * 
     * This method is an alias for the `QuickMongo.fetch()` method.
     * @param {string} key The key in database.
     * @returns {Promise<T>} Value from the database.
     */
    public async get<T = any>(key: string): Promise<T> {
        return this.fetch<T>(key)
    }

    /**
     * Pushes a value to a specified array from the database.
     * 
     * [!!!] The target must be an array.
     * @param {string} key The key in database.
     * @param {T} value The key in database.
     * @returns {Promise<DatabaseProperties>} If cleared: true; else: false.
     */
    public async push<T = any, P = any>(key: string, value: T): Promise<DatabaseProperties<P>> {
        const array = (await this.fetch<T[]>(key)) || []

        if (array && !Array.isArray(array)) {
            throw new DatabaseError(errors.target.notArray + typeof array)
        }

        array.push(value)
        return this.set<T[]>(key, array)
    }

    /**
     * Removes an element from a specified array in the database.
     * 
     * [!!!] The target must be an array.
     * @param {string} key The key in database.
     * @param {number} index The index in the array.
     * @returns {Promise<DatabaseProperties>} If cleared: true; else: false.
     */
    public async pop<T = any, P = any>(key: string, index: number): Promise<DatabaseProperties<P>> {
        const array = await this.fetch<T[]>(key)

        if (!array) {
            throw new DatabaseError(errors.target.empty)
        }

        if (!Array.isArray(array)) {
            throw new DatabaseError(errors.target.notArray + typeof array)
        }

        array.splice(index, 1)
        return this.set<T[]>(key, array)
    }

    /**
     * Removes an element from a specified array in the database.
     * 
     * [!!!] The target must be an array.
     * 
     * This method is an alias for the `QuickMongo.pop()` method.
     * @param {string} key The key in database.
     * @param {number} index The index in the array.
     * @returns {Promise<DatabaseProperties>} If cleared: true; else: false.
     */
    public async removeElement<P = any>(key: string, index: number): Promise<DatabaseProperties<P>> {
        return this.pop(key, index)
    }

    /**
    * Changes the specified element's value in a specified array in the database.
    * 
    * [!!!] The target must be an array.
    * @param {string} key The key in database.
    * @param {number} index The index in the array.
    * @param {T} newValue The new value to set.
    * @returns {Promise<DatabaseProperties>} If cleared: true; else: false.
    */
    public async pull<T = any, P = any>(key: string, index: number, newValue: T): Promise<DatabaseProperties<P>> {
        const array = await this.fetch<T[]>(key)

        if (!array) {
            throw new DatabaseError(errors.target.empty)
        }

        if (!Array.isArray(array)) {
            throw new DatabaseError(errors.target.notArray + typeof array)
        }

        array.splice(index, 1, newValue)
        return this.set<T[]>(key, array)
    }

    /**
    * Changes the specified element's value in a specified array in the database.
    * 
    * [!!!] The target must be an array.
    * 
    * This method is an alias for the `QuickMongo.pull()` method.
    * @param {string} key The key in database.
    * @param {number} index The index in the array.
    * @param {T} newValue The new value to set.
    * @returns {Promise<DatabaseProperties>} If cleared: true; else: false.
    */
    public changeElement<T = any, P = any>(key: string, index: number, newValue: T): Promise<DatabaseProperties<P>> {
        return this.pull(key, index, newValue)
    }

    /**
    * Fetches the entire database.
    * @returns {Promise<DatabaseProperties>} Database contents
    */
    public async all<P = any>(): Promise<DatabaseProperties<P>> {
        if (!this.ready) {
            throw new DatabaseError(errors.connection.noConnection)
        }

        const obj = {}
        const elements = await this.raw() || []

        for (const element of elements) {
            obj[element.__KEY] = element.__VALUE
        }

        return obj
    }

    /**
    * Fetches the raw content of database.
    * @returns {Promise<DatabaseObject[]>} Database contents
    */
    public async raw<P = any>(): Promise<DatabaseObject<P>[]> {
        if (!this.ready) {
            throw new DatabaseError(errors.connection.noConnection)
        }

        const rawData = this.collection.find()
        const rawArray = await rawData.toArray() as any[]

        rawArray.map((element: any) => delete element._id)
        return rawArray
    }
}

export = Mongo