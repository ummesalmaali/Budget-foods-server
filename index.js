const express = require('express')

const bodyParser = require('body-parser');
const cors = require('cors');

const port = 5000


const app = express()

app.use(bodyParser.json());
app.use(cors());



const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.npsqi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const foodCollection = client.db('budget-foods').collection("foods");
  console.log('database connected successfully')
  app.post('/addFood',(req,res) => {
    const foods = req.body;
    foodCollection.insertMany(foods)
    .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount);
    })
  })
  app.get('/foods',(req,res) => {
      foodCollection.find({})
      .toArray((err,documents) =>{
          res.send(documents);
      })
  })
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port);