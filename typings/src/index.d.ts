import { MongoClient, MongoClientOptions, Db, Collection, Document } from 'mongodb';
import { Emitter } from './classes/Emitter';
import { IMongoConnectionOptions, IDatabaseObject, IDatabaseEvents, IDatabaseProperties, IVersionData, MongoLatency } from './interfaces/QuickMongo';
/**
 * QuickMongo class.
 * @extends {Emitter}
 */
declare class Mongo<V = any> extends Emitter<IDatabaseEvents> {
    ready: boolean;
    options: IMongoConnectionOptions;
    mongoClientOptions: MongoClientOptions;
    mongo: MongoClient;
    database: Db;
    collection: Collection<Document>;
    private _utils;
    constructor(options: IMongoConnectionOptions);
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
    * @returns {Promise<IVersionData>} Is the module updated, latest version and installed version.
    */
    checkUpdates(): Promise<IVersionData>;
    /**
     * Sends a read, write and delete requests to the database.
     * and returns the request latencies.
     * @returns {Promise<MongoLatency>} Database latency object.
     */
    ping(): Promise<MongoLatency>;
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
     *
     * Type parameters:
     *
     * - T: The type of random element in the array.
     *
     * @param {string} key The key in database.
     * @returns {Promise<T>} The random element in the array.
     */
    random<T>(key: string): Promise<T>;
    /**
    * Gets a list of keys in database.
    * @param {string} key The key in database.
    * @returns {Promise<string[]>} An array with all keys in database.
    */
    keysList(key?: string): Promise<string[]>;
    /**
     * Fetches the data from the database.
     *
     * Type parameters:
     *
     * - T: The type of data that will be returned from database.
     *
     * @param {string} key The key in database.
     * @returns {Promise<T>} Value from the database.
     */
    fetch<T = any>(key: string): Promise<T>;
    /**
     * Sets data in a property in database.
     *
     * Type parameters:
     *
     * - T: The type of value to set for a specified key.
     * - P: The type of data inside the specified database property.
     *
     * @param {string} key The key in database.
     * @param {T} value Any data to set in property.
     * @returns {Promise<IDatabaseProperties<P>>} If set successfully: true; else: false
     */
    set<T = any, P = V>(key: string, value: T): Promise<IDatabaseProperties<P>>;
    /**
     * Removes the property from the existing object in database.
     *
     * Type parameters:
     *
     * - P: The type of data inside the specified database property.
     *
     * @param {string} key The key in database.
     * @returns {Promise<IDatabaseProperties<P>>} If cleared: true; else: false.
     */
    remove<P = V>(key: string): Promise<IDatabaseProperties<P>>;
    /**
     * Removes the property from the existing object in database.
     *
     * This method is an alias for `QuickMongo.remove()` method.
     *
     * Type parameters:
     *
     * - P: The type of data inside the specified database property.
     *
     * @param {string} key The key in database.
     * @returns {Promise<IDatabaseProperties<P>>} If cleared: true; else: false.
     */
    delete<P = V>(key: string): Promise<IDatabaseProperties<P>>;
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
     *
     * Type parameters:
     *
     * - P: The type of data inside the specified database property.
     *
     * @param {string} key The key in database.
     * @param {number} value Any number to add.
     * @returns {Promise<IDatabaseProperties<P>>} If added successfully: true; else: false
     */
    add<P = V>(key: string, value: number): Promise<IDatabaseProperties<P>>;
    /**
     * Subtracts a number from a property data in database.
     *
     * [!!!] The target must be a number.
     *
     * Type parameters:
     *
     * - P: The type of data inside the specified database property.
     *
     * @param {string} key The key in database.
     * @param {number} value Any number to subtract.
     * @returns {Promise<IDatabaseProperties<P>>} If set successfully: true; else: false
     */
    subtract<P = V>(key: string, value: number): Promise<IDatabaseProperties<P>>;
    /**
     * Fetches the data from the database.
     *
     * This method is an alias for the `QuickMongo.fetch()` method.
     *
     * Type parameters:
     *
     * - T: The type of data that will be returned from database.
     *
     * @param {string} key The key in database.
     * @returns {Promise<T>} Value from the database.
     */
    find<T = any>(key: string): Promise<T>;
    /**
     * Fetches the data from the database.
     *
     * This method is an alias for the `QuickMongo.fetch()` method.
     *
     * Type parameters:
     *
     * - T: The type of data that will be returned from database.
     *
     * @param {string} key The key in database.
     * @returns {Promise<T>} Value from the database.
     */
    get<T = any>(key: string): Promise<T>;
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
     * @param {string} key The key in database.
     * @param {T} value The key in database.
     * @returns {Promise<IDatabaseProperties<P>>} If cleared: true; else: false.
     */
    push<T = any, P = V>(key: string, value: T): Promise<IDatabaseProperties<P>>;
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
     * @param {string} key The key in database.
     * @param {number} index The index in the array.
     * @returns {Promise<IDatabaseProperties<P>>} If cleared: true; else: false.
     */
    pop<T = any, P = V>(key: string, index: number): Promise<IDatabaseProperties<P>>;
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
     * @param {string} key The key in database.
     * @param {number} index The index in the array.
     * @returns {Promise<IDatabaseProperties<P>>} If cleared: true; else: false.
     */
    removeElement<P = V>(key: string, index: number): Promise<IDatabaseProperties<P>>;
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
     * @param {string} key The key in database.
     * @param {number} index The index in the array.
     * @param {T} newValue The new value to set.
     * @returns {Promise<IDatabaseProperties<P>>} If cleared: true; else: false.
     */
    pull<T = any, P = V>(key: string, index: number, newValue: T): Promise<IDatabaseProperties<P>>;
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
     * @param {string} key The key in database.
     * @param {number} index The index in the array.
     * @param {T} newValue The new value to set.
     * @returns {Promise<IDatabaseProperties<P>>} If cleared: true; else: false.
     */
    changeElement<T = any, P = V>(key: string, index: number, newValue: T): Promise<IDatabaseProperties<P>>;
    /**
     * Fetches the database contents.
     *
     * Type parameters:
     *
     * - P: The type of data inside all the database properties.
     *
     * @returns {Promise<IDatabaseProperties<P>>} Database contents.
     */
    all<P = V>(): Promise<IDatabaseProperties<P>>;
    /**
     * Fetches the raw databas contents.
     *
     * Type parameters:
     *
     * - P: The type of `__VALUE` property for every raw database entry.
     *
     * @returns {Promise<IDatabaseObject<P>[]>} Raw database contents.
     */
    raw<P = V>(): Promise<IDatabaseObject<P>[]>;
}
export = Mongo;
