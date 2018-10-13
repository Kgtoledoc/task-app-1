const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const assert = require('assert');
const MongoClient = mongo.MongoClient;
const ObjectId = require('mongodb').ObjectId;


const url = "mongodb://localhost:27017" || "mongodb://ds121311.mlab.com:21311";

const port = process.env.PORT || 3000;

const dbName = 'task-app';

app.use("/", express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.post("/tasks/new", function(req, res) {
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    let tasks = db.collection('tasks');
    tasks.insertOne({
      timestamp: new Date(),
      description: req.body.description,
    });
  });
});

app.get("/tasks", function(req, res) {
  MongoClient.connect(url, function(err, client){
    if( !err ){
      console.log('Connected successfully to server');
      const db = client.db(dbName);
      let tasks = db.collection('tasks');
      tasks.find({}).toArray(function(error, results){
        res.send(JSON.stringify(results));
      });
    }
  });
});

app.put("/tasks/update/:id", function(req, res){
  MongoClient.connect(url, function(err, client) {
    const db = client.db(dbName);
    let tasks = db.collection('tasks');
    tasks.update({
      _id: new ObjectId(req.params.id),
    }, {$set: {
      description: req.body.description,
    }});
    tasks.find({}).toArray(function(error, results){
      console.log(results);
    });
  });
});

app.delete("/tasks/delete/:id", function(req, res) {
  MongoClient.connect(url, function(err, client){
    const db = client.db(dbName);
    let tasks = db.collection('tasks');
    tasks.remove({ _id: new ObjectId(req.params.id)}, function(err, result){
      if (err) {
        console.log(err);
      }
      else {
        console.log(result);
      }

    })
  })
})

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/index.html");
  res.sendFile(__dirname + "/script.js");
  res.sendFile(__dirname + "/style.css")
});

app.listen(port, function(err){
  if (!err) {
    console.log(`Server listening ${port}`);
  } else {
    console.log('Something is wrong');
  }
});


/*MongoClient.connect(url, function(err, client) {
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  client.close();
})*/
