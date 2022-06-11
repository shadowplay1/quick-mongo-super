declare const errors: {
    invalidType(param: string, requiredType: string, receivedObject: any): string;
    invalidTypes: {
        key: string;
        value: string;
        valueNumber: string;
        index: string;
    };
    target: {
        notNumber: string;
        notArray: string;
    };
    notSpecified: {
        key: string;
        value: string;
        newValue: string;
    };
    connection: {
        uri: {
            notSpecified: string;
            invalid: string;
        };
        failedToConnect: string;
        alreadyConnected: string;
        alreadyDestroyed: string;
        noConnection: string;
        connectionFailure: string;
    };
};
export = errors;
