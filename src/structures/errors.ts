import { RestOrArray } from '../types/utils'
import { typeOf } from '../lib/utils/functions/typeOf.function'

export const errors = {
    CONNECTION_NOT_ESTABLISHED:
        'Failed to connect to MongoDB. Please double-check the specified ' +
        'the connection URI and make sure that you\'re performing the ' +
        'database connection using the `QuickMongoClient.connect()` method.',
    CONNECTION_URI_NOT_SPECIFIED: 'The MongoDB connection URI must be specified.',
    INVALID_CONNECTION_URI: 'The specified MongoDB connection URI is invalid.',
    UNKNOWN_ERROR: 'Unknown error.',
    REQUIRED_PARAMETER_MISSING: '\'{1}\' parameter is required but is missing.',
    REQUIRED_CONSTRUCTOR_PARAMETER_MISSING: '\'{1}\' parameter in constructor \'{2}\' is required but is missing.',
    INVALID_CONSTRUCTOR_PARAMETER_TYPE:
        '\'{1}\' parameter in constructor \'{2}\' must be ' +
        'a type of {3}. Received type: {4}.',
    INVALID_TYPE: '\'{1}\' must be a type of {2}. Received type: {3}.',
    ONE_OR_MORE_ARRAY_TYPES_INVALID: 'All specified elements from array in \'{1}\' parameter ' +
        'must be a type of {2}. Received array of types: {3}.',
    INVALID_TARGET: 'The target in database must be a type of {1}. Received target type: {2}.'
}

export interface IErrorParams extends Record<keyof typeof errors, any[]> {
    CONNECTION_NOT_ESTABLISHED: []
    UNKNOWN_ERROR: [],
    CONNECTION_URI_NOT_SPECIFIED: [],
    INVALID_CONNECTION_URI: [],
    REQUIRED_PARAMETER_MISSING: [missingParam: string]
    REQUIRED_CONSTRUCTOR_PARAMETER_MISSING: [missingParam: string, className: string]
    INVALID_TYPE: [paramName: string, targetType: TargetParamType, receivedType: string]
    INVALID_CONSTRUCTOR_PARAMETER_TYPE: [
        paramName: string, className: string,
        targetType: TargetParamType, receivedType: string
    ]
    ONE_OR_MORE_ARRAY_TYPES_INVALID: [paramName: string, targetType: TargetParamType, receivedTypesArray: string]
    INVALID_TARGET: [targetType: TargetParamType, receivedType: string]
}

export const createTypesArray = <T>(
    ...elements: T extends RestOrArray<infer R>
        ? RestOrArray<R>
        : RestOrArray<T>
): string => {
    return `[${elements.map(element => typeOf(element))}]`
}

export type TargetParamType = 'string' | 'number' | 'array' | 'object' | `${string} class instance`
