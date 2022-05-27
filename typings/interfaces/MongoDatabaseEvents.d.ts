import { Collection, Document, MongoClient } from 'mongodb';
interface DatabaseEvents {
    connecting: void;
    ready: Collection<Document>;
    destroy: MongoClient;
}
export = DatabaseEvents;
