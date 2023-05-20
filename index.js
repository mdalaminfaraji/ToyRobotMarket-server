const express=require('express');
const cors=require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
      const indexKeys={toyName:1};
      const indexOptions={name:'toyName'};
      const result=await toyRobotsCollection.createIndex(indexKeys, indexOptions);


      app.get('/myToyRobots/:email', async(req,res)=>{
        // console.log(req.params.email);
        const result=await toyRobotsCollection.find({sellerEmail:req.params.email}).toArray();
        res.send(result);
      })

    //  app.get('/toyRobots', async(req, res)=>{
    //     const { sort } = req.query;
    //     const sortOptions = {};
    //     if (sort === 'ascending') {
    //         sortOptions.price = 1;
    //       } else if (sort === 'descending') {
    //         sortOptions.price = -1;
    //       } 

    //     console.log(sort);
    //     const toys=await toyRobotsCollection.find().sort(sortOptions);
       
    //     res.send(toys);
    //  })
    app.get('/descending', async (req, res) => {
        try {
          const toyRobots = await toyRobotsCollection.find().sort({ price: -1 });
          console.log(toyRobots);
          res.send(toyRobots);
        } catch (error) {
          console.error('Error fetching toy robots:', error);
          res.status(500).json({ error: 'An error occurred while fetching toy robots' });
        }
      });
      
     app.get('/toyRobotsText/:text', async(req, res)=>{
        const searchText=req.params.text;
        console.log(searchText);
       
             const result=await toyRobotsCollection.find({
            toyName:{$regex:searchText, $options:'i'}
        }).toArray();
         res.send(result);
      
       
       
     })


     app.get('/toyRobots', async(req, res)=>{
        const result=await toyRobotsCollection.find().toArray();
        res.send(result);
     })

     app.get('/toyRobots/:id',async(req, res)=>{
        console.log(req.params.id);
        const id=req.params.id;
        const query={ _id: new ObjectId(id) };
        const result=await toyRobotsCollection.findOne(query);
        res.send(result);
     })
     app.delete('/toyRobotsDelete/:id',async(req, res)=>{
        console.log(req.params.id);
        const id=req.params.id;
        const query={ _id: new ObjectId(id) };
        const result=await toyRobotsCollection.deleteOne(query);
        res.send(result);
     })
     app.put('/toyRobotsUpdate/:id',async(req, res)=>{
        console.log(req.params.id);
        const id=req.params.id;
        const filter={ _id: new ObjectId(id) };
        const {price, availableQuantity, details}=req.body;
        const updateBody={
            $set:{
                price, availableQuantity, details
            }
        }
        const result=await toyRobotsCollection.updateOne(filter, updateBody);
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