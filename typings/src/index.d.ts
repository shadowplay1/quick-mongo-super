import { MongoClient, MongoClientOptions, Db, Collection, Document } from 'mongodb';
import Emitter from './classes/Emitter';
import { MongoConnectionOptions, DatabaseObject, DatabaseProperties, VersionData, MongoLatencyData } from './interfaces/QuickMongo';
/**
 * QuickMongo class.
 * @param {MongoConnectionOptions} options MongoDB connection options.
 */
declare class Mongo extends Emitter {
    ready: boolean;
    options: MongoConnectionOptions;
    mongoClientOptions: MongoClientOptions;
    mongo: MongoClient;
    database: Db;
    collection: Collection<Document>;
    private utils;
    constructor(options: MongoConnectionOptions);
    /**
     * Connects to the database.
     * @returns {Promise<Collection<Document>>} If connected - MongoDB collection will be returned.
     */
    connect(): Promise<Collection<Document>>;
    /**
    * Closes the connection.
    * @returns {Promise<boolean>} If closed - true will be returned.
    */
    disconnect(): Promise<boolean>;
    /**
    * Checks for the module updates.
    * @returns {Promise<VersionData>} Is the module updated, latest version and installed version.
    */
    checkUpdates(): Promise<VersionData>;
    /**
     * Sends a read, write and delete request to the database
     * and returns the request latencies.
     * @returns {Promise<MongoLatencyData>} Database latency object.
     */
    ping(): Promise<MongoLatencyData>;
    /**
     * Checks if the element is existing in database.
     * @param {string} key The key in database
     * @returns {Promise<boolean>} Is the element is existing in database.
     */
    has(key: string): Promise<boolean>;
    /**
     * Checks if the element is existing in database.
     *
     * This method is an alias for `QuickMongo.has()` method.
     * @param {string} key The key in database
     * @returns {Promise<boolean>} Is the element is existing in database.
     */
    includes(key: string): Promise<boolean>;
    /**
     * Gets the random element of array in database.
     *
     * [!!!] The target must be an array.
     * @param {string} key The key in database.
     * @returns {T} The random element in array.
     */
    random<T = any>(key: string): Promise<T>;
    /**
    * Gets a list of keys in database.
    * @param {string} key The key in database.
    * @returns {Promise<string[]>} An array with all keys in database.
    */
    keysList(key: string): Promise<string[]>;
    /**
     * Fetches the data from the database.
     * @param {string} key The key in database.
     * @returns {Promise<T>} Value from the database.
     */
    fetch<T = any>(key: string): Promise<T>;
    /**
     * Sets data in a property in database.
     * @param {string} key The key in database.
     * @param {T} value Any data to set in property.
     * @returns {Promise<DatabaseProperties>} If set successfully: true; else: false
     */
    set<T = any, P = any>(key: string, value: T): Promise<DatabaseProperties<P>>;
    /**
    * Removes the property from the existing object in database.
    * @param {string} key The key in database.
    * @returns {Promise<DatabaseProperties>} If cleared: true; else: false.
    */
    remove<P = any>(key: string): Promise<DatabaseProperties<P>>;
    /**
     * Removes the property from the existing object in database.
     *
     * This method is an alias for `QuickMongo.remove()` method.
     * @param {string} key The key in database.
     * @returns {Promise<DatabaseProperties>} If cleared: true; else: false.
     */
    delete<T = any>(key: string): Promise<DatabaseProperties<T>>;
    /**
     * Clears the whole database.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    deleteAll(): Promise<boolean>;
    /**
     * Clears the whole database.
     *
     * This method is an alias for `QuickMongo.deleteAll()` method.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    clear(): Promise<boolean>;
    /**
     * Adds a number to a property data in database.
     *
     * [!!!] The target must be a number.
     * @param {string} key The key in database.
     * @param {number} value Any number to add.
     * @returns {Promise<DatabaseProperties>} If added successfully: true; else: false
     */
    add<T = any>(key: string, value: number): Promise<DatabaseProperties<T>>;
    /**
     * Subtracts a number from a property data in database.
     *
     * [!!!] The target must be a number.
     * @param {string} key The key in database.
     * @param {number} value Any number to subtract.
     * @returns {Promise<DatabaseProperties>} If set successfully: true; else: false
     */
    subtract<P = any>(key: string, value: number): Promise<DatabaseProperties<P>>;
    /**
     * Fetches the data from the database.
     *
     * This method is an alias for the `QuickMongo.fetch()` method.
     * @param {string} key The key in database.
     * @returns {Promise<T>} Value from the database.
     */
    find<T = any>(key: string): Promise<T>;
    /**
     * Fetches the data from the database.
     *
     * This method is an alias for the `QuickMongo.fetch()` method.
     * @param {string} key The key in database.
     * @returns {Promise<T>} Value from the database.
     */
    get<T = any>(key: string): Promise<T>;
    /**
     * Pushes a value to a specified array from the database.
     *
     * [!!!] The target must be an array.
     * @param {string} key The key in database.
     * @param {T} value The key in database.
     * @returns {Promise<DatabaseProperties>} If cleared: true; else: false.
     */
    push<T = any, P = any>(key: string, value: T): Promise<DatabaseProperties<P>>;
    /**
     * Removes an element from a specified array in the database.
     *
     * [!!!] The target must be an array.
     * @param {string} key The key in database.
     * @param {number} index The index in the array.
     * @returns {Promise<DatabaseProperties>} If cleared: true; else: false.
     */
    pop<T = any, P = any>(key: string, index: number): Promise<DatabaseProperties<P>>;
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
    removeElement<P = any>(key: string, index: number): Promise<DatabaseProperties<P>>;
    /**
    * Changes the specified element's value in a specified array in the database.
    *
    * [!!!] The target must be an array.
    * @param {string} key The key in database.
    * @param {number} index The index in the array.
    * @param {T} newValue The new value to set.
    * @returns {Promise<DatabaseProperties>} If cleared: true; else: false.
    */
    pull<T = any, P = any>(key: string, index: number, newValue: T): Promise<DatabaseProperties<P>>;
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
    changeElement<T = any, P = any>(key: string, index: number, newValue: T): Promise<DatabaseProperties<P>>;
    /**
    * Fetches the entire database.
    * @returns {Promise<DatabaseProperties>} Database contents
    */
    all<P = any>(): Promise<DatabaseProperties<P>>;
    /**
    * Fetches the raw content of database.
    * @returns {Promise<DatabaseObject[]>} Database contents
    */
    raw<P = any>(): Promise<DatabaseObject<P>[]>;
}
export = Mongo;
