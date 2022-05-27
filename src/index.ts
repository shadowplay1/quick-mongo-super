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

class Mongo extends Emitter {
    public ready: boolean = false

    public options: MongoConnectionOptions
    public mongoClientOptions: MongoClientOptions

    public mongo: MongoClient

    public database: Db
    public collection: Collection<Document>

    private utils: Utils = new Utils()


    /**
     * QuickMongo class.
     * @param {MongoConnectionOptions} options MongoDB connection options.
     */
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
    public connect(): Promise<Collection<Document>> {
        return new Promise((resolve, reject) => {
            if (this.ready) {
                throw new DatabaseError(errors.connection.alreadyConnected)
            }

            const mongoClient = new MongoClient(this.options.connectionURI, this.mongoClientOptions)
            this.emit('connecting')


            mongoClient.connect((err, mongo) => {
                if (err) {
                    reject(new DatabaseError(errors.connection.failedToConnect + err))
                }

                if (!mongo.db) {
                    throw new DatabaseError(errors.connection.connectionFailure)
                }


                this.mongo = mongo

                this.database = mongo.db(this.options.dbName || 'db')
                this.collection = this.database.collection(this.options.collectionName || 'database')

                this.emit('ready', this.collection)
                this.ready = true

                resolve(this.collection)
            })
        })
    }

    /**
    * Closes the connection.
    * @returns {Promise<Boolean>} If closed - true will be returned.
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
        const version = require('../../package.json').version

        const packageData = await fetch('https://registry.npmjs.com/quick-mongo-super')
            .then(text => text.json())

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
     * @param {String} key The key in database
     * @returns {Promise<Boolean>} Is the element is existing in database.
     */
    public async has(key: string): Promise<boolean> {
        const data = await this.fetch(key)
        return !!data
    }

    /**
     * Checks if the element is existing in database.
     * 
     * This method is an alias for `QuickMongo.has()` method.
     * @param {String} key The key in database
     * @returns {Promise<Boolean>} Is the element is existing in database.
     */
    public async includes(key: string): Promise<boolean> {
        return this.has(key)
    }

    /**
     * Gets the random element of array in database.
     * 
     * [!!!] The target must be an array.
     * @param {String} key The key in database.
     * @returns {K} The random element in array.
     */
    public async random<T>(key: string): Promise<T> {
        const array = await this.fetch<any[]>(key)

        if (!array) return null

        if (!Array.isArray(array)) {
            throw new DatabaseError(errors.target.notArray + typeof array)
        }

        return array[Math.floor(Math.random() * array.length)]
    }

    /**
    * Gets a list of keys in database.
    * @param {String} key The key in database.
    * @returns {Promise<String[]>} An array with all keys in database or 'null' if nothing found.
    */
    public async keysList(key: string): Promise<string[]> {
        const data = await this.find(key)

        if (key == '') {
            const rawData = await this.raw()

            return rawData.map(obj => obj.__KEY)
        }

        return Object.keys(data)
            .filter(key => data[key] !== undefined && data[key] !== null)
    }


    /**
     * Fetches the data from the database.
     * @param {String} key The key in database.
     * @returns {Promise<T>} Value from the specified key or 'false' if failed to read or 'null' if nothing found.
     */
    public async fetch<T>(key: string): Promise<T> {
        if (!key && typeof key !== 'string') {
            throw new DatabaseError(errors.notSpecified.key)
        }

        if (typeof key !== 'string') {
            throw new DatabaseError(errors.invalidTypes.key + typeof key)
        }


        let parsed = await this.all() as T

        const keys = key.split('.')
        let tmp = parsed

        for (let i = 0; i < keys.length; i++) {
            if ((keys.length - 1) == i) {
                parsed = tmp?.[keys[i]] || null
            }

            tmp = tmp?.[keys[i]]
        }

        return parsed || null
    }

    /**
     * Sets data in a property in database.
     * @param {String} key The key in database.
     * @param {T} value Any data to set in property.
     * @returns {Promise<Boolean>} If set successfully: true; else: false
     */
    public async set<T>(key: string, value: T): Promise<boolean> {
        const { isObject } = this.utils
        const storageData = await this.all()

        if (!key) {
            throw new DatabaseError(errors.notSpecified.key)
        }

        if (typeof key !== 'string') {
            throw new DatabaseError(errors.invalidTypes.key + typeof key)
        }

        if (value == undefined) {
            throw new DatabaseError(errors.notSpecified.value)
        }

        if (typeof value == 'function') {
            throw new DatabaseError(errors.invalidTypes.value)
        }


        const keys = key.split('.')
        let tmp = storageData

        for (let i = 0; i < keys.length; i++) {

            if ((keys.length - 1) == i) {
                tmp[keys[i]] = value

            } else if (!isObject(tmp[keys[i]])) {
                tmp[keys[i]] = {}
            }

            tmp = tmp?.[keys[i]]
        }

        const data = await this.collection.findOne({
            __KEY: keys[0]
        })

        if (!data) {
            this.collection.insertOne({
                __KEY: keys[0],
                __VALUE: storageData[keys[0]]
            })
        }

        else {
            await this.collection.updateOne({
                __KEY: keys[0]
            }, {
                $set: {
                    __VALUE: storageData[keys[0]]
                }
            })
        }

        return true
    }

