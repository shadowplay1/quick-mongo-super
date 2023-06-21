const { DatabaseError } = require('./src/classes/DatabaseError')
const { Emitter } = require('./src/classes/Emitter')
const { Utils } = require('./src/classes/Utils')

const Mongo = require('./src/index')

module.exports = {
    DatabaseError,
    Emitter,
    Utils,
    Mongo
}
