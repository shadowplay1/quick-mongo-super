import { Collection, Document, MongoClient } from 'mongodb';
export interface MongoDatabaseEvents {
    connecting: void;
    ready: Collection<Document>;
    destroy: MongoClient;
}
export interface AnyObject {
    [key: string]: any;
}
export interface DatabaseObject {
    __KEY: string;
    __VALUE: any;
}
export interface MongoConnectionOptions {
    connectionURI: string;
    dbName?: string;
    collectionName?: string;
}
export interface MongoPingData {
    readLatency: number;
    writeLatency: number;
    deleteLatency: number;
}
