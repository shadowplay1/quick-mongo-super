export const errors = {
    NOT_CONNECTED: 'MongoDB connection is not established.',
    UNKNOWN_ERROR: 'Unknown error.',
    REQUIRED_PARAMETER_MISSING: '\'{1}\' parameter is required but is missing.',
    INVALID_TYPE: '\'{1}\' must be a type of {2}. Received type: {3}',
    INVALID_TARGET: 'The target must be a type of {1}. Received type: {2}.'
}

export interface IErrorParams extends Record<keyof typeof errors, any[]> {
    NOT_CONNECTED: []
    UNKNOWN_ERROR: []
    INVALID_TYPE: [paramName: string, targetType: TargetParamType, receivedType: string]
    REQUIRED_PARAMETER_MISSING: [missingParam: string]
    INVALID_TARGET: [targetType: TargetParamType, receivedType: string]
}

export type TargetParamType = 'string' | 'number' | 'array'
