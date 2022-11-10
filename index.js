const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



require('dotenv').config();
const app = express();



const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.upngnl9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{

        const serviceCollection = client.db('interior-services').collection('services');
        const ReviewCollection = client.db('userReviews').collection('userReviews');
        // const orderCollection =client.db('g-car').collection('orders');



        app.get('/services', async (req, res) =>{
           
            const query ={};
            const cursor =  serviceCollection.find(query).limit(3);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/allservices', async (req, res) =>{
           
            const query ={};
            const cursor =  serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.post('/addservice', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        });

        app.post('/addreview', async (req, res) => {
            const service = req.body;
            const result = await ReviewCollection.insertOne(service);
            res.send(result);
        });
        

        app.get("/service/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        
          });









        app.get('/userServices', async (req, res) => {
            

            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = serviceCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });

       

        












    }
    finally{

    }
}

run().catch(err => console.log(err));



app.get('/', (req, res)=>{
    res.send('Assignment server Running');
});


app.listen(port, () => {
    console.log(`running on this port ${port}`)
    })