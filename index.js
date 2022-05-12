const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const url = 'mongodb+srv://jusi24:Ogo1ohyKPJcMV8Mx@cluster0.iflhr.mongodb.net/animes?retryWrites=true&w=majority';
const client = new MongoClient(url);
// const dbName = 'cinemaapp';

let collection;

async function dbConnect(coll) {
    await client.connect();
    console.log('Database connected');
    // const db = client.db(dbName);
    const db = client.db();
    collection = db.collection(coll);
}

app.get('/api/animes', (req, res) => {
    dbConnect('series')
        .then(async () => {
            const findResult = await collection.find({}).toArray();
            res.json(findResult);
        })
        .catch(err => console.log('Error connection'))
        .finally(() => client.close());
});

app.post('/api/animes', (req, res) => {
    dbConnect('series')
        .then(async () => {
            const payLoad = req.body;
            const insertResult = await collection.insertOne(payLoad);
            res.json(insertResult);
        })
        .catch(err => console.log('Error connection'))
        .finally(() => client.close());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on http://127.0.0.1:' + PORT);
});