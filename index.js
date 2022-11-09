const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');



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
        // const orderCollection =client.db('g-car').collection('orders');


        app.get('/services', async (req, res) =>{
            const query ={};
            const cursor =  serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
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