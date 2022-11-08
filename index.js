const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const jwt = require('jsonwebtoken');


app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ypkrnke.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run(){
    try{
        const serviceCollection = client.db('aerovisa').collection('services');
        const reviewCollection = client.db('aerovisa').collection('reviews');

        app.get('/services', async(req,res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/3services', async(req,res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const result = await cursor.limit(3).toArray();
            res.send(result);
        })

        // app.get('/reviews', async(req,res)=>{
        //     const query = {};
        //     const cursor = reviewCollection.find(query);
        //     const result = await cursor.toArray();
        //     res.send(result);
        // })

        app.get('/reviews', async(req,res)=>{
            const query = req.query;
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
            console.log(result);
        })

    }
    finally{

    }
}

run().catch(error=>console.log(error));

app.get('/', (req,res)=>{
    res.send('Server is running');
})

app.listen(port, ()=>{
    console.log('server running on port', port);
})