// NOTE: This file was **never** meant to be ran like a normal TypeScript file.

// NOTE: This file serves a purpose of **testing** the module's type system.
// NOTE: Just like the logic testing in *.test.ts files, but to test how the types will behave in various cases.

// NOTE: All values provided in this code's file doesn't make any logical sense.
// NOTE: The main purpose of this is to test the types, not the code itself.

interface IData {
    name: string
    collectionName?: string
    nested: {
        nested1: string
        nested2: number
        nested3: {
            nested31: string
            nested32: number
        }
    }
}

import { QuickMongo, QuickMongoClient } from '../src/index'

const quickMongoClient = new QuickMongoClient('sdfsdfsdf')


new QuickMongoClient('sdfsdfsdf', {}, {})
// @ts-expect-error
new QuickMongoClient(123, {}, {})
// @ts-expect-error
new QuickMongoClient(123, {}, 'sdfsdfsdf')
// @ts-expect-error
new QuickMongoClient('sdfsdfsdf', {}, 123)


const quickMongo = new QuickMongo<string, IData>(quickMongoClient, {
    name: 'dsfsdfsdf',
    collectionName: 'sdfsdfsdf'
})

const quickMongo1 = new QuickMongo<string, number>(quickMongoClient, {
    name: 'dsfsdfsdf',
    collectionName: 'sdfsdfsdf'
})

new QuickMongo(quickMongoClient, {
    name: 'dsfsdfsdf'
})
// @ts-expect-error
new QuickMongo(quickMongoClient)
// @ts-expect-error
new QuickMongo(quickMongoClient, {})
new QuickMongo(quickMongoClient, {
    // @ts-expect-error
    name: 123
})
new QuickMongo(quickMongoClient, {
    name: 'sdfsdfsdf',
    // @ts-expect-error
    collectionName: 123
})

quickMongo.get('name')
quickMongo.get('nested')
quickMongo.get('nested.nested1')
quickMongo.get('nested.nested2')
quickMongo.get('nested.nested3')
quickMongo.get('nested.nested3.nested31')
quickMongo.get('nested.nested3.nested32')
quickMongo1.get('test')
quickMongo1.get('sdfsdfsdf')

// @ts-expect-error
quickMongo.get('sdfsdfsdf')
// @ts-expect-error
quickMongo.get('nested123')
// @ts-expect-error
quickMongo.get('nested.nested3.asdasdasd')
// @ts-expect-error
quickMongo.get('nested.nested2.nested31')
// @ts-expect-error
quickMongo.get(123)
// @ts-expect-error
quickMongo1.get(123)

quickMongo.set('name', 'sdfsdfsdf')
quickMongo.set('collectionName', 'sdfsdfsdf')
quickMongo.set('nested', {
    nested1: 'asdasd',
    nested2: 123,
    nested3: {
        nested31: 'sdfsdfsdf',
        nested32: 123
    }
})
quickMongo.set('nested.nested1', 'dsfsdfsdf')
quickMongo.set('nested.nested2', 123)
quickMongo.set('nested.nested3', {
    nested31: 'sdfsdfsdf',
    nested32: 123
})
quickMongo.set('nested.nested3.nested31', 'asdasdasd')
quickMongo.set('nested.nested3.nested32', 123)


// @ts-expect-error
quickMongo.set('name', 123)
// @ts-expect-error
quickMongo.set('collectionName', 213)
// @ts-expect-error
quickMongo.set('nested', 'fsdfsdfsdfsdf')
// @ts-expect-error
quickMongo.set('nested.nested1', true)
// @ts-expect-error
quickMongo.set('nested.nested2', 'sdfsdfsdfsdfsf')
// @ts-expect-error
quickMongo.set('nested.nested3', 'dsfsdfsdfsdf')
// @ts-expect-error
quickMongo.set('nested.nested3.nested31', 123)
// @ts-expect-error
quickMongo.set('nested.nested3.nested32', false)
// @ts-expect-error
quickMongo1.set('sdsdsdsd', true)
// @ts-expect-error
quickMongo1.set(123, 123)
// @ts-expect-error
quickMongo1.set(123, 'sddffddf')
