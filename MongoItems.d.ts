export { DatabaseError } from './src/classes/DatabaseError'
export { Emitter } from './src/classes/Emitter'
export { Utils } from './src/classes/Utils'

export {
    IMongoConnectionOptions,
    IDatabaseObject, IDatabaseEvents,
    IDatabaseProperties, IVersionData,
    MongoLatency, DatabaseProperties
} from './src/interfaces/QuickMongo'

export import Mongo = require('./src/index')
