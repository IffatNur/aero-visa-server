const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();


app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ypkrnke.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// function verifyJWT(req, res, next){
//     const authHeader = req.headers.authorization;
//     if(!authHeader){
//         return res.status(401).send({message: 'Unauthorized access'});
//     }
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(error, decoded){
//         if(error){
//             return res.status(401).send({message: 'unauthorized access'});
//         }
//         req.decoded = decoded;
//         next();
//     });
// }

async function run(){
    try{
      const serviceCollection = client.db("aerovisa").collection("services");
      const reviewCollection = client.db("aerovisa").collection("reviews");

      app.post("/jwt", async (req, res) => {
        const user = req.body;
        console.log(user);
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "10h",
        });
        res.send({ token });
      });

      app.get("/services", async (req, res) => {
        const query = {};
        const cursor = serviceCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      });

      //  to add new services
      app.post("/services", async (req, res) => {
        const query = req.body;
        const result = await serviceCollection.insertOne(query);
        res.send(result);
      });

      app.get("/services/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await serviceCollection.findOne(query);
        res.send(result);
      });

      app.get("/threeservices", async (req, res) => {
        const query = {};
        const cursor = serviceCollection.find(query);
        const result = await cursor.limit(3).toArray();
        res.send(result);
      });

      // for slider  verifyJWT,
      app.get("/reviews", async (req, res) => {
        // const decoded = req.decoded;
        const query = req.query;
        // if (decoded.email === query?.email) {
        //     res.status(403).send({ message: "Unauthorized access" });
        //   }
        const cursor = reviewCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      });

      // to post a new review
      app.post("/reviews", async (req, res) => {
        const query = req.body;
        const result = await reviewCollection.insertOne(query);
        res.send(result);
      });

      app.patch("/reviews/:id", async (req, res) => {
        const id = req.params.id;
        const review = req.body;
        const filter = { _id: ObjectId(id) };
        const updatedDoc = {
          $set: {
            review: review,
          },
        };
        const result = await reviewCollection.updateOne(filter, updatedDoc);
        res.send(result);
      });

      // delete review
      app.delete("/reviews/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await reviewCollection.deleteOne(query);
        res.send(result);
      });
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