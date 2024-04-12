# **`QuickMongoClient#disconnect` Event**

Emits when the MongoDB connection was destroyed.

- **Example:**
```ts
quickMongo.on('disconnect', () => {
    console.log('Disconnected from MongoDB.')
})
```
