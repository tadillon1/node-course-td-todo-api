var express = require('express');
var bodyParser = require('body-parser');

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



app.listen(3000, () => {
  console.log('Started on port 3000');
});


module.exports = {app};
