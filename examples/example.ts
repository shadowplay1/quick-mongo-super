import QuickMongo from 'quick-mongo-super'

const db = new QuickMongo<string, any>({
    connectionURI: 'your mongodb connection URI here', // MongoDB connection URI to connect to the database.
    dbName: 'db',
    collectionName: 'database', // MongoDB collection name to use.

    mongoClientOptions: {
        // MongoDB client options here.
    }
})

const main = async (): Promise<void> => {

    // checking for updates (optional)
    const versionData = await db.checkUpdates()
    console.log(versionData)

    // output:
    // {
    //   updated: true,
    //   installedVersion: '1.0.2',
    //   packageVersion: '1.0.2'
    // }


    // [IMPORTANT] - connect to database
    console.log('Connecting to database...') // also using a 'connecting' event (line 130) for that is allowed
    await db.connect() // using promise instead of listening to 'ready' event (line 118) is allowed

    // database ping
    await db.ping()

    // output:
    // {
    //    readLatency: 123,
    //    writeLatency: 123,
    //    deleteLatency: 123
    // }


    // SETTING DATA

    // setting object in database
    await db.set<Omit<IAccountData['auth'], 'password'>>('accountData.auth', {
        username: 'shadowplay'
    })

    // setting a property in object
    await db.set<string>('accountData.auth.password', 'test123')

    // accountData in database:
    // {
    //     auth: {
    //         username: 'shadowplay',
    //         password: 'test123'
    //     }
    // }

    // is the element exists in database
    await db.has('accountData') // true


    // ARRAYS

    // pushing into an array
    await db.push<string>('accountData.roles', 'admin') // accountData.roles in database: ['admin']

    // pushing into an array
    await db.push<string>('accountData.roles', 'member') // accountData.roles in database: ['admin', 'member']

    // getting random element from array
    await db.random('accountData.roles') // 'admin' or 'member' - random element from roles array each time

    // changing the array element in database
    await db.changeElement<string>('accountData.roles', 0, 'user') // accountData.roles in database: ['user', 'member']

    // changing the array element in database
    await db.removeElement('accountData.roles', 0) // accountData.roles in database: ['member']


    // NUMBERS

    // adding to a number
    await db.add('accountData.balance', 100)

    // subtracting from a number
    await db.subtract('accountData.balance', 50)

    // deleting properties
    await db.delete('accountData.roles')


    // GETTING DATA

    const data = await db.fetch<IAccountData>('accountData')
    console.log(data)


    // OTHER

    // getting the object keys
    await db.keysList('') // will return the list of keys of all MongoDB documents
    await db.keysList('accountData') // ['auth', 'balance']

    // getting all database contents
    await db.all()

    // getting raw database contents
    await db.raw()

    // disconnect from database
    await db.disconnect()
}


// listening to 'ready' event if successfully connected:
db.on('ready', () => {
    console.log('Connected to database!')
})

// listening to 'destroy' event if the connection was closed:
db.on('destroy', () => {
    console.log('Connection was closed.')
})


// listening to 'connecting' event if started to connect to database:

// db.on('connecting', () => {
//     console.log('Connecting to database...')
// })

main()

interface IAccountData {
    auth: {
        username: string
        password: string
    }
    balance: number
    roles: string[]
}
