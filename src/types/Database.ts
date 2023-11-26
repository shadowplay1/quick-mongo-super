import { QuickMongoClient } from '../lib/QuickMongoClient'

export interface IQuickMongoEvents<
    TInitialDatabaseData extends Record<string, any> = any
> {
    connect: [connectedQuickMongoClient: QuickMongoClient<TInitialDatabaseData>]
    disconnect: [voidParam: void]
}

export interface IDatabaseConfiguration {
    name: string
    collectionName?: string
}

export interface IDatabaseInternalStructure<T = any> {
    __KEY: string
    __VALUE: T
}

export type IDatabaseRequestsLatencyData = Record<
    'readLatency' | 'writeLatency' | 'deleteLatency',
    number
>
