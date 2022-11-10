const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



require('dotenv').config();
const app = express();



const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)

//database api
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.upngnl9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


//JWT function
function verifyJWT(req, res, next){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).send({message: 'unauthorized access'});
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.TOKEN_SC, function(err, decoded){
        if(err){
            return res.status(403).send({message: 'Forbidden access'});
        }
        req.decoded = decoded;
        next();
    })
}











async function run(){
    try{

        const serviceCollection = client.db('interior-services').collection('services');
        const ReviewCollection = client.db('userReviews').collection('userReviews');


        app.post('/jwt', (req, res) =>{
            const user = req.body;
            console.log(user);
            const token = jwt.sign(user, process.env.TOKEN_SC, { expiresIn: '1d'})
            res.send({token})
        })  

      



      
// get homepage services data

        app.get('/services', async (req, res) =>{
           
            const query ={};
            const cursor =  serviceCollection.find(query).limit(3).sort({timestamp: -1});
            const services = await cursor.toArray();
            res.send(services);
        });

// get all services data
        app.get('/allservices', async (req, res) =>{
           
            const query ={};
            const cursor =  serviceCollection.find(query).sort({timestamp: -1});
            const services = await cursor.toArray();
            res.send(services);
        });

     

     
        // get single service by id 

        app.get("/service/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        
          });



          //get review
          app.get('/productreviews/id', async (req, res) => {


            const id = req.params.id;

            let query = {_id: ObjectId(id)};
           
            const cursor = ReviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

//get user service
        app.get('/userServices', verifyJWT, async (req, res) => {

            const decoded = req.decoded;
            
            if(decoded.email !== req.query.email){
                res.status(403).send({message: 'unauthorized access'})
            }

            
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = serviceCollection.find(query);
            const Services = await cursor.toArray();
            res.send(Services);
        });

// use review
        app.get('/userreviews', verifyJWT, async (req, res) => {

            const decoded = req.decoded;
            
            if(decoded.email !== req.query.email){
                res.status(403).send({message: 'unauthorized access'})
            }
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = ReviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.get('/productreviews', async (req, res) => {

            
            let query = {};
            if (req.query.id) {
                query = {
                    id: req.query.id
                }
            }
            const cursor = ReviewCollection.find(query).sort({timestamp: -1});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });
        
        app.delete('/review/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ReviewCollection.deleteOne(query);
            res.send(result);
        })
        
        app.delete('/service/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })
        
        
        
        
    //send service


        app.post('/addservice', verifyJWT, async (req, res) => {
            const Services = req.body;
            const result = await serviceCollection.insertOne(Services);
            res.send(result);
        });



//send review

        app.post('/addreview', async (req, res) => {
            const service = req.body;
            const result = await ReviewCollection.insertOne(service);
            res.send(result);
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