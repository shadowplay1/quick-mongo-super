export const errors = {
    NOT_CONNECTED: 'MongoDB connection is not established.',
    UNKNOWN_ERROR: 'Unknown error.',
    REQUIRED_PARAMETER_MISSING: '\'{1}\' parameter is required but is missing.',
    INVALID_TARGET: 'The target must be a(n) {1}. Received type: {2}.'
}

export interface IErrorParams extends Record<keyof typeof errors, any[]> {
    NOT_CONNECTED: []
    UNKNOWN_ERROR: []
    REQUIRED_PARAMETER_MISSING: [missingParam: string]
    INVALID_TARGET: [targetType: string, receivedType: string]
}
