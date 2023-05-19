const express=require('express');
const cors=require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app=express();
const port=process.env.PORT ||5000;

// middleware
app.use(cors());
app.use(express.json());
// mongodb connect..................
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.wu2rnap.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser:true,
  useUnifiedTopology:true,
  maxPoolSize:10,
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect((err)=>{
        if(err){
            console.error(err);
            return;
        }
     });

     const toyRobotsCollection=client.db('toyRobots').collection('toys');
     app.get('/toyRobots', async(req, res)=>{
        const result=await toyRobotsCollection.find().toArray();
        res.send(result);
     })

     app.post('/toyRobots', async(req, res)=>{
       
        const toy=req.body;
     
        console.log(toy);
        const result=await toyRobotsCollection.insertOne(toy);
        res.send(result);

     })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Robot server is running........');
})

app.listen(port, () => {
    console.log(`Robot server is running on port ${port}`)
})