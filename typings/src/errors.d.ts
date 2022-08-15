declare const errors: {
    invalidType(param: string, requiredType: string, receivedObject: any): string;
    requiredParameterMissing(parameter: string): string;
    invalidTypes: {
        functionIsValue: string;
        key: string;
        value: string;
        valueNumber: string;
        index: string;
    };
    target: {
        notNumber: string;
        notArray: string;
        empty: string;
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
        badAuth: string;
        failedToConnect: string;
        alreadyConnected: string;
        alreadyDestroyed: string;
        noConnection: string;
        connectionFailure: string;
    };
};
export = errors;
