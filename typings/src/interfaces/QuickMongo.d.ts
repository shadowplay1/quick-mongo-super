import { Collection, Document, MongoClient, MongoClientOptions } from 'mongodb';
export interface IDatabaseEvents {
    connecting: void;
    ready: Collection<Document>;
    destroy: MongoClient;
}
export interface DatabaseProperties<T = any> {
    [key: string]: T;
}
export interface IDatabaseProperties<T = any> {
    [key: string]: T;
}
export interface IDatabaseObject<T = any> {
    __KEY: string;
    __VALUE: T;
}
export interface IMongoConnectionOptions {
    /**
     * MongoDB connection URI.
     */
    connectionURI: string;
    /**
     * Name of the database. Default: 'db'.
     */
    dbName?: string;
    /**
     * Name of the collection. Default: 'database'.
     */
    collectionName?: string;
    /**
     * Mongo client options.
     */
    mongoClientOptions?: MongoClientOptions;
}
export interface IVersionData {
    /**
     * Checks for if module is up to date.
     */
    updated: boolean;
    /**
     * Shows an installed version of the module
     */
    installedVersion: string;
    /**
     * Shows the latest version of the module
     */
    packageVersion: string;
}
export declare type MongoLatency = Record<'readLatency' | 'writeLatency' | 'deleteLatency', number>;
export declare type PropertyValue<V, VIfNull = any> = V extends null ? VIfNull : V;
