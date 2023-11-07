import { QuickMongoClient } from '../QuickMongoClient'
import { QuickMongoError } from '../utils/QuickMongoError'

import { isObject } from '../utils/functions/isObject.function'
import { typeOf } from '../utils/functions/typeOf.function'

/**
 * Cache manager class.
 *
 * Type parameters:
 *
 * - `K` (any) - The cache map key type.
 * - `V` (any) - The cache map value type.
 *
 * @template K The cache map key type.
 * @template V The cache map value type.
 */
export class CacheManager<K extends string, V> {
    private _client: QuickMongoClient<any>

    /**
     * Database cache.
     * @type {Map<K, V>}
     * @private
     */
    private _cache: Map<K, V>

    /**
     * Cache manager constructor.
     * @param {QuickMongoClient} client Quick Mongo client to work with.
     */
    public constructor(client: QuickMongoClient<any>) {

        /**
         * Quick Mongo client to work with.
         * @type {QuickMongoClient<any>}
         * @private
         */
        this._client = client

        /**
         * Database cache.
         * @type {Map<K, V>}
         * @private
         */
        this._cache = new Map<K, V>()
    }

    /**
     * Gets the cache map as an object.
     *
     * Type parameters:
     *
     * - `V` (any) - The type of cache object to return.
     *
     * @returns {any} Object representation of the cache map.
     * @template V The type of cache object to return.
     */
    public getCacheObject<V = any>(): V {
        const mapData: Record<any, any> = {}

        for (const [key, value] of this._cache.entries()) {
            mapData[key] = value
        }

        return mapData
    }

    /**
     * Parses the key and fetches the value from cache map.
     *
     * Type parameters:
     *
     * - `V` (any) - The type of data being returned.
     *
     * @param {K} key The key in cache map.
     * @returns {V} The data from cache map.
     *
     * @template V The type of data being returned.
     */
    public get<TValue = V>(key: K): TValue {
        let data = this.getCacheObject()

        if (!this._client.connected) {
            throw new QuickMongoError('NOT_CONNECTED')
        }

        if (!key) {
            throw new QuickMongoError('REQUIRED_PARAMETER_MISSING', 'key')
        }

        if (typeof key !== 'string') {
            throw new QuickMongoError('INVALID_TYPE', 'key', 'string', typeOf(key))
        }

        let parsedData = data
        const keys = key.split('.')

        for (let i = 0; i < keys.length; i++) {
            if (keys.length - 1 == i) {
                data = parsedData?.[keys[i]] ?? null
            }

            parsedData = parsedData?.[keys[i]]
        }

        return data
    }

    /**
     * Determines if the data is stored in database.
     * @param {K} key The key to access the data by.
     * @returns {boolean} Whether the data is stored in database.
     */
    public has(key: K): boolean {
        return this.get(key) !== null && this.get(key) !== undefined
    }

    /**
     * Parses the key and sets the value in cache map.
     *
     * Type parameters:
     *
     * - `TValue` (any) - The type of data being set.
     * - `R` (any) - The type of data being returned.
     *
     * @param {K} key The key in cache map.
     * @returns {R} The data from cache map.
     *
     * @template TValue The type of data being set.
     * @template TReturnType The type of data being returned.
     */
    public set<TValue = V, TReturnType = any>(key: K, value: TValue): TReturnType {
        const data = this.getCacheObject()

        if (!this._client.connected) {
            throw new QuickMongoError('NOT_CONNECTED')
        }

        if (!key) {
            throw new QuickMongoError('REQUIRED_PARAMETER_MISSING', 'key')
        }

        if (typeof key !== 'string') {
            throw new QuickMongoError('INVALID_TYPE', 'key', 'string', typeOf(key))
        }

        if (value === undefined) {
            throw new QuickMongoError('REQUIRED_PARAMETER_MISSING', 'value')
        }

        const keys = key.split('.')

        for (let i = 0; i < keys.length; i++) {
            if (keys.length > 1) {
                if (!isObject(data[keys[i]])) {
                    data[keys[i]] = {}
                }

                data[keys[i]] = {
                    ...data?.[keys[i]],
                    [keys.at(-1)]: value
                }
            } else {
                data[keys[0]] = value
            }
        }

        this._cache.set(keys[0] as K, data?.[keys[0]] || null)
        return data
    }

    /**
     * Parses the key and deletes it from cache map.
     * @param {K} key The key in cache map.
     * @returns {boolean} `true` if deleted successfully.
     */
    public delete(key: K): boolean {
        const data = this.getCacheObject()

        if (!this._client.connected) {
            throw new QuickMongoError('NOT_CONNECTED')
        }

        if (!key) {
            throw new QuickMongoError('REQUIRED_PARAMETER_MISSING', 'key')
        }

        if (typeof key !== 'string') {
            throw new QuickMongoError('INVALID_TYPE', 'key', 'string', typeOf(key))
        }

        let updatedData = data
        const keys = key.split('.')

        if (!this.has(key)) {
            return false
        }

        for (let i = 0; i < keys.length; i++) {
            if (keys.length - 1 == i) {
                delete updatedData[keys[i]]

            } else if (!isObject(data[keys[i]])) {
                updatedData[keys[i]] = {}
            }

            updatedData = updatedData?.[keys[i]]
        }

        if (keys.length == 1) {
            this._cache.delete(keys[0] as K)
        } else {
            this._cache.set(keys[0] as K, data?.[keys[0]])
        }

        return true
    }

    /**
     * Clears the cache.
     * @returns {boolean} `true` if cleared successfully.
     */
    public clear(): boolean {
        this._cache.clear()
        return true
    }
}
