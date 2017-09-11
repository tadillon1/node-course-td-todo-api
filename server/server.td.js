var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express ();

app.use(bodyParser.json());  // bodyParser send json to the server.

app.post('/todos', (req, res) => {  //Create a new todo using POST.  json is the body which is the todo information. /todo is the URL for creating new todo
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => { //save the todo to the DB
    res.send(doc);          //send the doc back to the user
  }, (e) => {
    res.status(400).send(e);  //if and error happened then send status=400 back
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos})
  }, e => {
    res.status(400).send(e);
  });
});


//GET /todos/123456  --> GET a single todo by ID
app.get('/todos/:id', (req, res) =>  { //This gets the value after the /todos/###
  var id = req.params.id;   //Set the id variable equal to the params.id from the web-call
}

  // validate id is valid
    //respond with 404 if not valid - Send back emptp body
    // if(!ObjectID.isValid(id)) {   //validate the ID is a valid MongoDB ID.
    //   return res.status(404).send();     //If the id is not valid send status 404 and empty body
    // }


  //findById
    //success
      //if todo - Send it back
      //if no todo - Send 404 with empty body
    //error
      //error - 400 - and send empty body back




     //Create an ID variable


app.listen(3000, () => {
  console.log('Started on port 3000');
});


module.exports = {app};
