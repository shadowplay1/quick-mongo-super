import { MongoClient, Db, Collection, Document } from 'mongodb';
import Emitter from './classes/Emitter';
import { MongoConnectionOptions, DatabaseObject, AnyObject, MongoPingData } from './interfaces/QuickMongo';
declare class Mongo extends Emitter {
    ready: boolean;
    options: MongoConnectionOptions;
    mongo: MongoClient;
    database: Db;
    collection: Collection<Document>;
    private utils;
    /**
     * QuickMongo class.
     * @param {MongoConnectionOptions} options MongoDB connection options.
     */
    constructor(options: MongoConnectionOptions);
    /**
     * Connects to the database.
     * @returns {Promise<Collection<Document>>} If connected - MongoDB collection will be returned.
     */
    connect(): Promise<Collection<Document>>;
    /**
    * Closes the connection.
    * @returns {Promise<Boolean>} If closed - true will be returned.
    */
    disconnect(): Promise<boolean>;
    /**
     * Sends a read, write and delete request to the database
     * and returns the request latencies.
     * @returns {Promise<MongoPingData>} Database latency object.
     */
    ping(): Promise<MongoPingData>;
    /**
     * Checks if the element is existing in database.
     * @param {String} key The key in database
     * @returns {Promise<Boolean>} Is the element is existing in database.
     */
    has(key: string): Promise<boolean>;
    /**
     * Checks if the element is existing in database.
     *
     * This method is an alias for `QuickMongo.has()` method.
     * @param {String} key The key in database
     * @returns {Promise<Boolean>} Is the element is existing in database.
     */
    includes(key: string): Promise<boolean>;
    /**
     * Gets the random element of array in database.
     *
     * [!!!] The target must be an array.
     * @param {String} key The key in database.
     * @returns {K} The random element in array.
     */
    random<T>(key: string): Promise<T>;
    /**
    * Gets a list of keys in database.
    * @param {String} key The key in database.
    * @returns {Promise<String[]>} An array with all keys in database or 'null' if nothing found.
    */
    keysList(key: string): Promise<string[]>;
    /**
     * Fetches the data from the storage file.
     * @param {String} key The key in database.
     * @returns {Promise<T>} Value from the specified key or 'false' if failed to read or 'null' if nothing found.
     */
    fetch<T>(key: string): Promise<T>;
    /**
     * Sets data in a property in database.
     * @param {String} key The key in database.
     * @param {T} value Any data to set in property.
     * @returns {Promise<Boolean>} If set successfully: true; else: false
     */
    set<T>(key: string, value: T): Promise<boolean>;
    /**
    * Removes the property from the existing object in database.
    * @param {String} key The key in database.
    * @returns {Promise<Boolean>} If cleared: true; else: false.
    */
    remove(key: string): Promise<boolean>;
    /**
     * Removes the property from the existing object in database.
     *
     * This method is an alias for `QuickMongo.remove()` method.
     * @param {String} key The key in database.
     * @returns {Promise<Boolean>} If cleared: true; else: false.
     */
    delete(key: string): Promise<boolean>;
    /**
     * Adds a number to a property data in database.
     *
     * [!!!] The target must be a number.
     * @param {String} key The key in database.
     * @param {Number} value Any number to add.
     * @returns {Promise<Boolean>} If added successfully: true; else: false
     */
    add(key: string, value: number): Promise<boolean>;
    /**
     * Subtracts a number from a property data in database.
     *
     * [!!!] The target must be a number.
     * @param {String} key The key in database.
     * @param {Number} value Any number to subtract.
     * @returns {Promise<Boolean>} If set successfully: true; else: false
     */
    subtract(key: string, value: number): Promise<boolean>;
    /**
     * Fetches the data from the storage file.
     *
     * This method is an alias for the `QuickMongo.fetch()` method.
     * @param {String} key The key in database.
     * @returns {Promise<T>} Value from the specified key or 'false' if failed to read or 'null' if nothing found.
     */
    find<T>(key: string): Promise<T>;
    /**
     * Pushes a value to a specified array from the database.
     *
     * [!!!] The target must be an array.
     * @param {String} key The key in database.
     * @param {T} value The key in database.
     * @returns {Promise<Boolean>} If cleared: true; else: false.
     */
    push<T>(key: string, value: T): Promise<boolean>;
    /**
     * Removes an element from a specified array in the database.
     *
     * [!!!] The target must be an array.
     * @param {String} key The key in database.
     * @param {Number} index The index in the array.
     * @returns {Promise<Boolean>} If cleared: true; else: false.
     */
    removeElement(key: string, index: number): Promise<boolean>;
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
    deleteElement(key: string, index: number): Promise<boolean>;
    /**
    * Changes the specified element's value in a specified array in the database.
    *
    * [!!!] The target must be an array.
    * @param {String} key The key in database.
    * @param {Number} index The index in the array.
    * @param {T} newValue The new value to set.
    * @returns {Promise<Boolean>} If cleared: true; else: false.
    */
    changeElement<T>(key: string, index: number, newValue: T): Promise<boolean>;
    /**
    * Fetches the entire database.
    * @returns {Promise<AnyObject>} Database contents
    */
    all(): Promise<AnyObject>;
    /**
    * Fetches the raw content of database.
    * @returns {Promise<DatabaseObject[]>} Database contents
    */
    raw(): Promise<DatabaseObject[]>;
}
export = Mongo;
/**
 * @typedef {Object} MongoConnectionOptions
 * @property {String} connectionURI MongoDB connection URI.
 * @property {String} [dbName] MongoDB database name to use.
 * @property {String} [collectionName='database'] MongoDB collection name to use.
 */
