const errors = {
    invalidType(param: string, requiredType: string, receivedObject: any): string {
        const receivedType = Array.isArray(receivedObject) ? 'array' : typeof receivedObject

        const message =
            `${param} must be ${receivedType == 'array' || receivedType == 'object' ? 'an' : 'a'} ${requiredType}. ` +
            `Received: ${receivedType}.`

        return message
    },

    requiredParameterMissing(parameter: string): string {
        return `${parameter} is required but is missing.`
    },

    invalidTypes: {
        functionIsValue: 'Value cannot be a function.',
        key: 'Key must be a string. Received: ',
        value: 'Value in add/subtract methods must be a number. Received: ',
        valueNumber: 'Value is cannot be a function.',
        index: 'Index must be a number. Received: '
    },

    target: {
        notNumber: 'Target is not a number. Received: ',
        notArray: 'Target is not an array. Received: ',
        empty: 'The target is already empty.'
    },

    notSpecified: {
        key: 'Key is not specified.',
        value: 'Value is not specified.',
        newValue: 'New value is not specified.'
    },

    connection: {
        uri: {
            notSpecified: 'MongoDB connection URI is not specified.',
            invalid: 'MongoDB connection URI is invalid.'
        },

        badAuth: 'Failed to authenticate with specified connection URI: the credentials are incorrect.',
        failedToConnect: 'Failed to connect to the database: ',
        alreadyConnected: 'Already connected to the Mongo database server.',
        alreadyDestroyed: 'The connection is already destroyed.',
        noConnection: 'No connection to the Mongo database server.',

        connectionFailure:
            'A connection error has occured. ' +
            'It may happen if you\'re not connected to the network or the connection is slow, ' +
            'your network provider is blocking the connection attempts, ' +
            'the database server is not available, ' +
            'or the connection timed out.'
    }
}

export = errors
