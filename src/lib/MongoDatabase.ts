import { Emitter } from './utils/Emitter'
import { QuickMongoError } from './utils/QuickMongoError'

import errors from '../structures/errors'

import { IQuickMongoEvents, IClientConnectionConfiguration } from '../types/QuickMongo'

/**
 * QuickMongo class.
 * @extends {Emitter}
 */
export class MongoDatabase<K = string, V = null> extends Emitter<IQuickMongoEvents> {
    public cache: Map<string, Set<any>> = new Map()

    public constructor(options: IClientConnectionConfiguration) {
        super()
    }

    /**
     * Connects to the database.
     * @returns {Promise<any>} If connected - MongoDB collection will be returned.
     */
    public async connect(): Promise<any> {
        //
    }

    /**
     * Closes the connection.
     * @returns {Promise<any>} If closed - true will be returned.
     */
    public async disconnect(): Promise<any> {
        //
    }

    /**
     * Checks for the module updates.
     * @returns {Promise<any>} Is the module updated, latest version and installed version.
     */
    async checkUpdates(): Promise<any> {
        //
    }

    /**
     * Sends a read, write and delete requests to the database.
     * and returns the request latencies.
     * @returns {Promise<MongoLatency>} Database latency object.
     */
    public async ping(): Promise<MongoLatency> {
        //
    }

    /**
     * Checks if the element is existing in database.
     * @param {K} key The key in database.
     * @returns {Promise<any>} Is the element is existing in database.
     */
    public async has(key: K): Promise<any> {
        //
    }

    /**
     * Checks if the element is existing in database.
     *
     * This method is an alias for `QuickMongo.has()` method.
     * @param {K} key The key in database.
     * @returns {Promise<any>} Is the element is existing in database.
     */
    public async includes(key: K): Promise<any> {
        //
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
     * @returns {Promise<any>} The random element in the array.
     */
    public async random<T>(key: K): Promise<any> {
        //
    }

    /**
    * Gets a list of keys in database.
    * @param {K} key The key in database..
    * @returns {Promise<any>} An array with all keys in database.
    */
    public async keysList(key = ''): Promise<any> {
        //
    }

    /**
     * Fetches the data from the database.
     *
     * Type parameters:
     *
     * - T: The type of data that will be returned from database.
     *
     * @param {K} key The key in database..
     * @returns {Promise<any>} Value from the database.
     */
    public async fetch<T = V>(key: K): Promise<any> {
        //
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
     * @returns {Promise<any>} If set successfully: true; else: false
     */
    public async set<T = V>(key: K, value: PropertyValue<T, V>): Promise<any> {
        //
    }

    /**
     * Removes the property from the existing object in database.
     *
     * Type parameters:
     *
     * - P: The type of data inside the specified database property.
     *
     * @param {K} key The key in database..
     * @returns {Promise<any>} If cleared: true; else: false.
     */
    public async remove(key: K): Promise<any> {
        //
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
     * @returns {Promise<any>} If cleared: true; else: false.
     */
    public async delete(key: K): Promise<any> {
        //
    }

    /**
     * Clears the whole database.
     * @returns {Promise<any>} If cleared: true; else: false.
     */
    public async deleteAll(): Promise<any> {
        //
    }

    /**
     * Clears the whole database.
     *
     * This method is an alias for `QuickMongo.deleteAll()` method.
     * @returns {Promise<any>} If cleared: true; else: false.
     */
    public clear(): Promise<any> {
        //
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
     * @returns {Promise<any>} If added successfully: true; else: false
     */
    public async add(key: K, value: number): Promise<any> {
        //
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
     * @returns {Promise<any>} If set successfully: true; else: false
     */
    public async subtract(key: K, value: number): Promise<any> {
        //
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
     * @returns {Promise<any>} Value from the database.
     */
    public async find<T = V>(key: K): Promise<any> {
        //
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
     * @returns {Promise<any>} Value from the database.
     */
    public async get<T = V>(key: K): Promise<any> {
        //
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
     * @returns {Promise<any>} If cleared: true; else: false.
     */
    public async push<T = V>(key: K, value: PropertyValue<T, V>): Promise<
        any
    > {
        //
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
     * @returns {Promise<any>} If cleared: true; else: false.
     */
    public async pop<T = V>(key: K, index: number): Promise<any> {
        //
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
     * @returns {Promise<any>} If cleared: true; else: false.
     */
    public async pull<T = V>(
        key: K,
        index: number,
        newValue: PropertyValue<T, V>
    ): Promise<any> {
        //
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
    public async all(): Promise<any> {
        //
    }

    /**
     * Fetches the raw databas contents.
     *
     * Type parameters:
     *
     * - P: The type of `__VALUE` property for every raw database entry.
     *
     * @returns {Promise<any>} Raw database contents.
     */
    public async raw(): Promise<any> {
        //
    }
}
