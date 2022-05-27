export = {
    invalidType(param: string, requiredType: string, receivedObject: any): string {
        const receivedType = Array.isArray(receivedObject) ? 'array' : typeof receivedObject

        const message =
            `${param} must be ${receivedType == 'array' || receivedType == 'object' ? 'an' : 'a'} ${requiredType}. ` +
            `Received: ${receivedType}.`

        return message
    },

    invalidTypes: {
        key: 'Key must be a string. Received: ',
        value: 'Value in add/subtract methods must be a number. Received: ',
        valueNumber: 'Value is cannot be a function.',
        index: 'Index must be a number. Received: '
    },

    target: {
        notNumber: 'Target is not a number. Received: ',
        notArray: 'Target is not an array. Received: '
    },

    notSpecified: {
        key: 'Key is not specified.',
        value: 'Value is not specified.',
        newValue: 'New value is not specified.'
    },

    connection: {
        uri: {
            notSpecified: 'Mongo connection URI is not specified.',
            invalid: 'Mongo connection URI is invalid.'
        },

        failedToConnect: 'Failed to connect to the database: ',
        alreadyConnected: 'Already connected to the Mongo database server.',
        alreadyDestroyed: 'The connection was already destroyed.',
        noConnection: 'No connection to the Mongo database server.',

        connectionFailure:
            'A connection error has occured. ' +
            'It may happen if you\'re not connected to the Internet or the connection is slow, ' +
            'your Internet provider is blocking the connection attempts, ' +
            'the database server is not available, ' +
            'or the connection timed out.'
    }
}