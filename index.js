// packages
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const admin = require('firebase-admin');

// firebase
if (!process.env.FB_SERVICE_KEY) {
  throw new Error('FB_SERVICE_KEY not set');
}

const decodedServiceKey = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString('utf8');
const serviceAccount = JSON.parse(decodedServiceKey);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// instance
const app = express();
const port = process.env.PORT || 5000;

// middlewars
app.use(express.json());
app.use(cors());

const verifyFirebaseToken = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ message: 'unauthorized access' });
  }
  const token = authorization.split(' ')[1];
  console.log('token received:', token);

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userRecord = await admin.auth().getUser(decodedToken.uid);
    req.token_email = decodedToken?.email || userRecord?.providerData[0]?.email;
    // console.log('decoded token', decodedToken);
    console.log('decoded token email', decodedToken?.email);
    // console.log('user record', userRecord);
    console.log('user record email', userRecord?.providerData[0]?.email);
    next();
  } catch (error) {
    console.log('token error:', error.message);
    return res.status(401).send({ message: 'unauthorized access token' });
  }
};

// database
if (!process.env.DB_USER || !process.env.DB_PASS) {
  throw new Error('DB_USER or DB_PASS not set');
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.89rnkti.mongodb.net/?appName=Cluster0`;

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
    console.log('db connected');
    // =================================================
    const db = client.db('smartDealsDB');
    const productsColl = db.collection('productsColl');
    const bidsColl = db.collection('bidsColl');
    const usersColl = db.collection('usersColl');

    // =================================================
    app.post('/users', async (req, res) => {
      const query = { email: req.body.email };
      const existingUser = await usersColl.findOne(query);
      if (existingUser) {
        res.send({ message: 'user already exist' });
      } else {
        const newUser = req.body;
        const result = await usersColl.insertOne(newUser);
        res.send(result);
      }
    });

    // =================================================
    app.get('/products', verifyFirebaseToken, async (req, res) => {
      const email = req.query.email;
      // console.log('query email:', email);
      // console.log('token email:', req.token_email);
      let query = {};

      if (email) {
        if (email !== req.token_email) {
          return res.status(403).send({ message: 'forbidden access' });
        }
        query.seller_email = email;
      }
      // console.log(query);
      const cursor = productsColl.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/products/all', async (req, res) => {
      // const cursor = productsColl
      //   .find()
      //   .sort({ price_min: 1 })
      //   .skip(10)
      //   .limit(5)
      //   .project({ title: 1, email: 1, _id: 0 });
      const cursor = productsColl.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/products/recent', async (req, res) => {
      const cursor = productsColl.find().sort({ created_at: -1 }).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/products/:id', async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await productsColl.findOne(query);
      res.send(result);
    });

    app.post('/products', verifyFirebaseToken, async (req, res) => {
      // console.log('headers', req.headers);
      const newProduct = req.body;
      const result = await productsColl.insertOne(newProduct);
      res.send(result);
    });

    app.patch('/products/:id', async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const update = {
        $set: {
          price_min: req.body.price_min,
          price_max: req.body.price_max,
        },
      };
      const result = await productsColl.updateOne(query, update);
      res.send(result);
    });

    app.delete('/products/:id', async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await productsColl.deleteOne(query);
      res.send(result);
    });

    // =================================================
    app.get('/bids', verifyFirebaseToken, async (req, res) => {
      const email = req.query.email;
      // console.log('query email:', email);
      // console.log('token email:', req.token_email);
      let query = {};
      if (email) {
        if (email !== req.token_email) {
          return res.status(403).send({ message: 'forbidden access' });
        }
        query.buyer_email = email;
      }
      // console.log(query);
      const cursor = bidsColl.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/bids/:id', async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await bidsColl.findOne(query);
      res.send(result);
    });

    app.get('/bids/product/:productId', async (req, res) => {
      const query = { productId: req.params.productId };
      const cursor = bidsColl.find(query).sort({ bid_price: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post('/bids', verifyFirebaseToken, async (req, res) => {
      const newBid = req.body;
      const result = await bidsColl.insertOne(newBid);
      res.send(result);
    });

    app.patch('/bids/:id', async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const update = {
        $set: {
          bid_price: req.body.bid_price,
          status: req.body.status,
        },
      };
      const result = await bidsColl.updateOne(query, update);
      res.send(result);
    });

    app.delete('/bids/:id', async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await bidsColl.deleteOne(query);
      res.send(result);
    });

    // =================================================
    // await client.db('admin').command({ ping: 1 });
    console.log('ping checked');
  } finally {
    // await client.close();
    console.log('client remains open for requests');
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello from smart deals..');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
