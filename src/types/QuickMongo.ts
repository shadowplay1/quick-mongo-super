export interface IQuickMongoEvents {
    connect: [voidParam: void]
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

export type IMongoLatency = Record<'readLatency' | 'writeLatency' | 'deleteLatency', number>
