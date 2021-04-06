const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;
console.log(process.env.DB_USER);

const app = express();

app.use(bodyParser.json());
app.use(cors());

const MongoClient = require("mongodb").MongoClient;
// const { ObjectID } = require('bson');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.npsqi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  console.log("connection err", err);
  const foodCollection = client.db("budget-foods").collection("foods");
  console.log("database connected");

  app.post("/addFood", (req, res) => {
    const newFood = req.body;
    console.log("adding new data", newFood);

    foodCollection.insertOne(newFood).then((result) => {
      console.log(result);
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });
  app.get("/foods", (req, res) => {
    foodCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.get("/foods/:id", (req, res) => {
    console.log(req.params.id);
    foodCollection
      .find({ _id: ObjectID(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
  app.delete("/delete/:id",(req, res) => {
    console.log("delete this",req.params.id);
    foodCollection
      .deleteOne({_id:ObjectId(req.params.id)})
      .then((result) => {
        console.log(result);
        res.send(result);
      });
  });
});

app.get("/", (req, res) => {
  res.send("hey...whats up?!");
});

app.listen(process.env.PORT || port);