    /**
    * Removes the property from the existing object in database.
    * @param {String} key The key in database.
    * @returns {Promise<Boolean>} If cleared: true; else: false.
    */
    public async remove(key: string): Promise<boolean> {
        const { isObject } = this.utils
        const storageData = await this.all()

        if (!key) {
            throw new DatabaseError(errors.notSpecified.key)
        }

        if (typeof key !== 'string') {
            throw new DatabaseError(errors.invalidTypes.key + typeof key)
        }

        const data = this.fetch<any>(key)
        if (data == null) return false

        const keys = key.split('.')
        let tmp = storageData

        for (let i = 0; i < keys.length; i++) {
            if ((keys.length - 1) == i) {
                delete tmp?.[keys[i]]

            } else if (!isObject(tmp?.[keys[i]])) {
                tmp[keys[i]] = {}
            }

            tmp = tmp?.[keys[i]]
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
                    __VALUE: storageData[keys[0]]
                }
            })
        }

        return true
    }

    /**
     * Removes the property from the existing object in database.
     * 
     * This method is an alias for `QuickMongo.remove()` method.
     * @param {String} key The key in database.
     * @returns {Promise<Boolean>} If cleared: true; else: false.
     */
    public async delete(key: string): Promise<boolean> {
        return this.remove(key)
    }

    /**
     * Adds a number to a property data in database.
     * 
     * [!!!] The target must be a number.
     * @param {String} key The key in database.
     * @param {Number} value Any number to add.
     * @returns {Promise<Boolean>} If added successfully: true; else: false
     */
    public async add(key: string, value: number): Promise<boolean> {
        let data = await this.fetch<number>(key)

        if (value == undefined) {
            throw new DatabaseError(errors.notSpecified.value)
        }

        if (typeof value !== 'number') {
            throw new DatabaseError(errors.invalidTypes.valueNumber + typeof value)
        }

        if (!data) {
            data = value
        }

        if (typeof data !== 'number') {
            throw new DatabaseError(errors.target.notNumber + typeof data)
        }

        await this.set(key, data + value)
        return true
    }

    /**
     * Subtracts a number from a property data in database.
     * 
     * [!!!] The target must be a number.
     * @param {String} key The key in database.
     * @param {Number} value Any number to subtract.
     * @returns {Promise<Boolean>} If set successfully: true; else: false
     */
    public async subtract(key: string, value: number): Promise<boolean> {
        let data = await this.fetch<number>(key)

        if (value == undefined) {
            throw new DatabaseError(errors.notSpecified.value)
        }

        if (typeof value !== 'number') {
            throw new DatabaseError(errors.invalidTypes.valueNumber + typeof value)
        }

        if (!data) {
            data = -value
        }

        if (typeof data !== 'number') {
            throw new DatabaseError(errors.target.notNumber + typeof data)
        }

        await this.set(key, data - value)
        return true
    }

    /**
     * Fetches the data from the database.
     * 
     * This method is an alias for the `QuickMongo.fetch()` method.
     * @param {String} key The key in database.
     * @returns {Promise<T>} Value from the specified key or 'false' if failed to read or 'null' if nothing found.
     */
    public async find<T>(key: string): Promise<T> {
        return this.fetch<T>(key)
    }

    /**
     * Fetches the data from the database.
     * 
     * This method is an alias for the `QuickMongo.fetch()` method.
     * @param {String} key The key in database.
     * @returns {Promise<T>} Value from the specified key or 'false' if failed to read or 'null' if nothing found.
     */
    public async get<T>(key: string): Promise<T> {
        return this.fetch<T>(key)
    }

    /**
     * Pushes a value to a specified array from the database.
     * 
     * [!!!] The target must be an array.
     * @param {String} key The key in database.
     * @param {T} value The key in database.
     * @returns {Promise<Boolean>} If cleared: true; else: false.
     */
    public async push<T>(key: string, value: T): Promise<boolean> {
        let array = await this.fetch<any[]>(key)

        if (!value) {
            throw new DatabaseError(errors.notSpecified.value)
        }

        if (!array) {
            await this.set(key, [value])
            array = [value]
        }

        if (!Array.isArray(array)) {
            throw new DatabaseError(errors.target.notArray + typeof array)
        }

        array.push(value)
        return this.set<any>(key, array)
    }

    /**
     * Removes an element from a specified array in the database.
     * 
     * [!!!] The target must be an array.
     * @param {String} key The key in database.
     * @param {Number} index The index in the array.
     * @returns {Promise<Boolean>} If cleared: true; else: false.
     */
    public async removeElement(key: string, index: number): Promise<boolean> {
        const array = await this.fetch<any[]>(key)

        if (!array) return false

        if (!Array.isArray(array)) {
            throw new DatabaseError(errors.target.notArray + typeof array)
        }

        array.splice(index, 1)
        return this.set<any>(key, array)
    }

    /**
     * Removes an element from a specified array in the database.
     * 
     * [!!!] The target must be an array.
     * 
     * This method is an alias for the `QuickMongo.removeElement()` method.
     * @param {String} key The key in database.
     * @param {Number} index The index in the array.
     * @returns {Promise<Boolean>} If cleared: true; else: false.
     */
    public async deleteElement(key: string, index: number): Promise<boolean> {
        return this.removeElement(key, index)
    }

    /**
    * Changes the specified element's value in a specified array in the database.
    * 
    * [!!!] The target must be an array.
    * @param {String} key The key in database.
    * @param {Number} index The index in the array.
    * @param {T} newValue The new value to set.
    * @returns {Promise<Boolean>} If cleared: true; else: false.
    */
    public async changeElement<T>(key: string, index: number, newValue: T): Promise<boolean> {
        const array = await this.fetch<any[]>(key)

        if (!array) return false

        if (!Array.isArray(array)) {
            throw new DatabaseError(errors.target.notArray + typeof array)
        }

        array.splice(index, 1, newValue)
        return this.set<any>(key, array)
    }

    /**
    * Fetches the entire database.
    * @returns {Promise<DatabaseProperties>} Database contents
    */
    public async all(): Promise<DatabaseProperties> {
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
    public async raw(): Promise<DatabaseObject[]> {
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