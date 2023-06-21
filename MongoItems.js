const { DatabaseError } = require('./dist/src/classes/DatabaseError')
const { Emitter } = require('./dist/src/classes/Emitter')
const { Utils } = require('./dist/src/classes/Utils')

const Mongo = require('./dist/src/index')

module.exports = {
    DatabaseError,
    Emitter,
    Utils,
    Mongo
}
