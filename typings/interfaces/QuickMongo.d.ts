import { Collection, Document, MongoClient, MongoClientOptions } from 'mongodb';
export interface DatabaseEvents {
    connecting: void;
    ready: Collection<Document>;
    destroy: MongoClient;
}
export interface DatabaseProperties {
    [key: string]: any;
}
export interface DatabaseObject {
    __KEY: string;
    __VALUE: any;
}
export interface MongoConnectionOptions {
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
export interface VersionData {
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
export declare type MongoLatencyData = Record<'readLatency' | 'writeLatency' | 'deleteLatency', number>;
