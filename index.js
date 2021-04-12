const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const port = 5000;
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.17hrv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const eventsCollection = client.db("volunteer-network").collection("events");
    const registrationCollection = client.db("volunteer-network").collection("registration");
    // perform actions on the collection object

    app.get('/events', (req, res) => {
        eventsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/event/:id', (req, res) => {
        const id = req.params.id;
        eventsCollection.find({ _id: ObjectId(id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/addRegistration', (req, res) => {
        const registration = req.body;
        registrationCollection.insertOne(registration, (err, result) => {
            res.send({ count: result.insertedCount });
        })
    })

    app.get('/registrations', (req, res) => {
        registrationCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/registration/:email', (req, res) => {
        const email = req.params.email;
        registrationCollection.find({email: email})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/addEvent', (req, res) => {
        const event = req.body;
        eventsCollection.insertOne(event, (err, result) => {
            res.send({ count: result.insertedCount });
        })
    })

    app.delete('/deleteRegistration/:id', (req, res) => {
        const id = req.params.id;
        registrationCollection.deleteOne({_id: ObjectId(id)}, (err) => {
            if(!err) {
                res.send({count: 1})
            }
        })

    })

    //   app.post('/addEvents', (req, res) => {
    //     const events = req.body;
    //     eventsCollection.insertMany(events, (err, result) => {
    //         res.send({count: result});
    //     })
    //   })

    app.get('/', (req, res) => {
        res.send('Hello World!');
    })

});

app.listen(port);