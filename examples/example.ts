import QuickMongo from '../src/index'

const db = new QuickMongo({
    connectionURI: 'your mongodb connection URI here',
    dbName: 'db',
    collectionName: 'database' // MongoDB collection name to use
})

const main = async () => {

    // connect to database
    console.log('Connecting to database...') // also using a 'connecting' event (line 86) for that is allowed
    await db.connect() // using promise instead of listening to 'ready' event (line 76) is allowed


    // SETTING DATA

    // setting object in database
    await db.set<Omit<AccountData['auth'], 'password'>>('accountData.auth', {
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


    // ARRAYS

    // pushing into an array
    await db.push<string>('accountData.roles', 'admin') // accountData.roles in database: ['admin']

    // changing the array element in database
    await db.changeElement<string>('accountData.roles', 0, 'user') // accountData.roles in database: ['user']

    // changing the array element in database
    await db.removeElement('accountData.roles', 0) // accountData.roles in database: []


    // NUMBERS

    // adding to a number
    await db.add('accountData.balance', 100)

    // subtracting from a number
    await db.subtract('accountData.balance', 50)

    // deleting properties
    await db.delete('accountData.roles')


    // GETTING DATA

    await db.fetch<AccountData>('accountData')


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

// listening to 'ready' event if successfully connected
db.on('ready', () => {
    console.log('Connected to database!')
})

// listening to 'destroy' event if the connection was closed
db.on('destroy', () => {
    console.log('Connection was closed.')
})

// listening to 'connecting' event if started to connect to database
// db.on('connecting', () => {
//     console.log('Connecting to database...')
// })

main()

interface AccountData {
    auth: {
        username: string
        password: string
    }
    balance: number
    roles: string[]
}