export = {
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
        failedToConnect: 'Failed to connect to the database: ',
        alreadyConnected: 'The module is already connected to MongoDB.',
        alreadyDestroyed: 'The connection was already destroyed.',
        notReady: 'The module is not connected to MongoDB.'
    }
}