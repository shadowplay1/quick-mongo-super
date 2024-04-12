import { QuickMongoClient } from '../lib/QuickMongoClient'

export interface IQuickMongoEvents<
    TInitialDatabaseData extends Record<string, any> = any
> {
    connect: [connectedQuickMongoClient: QuickMongoClient<TInitialDatabaseData>]
    disconnect: [voidParam: void]
}

/**
 * Represents the configuration object of the `QuickMongo` database instance.
 */
export interface IDatabaseConfiguration {
    name: string
    collectionName?: string
}

/**
 * Represents the object of the way data stored in the internal
 * `[__KEY]-[__VALUE]` storage format that was made to achieve better data accessibility across the module.
 *
 * @template T The type of `__VALUE` property in each raw data object.
 */
export interface IDatabaseInternalStructure<T = any> {
    __KEY: string
    __VALUE: T
}

/**
 * Represents the database operations latency object.
 */
export type IDatabaseRequestsLatencyData = Record<
    'readLatency' | 'writeLatency' | 'deleteLatency',
    number
>
