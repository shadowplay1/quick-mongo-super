export interface IQuickMongoEvents {
    connected: [voidParam: void]
}

export interface IDatabaseConfiguration {
    name: string
    collectionName?: string
}

export interface IDatabaseInternalStructure<T = any> {
    __KEY: string
    __VALUE: T
}
