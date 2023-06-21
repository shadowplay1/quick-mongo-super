export { DatabaseError } from './typings/src/classes/DatabaseError'
export { Emitter } from './typings/src/classes/Emitter'
export { Utils } from './typings/src/classes/Utils'

export {
    IMongoConnectionOptions,
    IDatabaseObject, IDatabaseEvents,
    IDatabaseProperties, IVersionData,
    MongoLatency, DatabaseProperties
} from './typings/src/interfaces/QuickMongo'

export import Mongo = require('./typings/src/index')
