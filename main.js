const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost/robotsdb';
var data;


let getAllUsers = function(db, callback){
  let users = db.collection('robotsuserdata');
  users.find().toArray().then(function(allUsers){
    data = allUsers;
    callback();
  })
};

let getAvailable = function(db, callback){
  let users = db.collection('userdata');
  users.find({"job":null}).toArray().then(function(unemployed){
    data = unemployed;
    callback();
  })
}

let getData = function(req, res, next){
  mongoClient.connect(url, function(err, db){
    console.log("connected");
    if (req.params.hireme === 'true') {
      getAvailable(db, function(){
        db.close();
        next();
      })
    } else{
      getAllUsers(db, function(){
        db.close();
        next();
      })
    }
  })
};


app.get('/', getData, function(req, res){
  res.render('homepage', {users: data});
})

app.get('/forhire/:hireme', getData, function(req, res){
  res.render('unemployed', {users:data})
})



app.listen(3000, function() {
  console.log("working");
})
