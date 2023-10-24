import { RestOrArray } from '../types/utils'
import { typeOf } from '../lib/utils/functions/typeOf.function'

export const errors = {
    NOT_CONNECTED: 'No connection to MongoDB.',
    UNKNOWN_ERROR: 'Unknown error.',
    REQUIRED_PARAMETER_MISSING: '\'{1}\' parameter is required but is missing.',
    INVALID_TYPE: '\'{1}\' must be a type of {2}. Received type: {3}',
    ONE_OR_MORE_TYPES_INVALID: 'All the specified elements from the array in \'{1}\' parameter ' +
        'must be a type of {2}. Received types array: {3}',
    INVALID_TARGET: 'The target must be a type of {1}. Received type: {2}.'
}

export interface IErrorParams extends Record<keyof typeof errors, any[]> {
    NOT_CONNECTED: []
    UNKNOWN_ERROR: []
    REQUIRED_PARAMETER_MISSING: [missingParam: string]
    INVALID_TYPE: [paramName: string, targetType: TargetParamType, receivedType: string]
    ONE_OR_MORE_TYPES_INVALID: [paramName: string, targetType: TargetParamType, receivedTypesArray: string]
    INVALID_TARGET: [targetType: TargetParamType, receivedType: string]
}

export const createTypesArray = <T>(
    ...elements: T extends RestOrArray<infer R>
        ? RestOrArray<R>
        : RestOrArray<T>
): string => {
    return `[${elements.map(element => typeOf(element))}]`
}

export type TargetParamType = 'string' | 'number' | 'array'
