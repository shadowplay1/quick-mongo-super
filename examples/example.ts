import { QuickMongoClient, QuickMongo } from 'quick-mongo-super'

// Your MongoDB connection URI to connect to.
// Replace it with your own connection URI to your cluster.
// In this example, localhost URI will be used.
const connectionURI = 'mongodb://127.0.0.1:27018'

// Create a normal Quick Mongo client.

// QuickMongoClient's type parameters:
//
// - `TInitialDatabaseData` (object) - The type of the object to be set in new empty databases.

const quickMongoClient = new QuickMongoClient<any>(connectionURI)

const main = async () => {

    // Connect to MongoDB.
    await quickMongoClient.connect()

    // You can also specify the initial data that will be put
    // on successful connection in every database if it's empty.

    // const quickMongoClient = new QuickMongoClient<InitialDatabaseObject>(connectionURI, {
    //     somethingToSetInDatabase: 'something'
    // })

    // interface InitialDatabaseObject {
    //     somethingToSetInDatabase: 'something'
    // }


    // Initialize the database.

    // QuickMongo's type parameters:
    //
    // - `K` (string) - The type of the key to access the data by.
    // - `V` (any) - The type of the values in the database.

    const quickMongo = new QuickMongo<string, any>(quickMongoClient, {
        name: 'databaseName',
        collectionName: 'collectionName' // (optional)
    })


    // ------------------ quickMongo.ping() ------------------

    // Sends a read, write and delete requests to the remote database and returns the request latencies in milliseconds.
    const ping = await quickMongo.ping()
    console.log(ping) // -> { readLatency: 123, writeLatency: 124, deleteLatency: 125 }


    // ------------------ quickMongo.get(key: string) | quickMongo.fetch(key: string) ------------------

    // Retrieves a value from database by a key.
    const simpleValue = quickMongo.get('simpleValue')
    console.log(simpleValue) // -> 123

    const databaseObjectPropertyAccessed = quickMongo.get('youCanAlso.accessDatabaseObjectProperties.likeThat')
    console.log(databaseObjectPropertyAccessed) // -> 'hello world!'

    // ^ Assuming that the initial database object for this example is:
    // {
    //    simpleValue: 123,
    //    youCanAlso: {
    //        accessDatabaseObjectProperties: {
    //            likeThat: 'hello world!'
    //        }
    //    }
    // }


    // ------------------ quickMongo.has(key: string) ------------------

    // Determines if the data is stored in database.

    const isSimpleValueInDatabase = quickMongo.has('simpleValue')
    console.log(isSimpleValueInDatabase) // -> true

    const somethingElse = quickMongo.has('somethingElse')
    console.log(somethingElse) // -> false

    // You can use the dot notation to check the database object properties:
    const isObjectInDatabase = quickMongo.has('youCanAlso.accessObjectProperties.likeThat')
    console.log(isObjectInDatabase) // -> true

    // ^ Assuming that the initial database object for this example is:
    // {
    //    simpleValue: 123,
    //    youCanAlso: {
    //        accessObjectProperties: {
    //            likeThat: 'hello world!'
    //        }
    //    }
    // }


    // ------------------ quickMongo.set(key: string, value: TValue) ------------------
    // Writes the specified value into database under the specified key.

    // Assuming that the initial database object for this example is empty.

    await quickMongo.set('something', 'hello from quick-mongo-super!')
    const hello = quickMongo.get('something')

    console.log(hello) // -> 'hello from quick-mongo-super!'

    // You can use the dot notation to write data in objects:
    const dotNotationSetResult = await quickMongo.set('thats.an.object', 123)
    console.log(dotNotationSetResult) // -> 123

    // Using objects as value will returns the object of key `thats`:
    await quickMongo.set('thats.an.object', { hello: 'world' })

    // ^ If you need to type the returning objects, use the 2nd type argument for this:

    // Assume we have the following returning object structure:
    interface MyCustomObjectType {
        an: {
            object: {
                hello: string
            }
        }
    }

    const typedObjectSetResult = await quickMongo.set<any, MyCustomObjectType>('thats.an.object', {
        hello: 'world'
    })
    //         ^ typedObjectSetResult: MyCustomObjectType

    console.log(typedObjectSetResult) // -> { an: { object: { hello: 'world' } } }

    // ^ After these manipulations, the database object will look like this:
    // {
    //     "something": "hello from quick-mongo-super!",
    //     "thats": {
    //         "an": {
    //             "object": {
    //                 hello: 'world'
    //             }
    //         }
    //     }
    // }


    // ------------------ quickMongo.delete(key: string) ------------------
    // Deletes the data from database by key.

    const databaseBefore = quickMongo.all()
    console.log(databaseBefore) // -> { prop1: 123, prop2: { prop3: 456, prop4: 789 } }

    await quickMongo.delete('prop1') // deleting `prop1` from the database
    await quickMongo.delete('prop2.prop3') // deleting `prop3` property from `prop2` object in database

    const databaseAfter = quickMongo.all()
    console.log(databaseAfter) // -> { prop2: { prop4: 789 } }

    // ^ Assuming that the initial database object for this example is:
    // {
    //     prop1: 123,
    //     prop2: {
    //         prop3: 456,
    //         prop4: 789
    //     }
    // }


    // ------------------ quickMongo.add(key: string, numberToAdd: number) ------------------
    // Performs an arithmetical addition on a target number in database.

    // [!!!] The type of target value must be a number.

    const additionResult = await quickMongo.add('points', 5)
    console.log(additionResult) // -> 10 (5 + 5 = 10)

    // Notice that we don't need to assign a value to unexistent properties in database
    // before performing an addition since the initial target value is 0 and will be used
    // as the value of the unexistent property:
    const unexistentAdditionResult = await quickMongo.add('somethingElse', 3)
    console.log(unexistentAdditionResult) // -> 3 (0 +  = 3); the property didn't exist in database, that's why 0 is added to 3

    // ^ Assuming that the initial database object for this example is:
    // {
    //    points: 5
    // }


    // ------------------ quickMongo.subtract(key: string, numberToSubtract: number) ------------------
    // Performs an arithmetical subtraction on a target number in database.

    // [!!!] The type of target value must be a number.

    const subtractionResult = await quickMongo.subtract('points', 5)
    console.log(subtractionResult) // -> 5 (10 - 5 = 5)

    // Notice that we don't need to assign a value to unexistent properties in database
    // before performing a subtraction since the initial target value is 0 and will be used
    // as the value of the unexistent property:
    const unexistentSubtractionitionResult = await quickMongo.subtract('somethingElse', 3)
    console.log(unexistentSubtractionitionResult) // -> 3 (0 - 3 = -3); the property didn't exist in database, so 3 is subtracted from 0

    // ^ Assuming that the initial database object for this example is:
    // {
    //    points: 10
    // }


    // ------------------ quickMongo.isTargetArray(key: string) ------------------

    const isArray = quickMongo.isTargetArray('array')
    console.log(isArray) // -> true

    const notArray = await quickMongo.isTargetArray('notArray')
    console.log(notArray) // -> false

    // ^ Assuming that the initial database object for this example is:
    // {
    //    array: [],
    //    notArray: 123
    // }


    // ------------------ quickMongo.isTargetNumber(key: string) ------------------
    // Determines whether the specified target is a number.

    const isNumber = quickMongo.isTargetNumber('number')
    console.log(isNumber) // -> true

    const notNumber = quickMongo.isTargetNumber('notNumber')
    console.log(notNumber) // -> false

    // ^ Assuming that the initial database object for this example is:
    // {
    //    number: 123,
    //    notNumber: []
    // }


    // ------------------ quickMongo.push(key: string, ...values: RestOrArray<TValue>) ------------------
    // Pushes the specified value into the target array in database.

    // [!!!] The type of target value must be an array.

    const membersPushResult = await quickMongo.push('members', 'William')
    console.log(membersPushResult) // -> ['John', 'William']

    // You can also pass in multiple values to push into the target array:
    const currenciesPushResult = await quickMongo.push('currencies', 'Euro', 'Rupee')
    console.log(currenciesPushResult) // -> ['Dollar', 'Euro', 'Rupee']

    // ^ Assuming that the initial database object for this example is:
    // {
    //    members: ['John'],
    //    currencies: ['Dollar']
    // }


    // ------------------ quickMongo.pull(key: string, targetArrayElementIndex: number, value: TValue) ------------------
    // Replaces the specified element in target array with the specified value in the target array in database.

    // [!!!] The type of target value must be an array.

    const membersPullResult = await quickMongo.pull('members', 1, 'James')
    console.log(membersPullResult) // -> ['John', 'James', 'Tom']

    // ^ Assuming that the initial database object for this example is:
    // {
    //    members: ['John', 'William', 'Tom']
    // }


    // ------------------ quickMongo.pop(key: string, ...targetArrayElementIndexes: RestOrArray<number>) ------------------
    // Removes the specified element from the target array in database.

    // [!!!] The type of target value must be an array.

    const membersPopResult = await quickMongo.pop('members', 1)
    console.log(membersPopResult) // -> ['John', 'Tom']

    const currenciesPopResult = await quickMongo.pop('currencies', 1)
    console.log(currenciesPopResult) // -> ['Dollar', 'Euro']

    // ^ Assuming that the initial database object for this example is:
    // {
    //    members: ['John', 'William', 'Tom'],
    //    currencies: ['Dollar', 'Rupee', 'Euro']
    // }


    // ------------------ quickMongo.keys(key?: string) ------------------
    // Returns an array of object keys by specified database key.

    // If `key` parameter is omitted, then an array of object keys of database root object will be returned.

    const prop3Keys = quickMongo.keys('prop3')
    console.log(prop3Keys) // -> ['prop4', 'prop5']

    const prop5Keys = quickMongo.keys('prop3.prop5')
    console.log(prop5Keys) // -> ['prop6']

    const prop6Keys = quickMongo.keys('prop3.prop5.prop6')
    console.log(prop6Keys) // -> [] (empty since the value in `prop6`, 111 a primitive value and not an actual object)

    const databaseKeys = quickMongo.keys()
    // in this example, `key` parameter is omitted - object keys of database object are being returned

    console.log(databaseKeys) // -> ['prop1', 'prop2', 'prop3']

    const unexistentKeys = quickMongo.keys('somethingElse')
    console.log(unexistentKeys) // -> [] (empty since the key `somethingElse` does not exist in database)

    // ^ Assuming that the initial database object for this example is:
    // {
    //    prop1: 123,
    //    prop2: 456,
    //    prop3: { prop4: 789, prop5: { prop6: 111 } }
    // }


    // ------------------ quickMongo.random(key: string) ------------------
    // Picks a random element of array in database and returns the picked array element.

    // [!!!] The type of target value must be an array.

    const array = quickMongo.get('exampleArray') // assuming that the array is ['example1', 'example2', 'example3']
    console.log(array) // -> ['example1', 'example2', 'example3']

    const randomArrayElement = quickMongo.random('exampleArray')
    console.log(randomArrayElement) // -> randomly picked array element: either 'example1', 'example2', or 'example3'


    // ------------------ quickMongo.deleteAll() | quickMongo.clear() ------------------
    // Deletes everything from the database.

    await quickMongo.clear() // this will delete all the data from the database


    // ------------------ quickMongo.all() ------------------
    // Gets all the database contents from the cache.

    const database = quickMongo.all()
    console.log(database) // -> { ... (the object of all the data stored in database) }


    // ------------------ quickMongo.loadCache() ------------------
    // Loads the database into cache.

    await quickMongo.loadCache() // this will download all the database contents into the cache


    // ------------------ quickMongo.raw() ------------------

    // Makes a database request and fetches the raw database content - the data as it is
    // stored in internal [__KEY]-[__VALUE] storage format that was made
    // to achieve better data accessibility across the module.

    const rawData = await quickMongo.raw()
    console.log(rawData) // -> [{_id: '6534ee98408514005215ad2d', __KEY: 'something', __VALUE: 'something', __v: 0}, ...]


    // ------------------ quickMongo.allFromDatabase() ------------------
    // Makes a request and fetches the database contents from remote cluster.

    const allDatabase = quickMongo.allFromDatabase()
    console.log(allDatabase) // -> { ... (the object of all the data stored in database) }
}


main()


// Emits when the connection to MongoDB was established.
quickMongoClient.on('connect', () => {
    console.log('Connected to MongoDB.')
})

// Emits when the connection to MongoDB was destroyed.
quickMongoClient.on('disconnect', () => {
    console.log('Disconnected from MongoDB.')
})
