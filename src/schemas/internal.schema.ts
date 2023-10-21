import { Schema } from 'mongoose'
import { IDatabaseInternalStructure } from '../types/QuickMongo'

export const internalDatabaseSchema = new Schema<IDatabaseInternalStructure>({
    __KEY: {
        type: String,
        required: false
    },

    __VALUE: {
        type: Schema.Types.Mixed,
        required: false
    }
})
