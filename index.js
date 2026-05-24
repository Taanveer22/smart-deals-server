require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

// instance
const app = express();
const port = process.env.PORT || 5000;

// middlewars
app.use(express.json());
app.use(cors());

// database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.89rnkti.mongodb.net/?appName=Cluster0`;
// console.log(uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    // =================================================
    const db = client.db('smartDealsDB');
    const productsColl = db.collection('productsColl');

    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      const result = await productsColl.insertOne(newProduct);
      res.send(result);
    });

    // =================================================
    await client.db('admin').command({ ping: 1 });
    console.log('You successfully connected to MongoDB!');
  } finally {
    // await client.close();
    console.log('finished client work');
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello from smart deals..');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
