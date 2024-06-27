const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
console.log(port);

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.inaaonr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const touristsCollection = client.db('touristsDB').collection('tourists');
        const countryCollection = client.db('CountryDB').collection('Country');

        app.get('/tourists', async (req, res) => {
            const cursor = touristsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/Country', async (req, res) => {
            const cursor = countryCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/tourists', async (req, res) => {
            const newTourists = req.body;
            console.log(newTourists);
            const result = await touristsCollection.insertOne(newTourists);
            res.send(result);
        })


        app.put('/tourists/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateSpot = req.body;
            const spot = {
                $set: {
                    photo: updateSpot.photo,
                    SpotName: updateSpot.SpotName,
                    country: updateSpot.country,
                    location: updateSpot.location,
                    description: updateSpot.description,
                    cost: updateSpot.cost,
                    seasonality: updateSpot.seasonality,
                    travelTime: updateSpot.travelTime,
                    totalVisitorsPerYear: updateSpot.totalVisitorsPerYear,
                    email: updateSpot.email,
                    userName: updateSpot.userName
                }
            }

            const result = await touristsCollection.updateOne(filter, spot, options);
            res.send(result);
        })


        app.delete('/tourists/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await touristsCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Tourism Management server is running this home page')
})

app.listen(port, () => {
    console.log(`Tourism Management Server is running on port number: ${port}`)
})
