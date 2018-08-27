const express = require('express');
const server = express();
const db = require('./data/db')
const bodyParser = require('body-parser')

server.use(bodyParser.json())

server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

server.get('/', (req, res) => {
  res.send('Hello World');
});

server.get('/api/posts', (req, res) => {
  db.find()
  .then((results)=>{
    res.status(200).json(results);
  })
  .catch(()=>{
    res.status(500).json({ error: "The posts information could not be retrieved." });
  });
});
server.get('/api/posts/:postID', (req, res) => {
  db.findById(req.params.postID).then((results)=>{
    if(results === undefined || results.length == 0){
      res.status(404).json({ message: "The post with the specified ID does not exist." });
    }
    else{
      res.status(200).json(results);
    }
  })
  .catch((error)=>{
    console.log(error)
    res.status(500).json({ error: "The posts information could not be retrieved." });
  });
});

server.post('/api/posts', (req, res) => {
  if(req.body.title === undefined||req.body.contents === undefined){
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
  }
  db.insert(req.body).then((results)=>{
    db.findById(results.id).then((results)=>{
      if(results === undefined || results.length == 0){
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      }
      else{
        res.status(201).json(results);
      }
    res.status(201).json(results.id);
    })
  }).catch((error)=>{
    console.log(error)
    res.status(500).json({ error: "There was an error while saving the post to the database"});
  });
});

server.delete('/api/posts/:postID', (req, res) => {
  db.findById(req.params.postID).then((results)=>{
    if(results === undefined || results.length === 0){
      res.status(404).json({ message: "The post with the specified ID does not exist." });
    }
    else{
      db.remove(req.params.postID).then((r)=>{
        if(r===1){
          res.status(200).json(results);
        }
        else{
          res.status(500).json({ error: "Something went wrong" });
        }
      })
    }
  })
  .catch((error)=>{
    console.log(error)
    res.status(500).json({ error: "The posts information could not be retrieved." });
  });
});

server.put('/api/posts/:postID', (req, res) => {
  if(req.body.title === undefined||req.body.contents === undefined){
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
  }
  db.update(req.params.postID,req.body).then((results)=>{
    console.log(results)
    db.findById(req.params.postID).then((r)=>{
      if(r === undefined || r.length == 0){
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      }
      else{
        res.status(200).json(r);
      }
    })
  }).catch((error)=>{
    console.log(error)
    res.status(500).json({ error: "There was an error while saving the post to the database"});
  });
});
server.listen(8000, () => console.log('API running on port 8000'));