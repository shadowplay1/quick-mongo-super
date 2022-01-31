import { Collection, Document, MongoClient } from 'mongodb';
interface MongoDatabaseEvents {
    connecting: void;
    ready: Collection<Document>;
    destroy: MongoClient;
}
export = MongoDatabaseEvents;
