const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Server is running!')
})

//


const uri = "mongodb+srv://smartDB:BcPy1TkSmRbVH5DK@cluster0.jwgya6a.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const db = client.db('smart_db');
    const productsCollection = db.collection('products');
    const bidsCollection = db.collection('bids');

    app.get('/products', async(req, res) => {
      const cursor = productsCollection.find();
      // const cursor = productsCollection.find().sort({price_min: 1}).limit(2);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/products/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    app.post('/products', async(req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    app.patch('/products/:id', async(req, res) => {
      const id = req.params.id;
      const updateProduct = req.body;
      const query = { _id: new ObjectId(id)}
      const update = {
       $set: {
        name: updateProduct.name,
        role: updateProduct.role
       }
      }
      const result = await productsCollection.updateOne(query, update);
      res.send(result);
    })

    app.delete('/products/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });


    // bids related apis
    app.get('/bids', async(req, res)=>{
      const email = req.query.email;
      const query = {};
      if(email){
        query.buyer_email = email;
      }

      const cursor = bidsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
