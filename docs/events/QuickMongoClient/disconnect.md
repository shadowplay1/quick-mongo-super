# **`QuickMongoClient#disconnect` Event**

Emits when the MongoDB connection was destroyed.

- **Eaxmple:**
```ts
quickMongo.on('disconnect', () => {
    console.log('Disconnected from MongoDB.')
})
```
